import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Level, Mood, Who } from '../types'
import { characterSvg, ctx, layoutFor, outfitFor } from './draw'
import { CLOSE_LABEL, GESTURES, HELLO, LEVELS, PERSONA, SAY, SYSTEM, TITLE, VERBS } from './lines'
import { RH, RW, clippyRaster } from './raster'
import { SOUND_MODES, clipFor } from './sound'

const PANE = 'sidekick'
const frame = atom({ plugin: 'sidekick', key: 'frame' } as const, 0)
const bubble = atom({ plugin: 'sidekick', key: 'bubble' } as const, 'Gelmişsin. Ben de tam bir şey yapmıyordum.')
const talking = atom({ plugin: 'sidekick', key: 'talking' } as const, false)
const mood = atom({ plugin: 'sidekick', key: 'mood' } as const, 'normal' as Mood)
const stats = atom({ plugin: 'sidekick', key: 'stats' } as const, { tools: 0, turns: 0, escapes: 0, pokes: 0 })
const level = atom({ plugin: 'sidekick', key: 'level' } as const, 1 as Level)
const who = atom({ plugin: 'sidekick', key: 'who' } as const, 'clippy' as Who)
const walk = atom({ plugin: 'sidekick', key: 'walk' } as const, false)
const gaze = atom({ plugin: 'sidekick', key: 'gaze' } as const, { gx: 0, gy: 0 })
const sound = atom({ plugin: 'sidekick', key: 'sound' } as const, 0)
const gest = atom({ plugin: 'sidekick', key: 'gest' } as const, '')
const run = atom({ plugin: 'sidekick', key: 'run' } as const, { running: false, elapsed: 0, tool: '' })

const pick = <T,>(xs: T[]): T => xs[Math.floor(Math.random() * xs.length)]

// Bir havuzun anahtarını bulup aktif karakterin karşılığını döndürür
const linesFor = async ($: any, lines: string[]) => {
  const w = await read($, who)
  if (w === 'clippy') return lines
  const key = Object.keys(SAY).find(k => (SAY as Record<string, string[]>)[k] === lines)
  const alt = key ? PERSONA[w][key] : undefined

  return alt ?? lines
}

const DANGER = /rm\s+-[a-z]*r[a-z]*f|rm\s+-rf|git\s+push\b.*(--force|\s-f\b)|git\s+reset\s+--hard|drop\s+(table|database)|remove-item\b.*-recurse.*-force|del\s+\/s|format\s+[a-z]:/i
const TEST = /\b(npm|pnpm|yarn)\s+(run\s+)?test\b|pytest|jest|vitest|dotnet\s+test|go\s+test|cargo\s+test|mvn\s+test/i

// ---- konuşma / ruh hali ----

let talkUntil = 0
let moodUntil = 0
let lastSaid = 0
let lastActivity = 0
let turnStart = 0
let warnedLong = false
let lastModel = 0
let editsSinceCommit = 0
let warnedCommit = false
let toolsThisTurn: string[] = []
let pokeRun = 0
let lastBreak = 0
let warnedCtx = false
let nextGesture = 0
let gestureUntil = 0
let nextWalk = 0
let walkUntil = 0
let lastReview = 0

let warnedSound = false
let useShell = false
let isSpeaking = false

// Windows: $.audio.speak yok; PowerShell'in System.Speech motoruyla oku.
// Metin tek tırnaklı bir PowerShell dizesine gömülür (apostroflar atılır, satır sonları boşluk olur)
// ve -EncodedCommand ile verilir; kabuk yok, metin komut olarak yorumlanmaz.
const speakWindows = async ($: any, text: string) => {
  if (isSpeaking) return
  isSpeaking = true

  try {
    const safe = text.replace(/['‘’‚‛]/g, '').replace(/[\r\n]+/g, ' ').slice(0, 400)
    const script =
      "$ErrorActionPreference='Stop'; Add-Type -AssemblyName System.Speech; " +
      '$s=New-Object System.Speech.Synthesis.SpeechSynthesizer; ' +
      "$v=$s.GetInstalledVoices()|Where-Object{$_.VoiceInfo.Culture.Name -like 'tr*'}|Select-Object -First 1; " +
      'if($v){$s.SelectVoice($v.VoiceInfo.Name)}; ' +
      `$s.Speak('${safe}')`
    const u16 = new Uint16Array(script.length)

    for (let i = 0; i < script.length; i++) u16[i] = script.charCodeAt(i)

    const r = await $.process.run(
      ['powershell.exe', '-NoProfile', '-NonInteractive', '-EncodedCommand', new Uint8Array(u16.buffer).toBase64()],
      { timeoutMs: 30000 },
    )

    if (r.exitCode !== 0) throw new Error(String(r.stderr).trim().slice(0, 80) || `çıkış kodu ${r.exitCode}`)
  } finally {
    isSpeaking = false
  }
}

const playSound = async ($: any, text: string, m: Mood) => {
  const mode = await read($, sound)
  if (mode === 0) return
  const w = await read($, who)

  try {
    if (mode === 1) {
      await $.audio.play({ base64: clipFor(w, m), mime: 'audio/wav' }, { gain: 0.5 })
    } else if (useShell) {
      await speakWindows($, text)
    } else {
      try {
        await $.audio.speak(text)
      } catch {
        useShell = true
        await speakWindows($, text)
      }
    }
  } catch (err) {
    // ses yoksa bir kez uyar ve kapat
    if (!warnedSound) {
      warnedSound = true
      $.ui.toast(`Sidekick: ses çalınamadı (${String((err as Error)?.message ?? err).slice(0, 80)})`)
      await update($, sound, () => 0)
    }
  }
}

const setMood = async ($: any, m: Mood, ms = 3000) => {
  moodUntil = (await $.clock.now()) + ms
  await update($, mood, () => m)
}

const sayText = async ($: any, text: string, m?: Mood, ms = 3000) => {
  const now = await $.clock.now()
  lastSaid = now
  talkUntil = now + Math.min(4500, 1000 + text.length * 35)
  await update($, bubble, () => text)
  await update($, talking, () => true)
  if (m) await setMood($, m, ms)
  void playSound($, text, m ?? 'normal')
}

// gap: bu kadar ms içinde zaten konuştuysa susar (araç çağrıları sürekli tetiklenir)
// force: kullanıcının bastığı düğmeler ve tehlike uyarıları sessiz modda da konuşur
const say = async (
  $: any,
  lines: string[],
  opts: { gap?: number; mood?: Mood; ms?: number; force?: boolean } = {},
) => {
  const lv = await read($, level)
  if (lv === 0 && !opts.force) return
  const now = await $.clock.now()
  if (now - lastSaid < (opts.gap ?? 0) * (lv === 2 ? 0.4 : 1)) return
  await sayText($, pick(await linesFor($, lines)), opts.mood, opts.ms)
}

const switchTo = async ($: any, name: Who) => {
  await update($, who, () => name)
  await $.ui.open({ id: PANE, title: TITLE[name] })
  await sayText($, pick(HELLO[name]), 'happy', 2500)

  return { text: `${TITLE[name]} paneli açıldı.` }
}

const own = (o: object, k: string) => Object.prototype.hasOwnProperty.call(o, k)

const USAGE =
  'Kullanım: /sidekick [clippy | stajyer | java | sessiz | normal | sinir | ses [kapali|bip|konusma] | yardim]'

const CHARS: Record<string, Who> = {
  clippy: 'clippy',
  atac: 'clippy',
  ataç: 'clippy',
  stajyer: 'stajyer',
  java: 'java',
  kahve: 'java',
}

const LEVEL_WORDS: Record<string, Level> = { sessiz: 0, normal: 1, sinir: 2, sınır: 2 }

const SOUND_WORDS: Record<string, number> = {
  kapali: 0,
  kapalı: 0,
  off: 0,
  bip: 1,
  konusma: 2,
  konuşma: 2,
}

// /sidekick <seçenek>: karakter, sinir seviyesi ve ses komutla değişir; boşsa paneli açar
const sidekickCommand = async ($: any, raw: string) => {
  const [head = '', rest = ''] = raw.trim().toLocaleLowerCase('tr').split(/\s+/)
  const w = await read($, who)

  if (head === '') {
    await $.ui.open({ id: PANE, title: TITLE[w] })

    return { text: `Sidekick açıldı (${TITLE[w]}). ${USAGE}` }
  }

  if (own(CHARS, head)) return switchTo($, CHARS[head])

  if (own(LEVEL_WORDS, head)) {
    const next = LEVEL_WORDS[head]
    await update($, level, () => next)
    const src = w === 'clippy' ? SAY.level : PERSONA[w].level
    await say($, [src[next]], { mood: next === 2 ? 'laugh' : 'normal', ms: 2500, force: true })

    return { text: `Sinir seviyesi: ${LEVELS[next]}.` }
  }

  if (head === 'ses') {
    const cur = await read($, sound)
    const next = rest === '' ? (cur + 1) % 3 : own(SOUND_WORDS, rest) ? SOUND_WORDS[rest] : undefined

    if (next === undefined) return { text: `Ses seçenekleri: kapali, bip, konusma. Bilmiyorum: "${rest}".` }

    warnedSound = false
    await update($, sound, () => next)

    return { text: `Ses: ${SOUND_MODES[next]}.` }
  }

  if (head === 'yardim' || head === 'yardım' || head === 'help' || head === '?') {
    const lv = await read($, level)
    const snd = await read($, sound)

    return { text: `${USAGE}\nŞimdi: ${TITLE[w]} · sinir: ${LEVELS[lv]} · ses: ${SOUND_MODES[snd]}` }
  }

  return { text: `Bilmiyorum: "${raw.trim()}". ${USAGE}` }
}

const basename = (p: string) => p.split(/[\\/]/).pop() || p

// Yazılan koda yüzeysel bakıp bir yorum anahtarı seçer; hiçbir şeyi değiştirmez
const reviewKey = (code: string) => {
  if (/(password|passwd|secret|api[_-]?key|token)\s*[:=]\s*['"][^'"]{6,}['"]/i.test(code)) return 'reviewSecret'
  if (/TODO|FIXME/.test(code)) return 'reviewTodo'
  if (/console\.log\(|\bprint\(|System\.out\.print|Console\.WriteLine/.test(code)) return 'reviewDebug'
  if (/catch\s*(\([^)]*\))?\s*\{\s*\}/.test(code)) return 'reviewCatch'
  if (/:\s*any\b|<any>/.test(code)) return 'reviewAny'
  if (code.split('\n').length > 150) return 'reviewLong'

  return 'reviewGeneric'
}

const review = async ($: any, f: string, code: string) => {
  const lines = await linesFor($, (SAY as Record<string, string[]>)[reviewKey(code)])
  await sayText($, pick(lines).split('{f}').join(f), 'laugh', 3000)
}

const wake = async ($: any) => {
  lastActivity = await $.clock.now()
  if ((await read($, mood)) === 'sleepy') {
    await update($, mood, () => 'normal')
    await say($, SAY.wake)
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'sidekick',
      description: 'Yan arkadaşı aç; karakteri, sinir seviyesini ve sesi seç',
      argumentHint: '[clippy|stajyer|java|sessiz|normal|sinir|ses|yardim]',
    })

    void $.ui.open({ id: PANE, title: TITLE[await read($, who)] })
    lastActivity = await $.clock.now()
    lastBreak = lastActivity
    nextGesture = lastActivity + 15000
    nextWalk = lastActivity + 20000
    let n = 0
    $.clock.every(700, async () => {
      n += 1
      const f = n % 6 === 0 ? 2 : n % 2
      await update($, frame, () => f)
      const now = await $.clock.now()

      if (now > talkUntil && (await read($, talking))) await update($, talking, () => false)

      const m = await read($, mood)

      if (m !== 'normal' && m !== 'sleepy' && now > moodUntil) await update($, mood, () => 'normal')
      if (m === 'normal' && now - lastActivity > 90000) await update($, mood, () => 'sleepy')

      if (turnStart > 0 && !warnedLong && now - turnStart > 120000) {
        warnedLong = true
        $.ui.toast('Sidekick: bu tur iki dakikayı geçti')
        await say($, SAY.longTurn)
      }

      const lv = await read($, level)

      if (lv > 0 && now - lastBreak > 45 * 60000) {
        lastBreak = now
        $.ui.toast('Sidekick: mola zamanı')
        await say($, SAY.rest, { force: true })
      }

      // sinir bozucu sahte teklifler: seviye 2'de sık, 1'de seyrek, 0'da hiç
      const every = lv === 2 ? 120000 : 300000

      if (lv > 0 && (m === 'normal' || m === 'sleepy') && turnStart === 0 && now - lastSaid > every) {
        const line = pick(await linesFor($, SAY.annoy))
        await sayText($, line, 'happy', 4000)
        if (lv === 2 && Math.random() < 0.3) $.ui.toast(`Sidekick: ${line}`)
      }

      // boştayken ara sıra rastgele bir jest: esneme, zıplama, dönme...
      const curGest = await read($, gest)

      if (curGest && now > gestureUntil) {
        await update($, gest, () => '')
      } else if (
        !curGest &&
        lv > 0 &&
        m === 'normal' &&
        !(await read($, run)).running &&
        !(await read($, walk)) &&
        !(await read($, talking)) &&
        now > nextGesture
      ) {
        const g = pick(GESTURES)
        await update($, gest, () => g.name)
        gestureUntil = now + g.ms
        nextGesture = now + (lv === 2 ? 12000 : 25000) + Math.random() * (lv === 2 ? 15000 : 25000)
        const quip = (SAY as Record<string, string[]>)[g.name]
        if (quip && Math.random() < 0.7) await say($, quip)
      }

      // ara sıra panelde yürüyüşe çıkar
      const isWalking = await read($, walk)

      if (isWalking && now > walkUntil) {
        await update($, walk, () => false)
      } else if (!isWalking && lv > 0 && m === 'normal' && now > nextWalk && !(await read($, talking))) {
        await update($, walk, () => true)
        walkUntil = now + 12000
        nextWalk = now + (lv === 2 ? 25000 : 50000) + Math.random() * (lv === 2 ? 25000 : 50000)
      }
    })

    return next(e)
  })

  on('command.run', { command: 'sidekick' }, ($, e) => sidekickCommand($, e.args))

  on('prompt.submit', async ($, e, next) => {
    await wake($)
    turnStart = await $.clock.now()
    warnedLong = false
    toolsThisTurn = []
    await update($, run, () => ({ running: true, elapsed: 0, tool: '...' }))
    await say($, SAY.prompt, { gap: 4000 })

    // sahte "değiştirdim" şakası: hiçbir şeye dokunmaz, sadece söyler
    const lvl = await read($, level)

    if (lvl > 0 && Math.random() < (lvl === 2 ? 0.2 : 0.08)) {
      $.clock.after(1500, () => say($, SAY.fake, { mood: 'laugh', ms: 2500, force: true }))
    }

    return next(e)
  })

  on('tool.call', async ($, e, next) => {
    await wake($)
    const input = e as any
    const cmd: string = typeof input.command === 'string' ? input.command : ''
    toolsThisTurn.push(e.tool)
    await update($, stats, s => ({ ...s, tools: s.tools + 1 }))
    await update($, run, r => ({ ...r, tool: e.tool }))

    if (e.tool === 'Edit' || e.tool === 'Write') editsSinceCommit += 1

    if (/git\s+commit/i.test(cmd)) {
      editsSinceCommit = 0
      warnedCommit = false
    }

    if (DANGER.test(cmd)) {
      $.ui.toast('Sidekick: tehlikeli komut tespit edildi!')
      await say($, SAY.danger, { mood: 'panic', ms: 4000, force: true })
    } else {
      await say($, SAY.tool, { gap: 30000 })
    }

    // Düzenlenen koda yaklaşıp bakar, sonra gülerek yorum yapar; kodu değiştirmez
    const lvl = await read($, level)

    if ((e.tool === 'Edit' || e.tool === 'Write') && lvl > 0 && !DANGER.test(cmd)) {
      const now = await $.clock.now()

      if (now - lastReview > (lvl === 2 ? 20000 : 60000) && Math.random() < 0.6) {
        lastReview = now
        const f = basename(String(input.file_path ?? 'dosya'))
        const code = String(input.new_string ?? input.content ?? '')
        await setMood($, 'peek', 2300)
        $.clock.after(1800, () => review($, f, code))
      }
    }

    const r: any = await next(e)

    if (cmd && TEST.test(cmd) && r && !r.deny) {
      if (r.isError) await say($, SAY.testFail, { mood: 'angry', ms: 4000, force: true })
      else await say($, SAY.testOk, { mood: 'happy', ms: 4000 })
    } else if (r && r.isError) {
      await say($, SAY.toolError, { gap: 20000, mood: 'angry', ms: 2500 })
    }

    return r
  })

  on('turn.complete', async ($, e, next) => {
    lastActivity = await $.clock.now()
    const seconds = Math.round((lastActivity - turnStart) / 1000)
    turnStart = 0
    await update($, stats, s => ({ ...s, turns: s.turns + 1 }))

    await update($, run, r => ({ ...r, running: false, tool: '' }))
    const st = await read($, stats)
    const lv = await read($, level)
    let isPlain = false

    // öncelik: hata/iptal > commit/bağlam uyarısı > ipucu > normal
    if (e.reason === 'error') {
      await say($, SAY.error, { mood: 'angry', ms: 3500 })
    } else if (e.reason === 'aborted') {
      await say($, SAY.aborted, { mood: 'laugh', ms: 3000 })
    } else if (editsSinceCommit >= 10 && !warnedCommit) {
      warnedCommit = true
      await say($, SAY.commit, { force: true })
    } else if (st.turns >= 15 && !warnedCtx) {
      warnedCtx = true
      await say($, SAY.ctx, { force: true })
    } else if (lv > 0 && st.turns % 4 === 0) {
      await say($, SAY.tip, { mood: 'happy', ms: 3500 })
    } else {
      isPlain = true
      await say($, SAY.done, { mood: 'happy', ms: 3000 })
    }

    // model destekli replik: bekletmeden, arkada; dosya içeriği ya da prompt gönderilmez.
    // Yardımcı bir mesaj (ipucu, uyarı) gösteriliyorsa onu ezmez.
    if (lv > 0 && isPlain && e.reason === 'answer' &&lastActivity - lastModel > (lv === 2 ? 45000 : 90000)) {
      lastModel = lastActivity
      const names = [...new Set(toolsThisTurn)].slice(0, 6).join(', ') || 'yok'
      const count = toolsThisTurn.length
      const who2 = await read($, who)

      void (async () => {
        try {
          const r: any = await $.model.complete({
            model: 'haiku',
            system: `${SYSTEM[who2]} Tek cümle yaz, en fazla 110 karakter, emoji yok. Şakayı kendin, yazılım ve yapay zekâ üzerine yap; kimseyi hedef alma. Türkçe yaz.`,
            prompt: `Bir yazılım oturumunda tur bitti. Süre ${seconds} saniye, ${count} araç çağrısı, kullanılan araçlar: ${names}. Buna kibirli ve sarkastik tek cümlelik komik bir yorum yap.`,
            maxTokens: 80,
            effort: 'low',
            timeoutMs: 8000,
          })

          if (r.isAnswered) {
            const t = String(r.text).trim().replace(/^["“”']+|["“”']+$/g, '').slice(0, 160)

            if (t) await sayText($, t, 'happy', 3000)
          }
        } catch {
          // model yoksa sabit replik kalır
        }
      })()
    }

    return next(e)
  })

  // gaze.tsx'ten gelen fare konumu; koddan geldiği için doğrulanır
  on('ui.message', { element: 'gaze' }, async ($, e, next) => {
    // yürürken mesajı işleme: her güncelleme paneli yeniden çizer ve SVG animasyonu baştan başlar
    if (await read($, walk)) return next(e)

    const d = e.data as { gx?: unknown; gy?: unknown } | null
    const gx = Number(d?.gx)
    const gy = Number(d?.gy)

    if ([-1, 0, 1].includes(gx) && [-1, 0, 1].includes(gy)) {
      const cur = await read($, gaze)

      if (cur.gx !== gx || cur.gy !== gy) {
        await update($, gaze, () => ({ gx, gy }))
        await wake($)
      }
    }

    return next(e)
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const text = await read($, bubble)
    const m = await read($, mood)
    const isTalking = await read($, talking)
    const s = await read($, stats)
    const outfit = outfitFor(await $.clock.now())
    const w = await read($, who)
    const walking = await read($, walk)
    const snd = await read($, sound)
    const gz = await read($, gaze)
    // yürürken bakışı yok say: kaynak değişirse yürüme animasyonu baştan başlar
    ctx.look = walking ? { gx: 0, gy: 0 } : gz
    const { Box, Text, Button, Client } = $.ui.resolve(e) as any
    const elapsedBase = turnStart > 0 ? Math.floor(((await $.clock.now()) - turnStart) / 1000) : 0

    const dodge = (
      <Button
        key="close"
        label={CLOSE_LABEL[w]}
        onPress={() => {
          void (async () => {
            await update($, stats, st => ({ ...st, escapes: st.escapes + 1 }))
            await say($, SAY.laugh, { mood: 'laugh', ms: 2500, force: true })
          })()
        }}
      />
    )

    const poke = (
      <Button
        key="poke"
        label="Dürt"
        onPress={() => {
          void (async () => {
            pokeRun += 1
            await update($, stats, st => ({ ...st, pokes: st.pokes + 1 }))
            await wake($)

            if (pokeRun % 5 === 0) await say($, SAY.pokeAngry, { mood: 'angry', ms: 3500, force: true })
            else await say($, SAY.poke, { mood: 'normal', force: true })
          })()
        }}
      />
    )

    const lv = await read($, level)
    const r = await read($, run)

    const act = (fn: () => Promise<void>) => () => {
      void fn()
    }

    const levelBtn = (
      <Button
        key="level"
        label={`Sinir: ${LEVELS[lv]}`}
        onPress={act(async () => {
          const next = ((lv + 1) % 3) as Level
          await update($, level, () => next)
          const src = w === 'clippy' ? SAY.level : PERSONA[w].level
          await say($, [src[next]], { mood: next === 2 ? 'laugh' : 'normal', ms: 2500, force: true })
        })}
      />
    )

    const soundBtn = (
      <Button
        key="sound"
        label={`Ses: ${SOUND_MODES[snd]}`}
        onPress={act(async () => {
          const next = (snd + 1) % 3
          warnedSound = false
          await update($, sound, () => next)
          await say($, [next === 0 ? 'Sustum.' : next === 1 ? 'Bip bip. Böyle mi?' : 'Şimdi sesli konuşuyorum. Duyuyor musun?'], {
            force: true,
          })
        })}
      />
    )

    const footer = (
      <Box flexDirection="column" gap={1} alignItems="center">
        {Client ? (
          <Client
            key="elapsed"
            module="./elapsed.tsx"
            width={44}
            height={1}
            props={{ running: r.running, base: elapsedBase, tool: r.tool, verbs: VERBS[w] }}
          />
        ) : (
          <Text>{r.running ? `Çalışıyor · ${r.tool || '...'}` : 'Boşta. Ben de.'}</Text>
        )}
        <Text dimColor>{`Araç ${s.tools} · Tur ${s.turns}`}</Text>
        <Box flexDirection="row" gap={1} flexWrap="wrap" justifyContent="center">
          {poke}
          {levelBtn}
          {soundBtn}
        </Box>
        {dodge}
      </Box>
    )

    if (e.surface === 'terminal') {
      const { Raster } = $.ui.resolve(e)
      const f = await read($, frame)
      const cells = clippyRaster(m, isTalking, f === 1, f === 2, outfit, w, gz)

      return (
        <Box flexDirection="column" gap={1}>
          <Box alignSelf="center">
            <Text bold>{TITLE[w]}</Text>
          </Box>
          {m === 'sleepy' ? null : (
            <Box borderStyle="round" paddingX={1}>
              <Text>{text}</Text>
            </Box>
          )}
          <Box alignSelf="center" position="relative">
            <Raster key="clippy" columns={RW} rows={RH / 2} cells={cells} />
            <Box position="absolute" top={0} left={0} right={0} height={RH / 2}>
              <Client key="gaze" module="./gaze.tsx" width="100%" height={RH / 2} props={{ rows: RH / 2, centerRow: 11 }} />
            </Box>
          </Box>
          <Box alignSelf="center">{footer}</Box>
        </Box>
      )
    }

    const { Svg } = $.ui.resolve(e) as { Svg: any }

    // Balon ve karakter tek SVG; yükseklik satır olarak tahmin edilir (300 px genişlik, ~17.5 px satır)
    ctx.phase = (await $.clock.now()) / 1000
    ctx.scanMode = r.running && !isTalking ? 'read' : 'idle'
    ctx.gestureNow = await read($, gest)
    const bm = layoutFor(text, m)
    const svgRows = Math.ceil((300 * bm.total) / 200 / 17.5) + 1
    const centerRow = Math.round((95 - bm.top) * 1.5 / 17.5)

    return (
      <Box flexDirection="column" gap={1} position="relative">
        {Client && (
          <Box position="absolute" top={0} left={0} right={0} height={svgRows}>
            <Client key="gaze" module="./gaze.tsx" width="100%" height={svgRows} props={{ rows: svgRows, centerRow }} />
          </Box>
        )}
        <Box alignSelf="center">
          <Text bold>{TITLE[w]}</Text>
        </Box>
        <Box alignSelf="center" height={svgRows}>
          <Svg
            source={characterSvg(w, m, isTalking, outfit, walking, text).replace('<svg ', '<svg width="300" ')}
            alt={`${TITLE[w]} diyor ki: ${text}`}
          />
        </Box>
        <Box alignSelf="center">{footer}</Box>
      </Box>
    )
  })
}
