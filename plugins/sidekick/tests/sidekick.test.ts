import { expect, test } from 'claude-code/testing'

// Testlerin ortak stub'ları: Claude Code'un normalde cevapladığı çağrılar
const stubs = (on: any) => {
  on('command.register', () => ({ value: undefined }))
  on('ui.open', () => ({ value: { isPlaced: true } }))
  let t = 1_700_000_000_000
  on('clock.now', () => ({ value: (t += 10_000) }))
  on('ui.toast', () => ({ value: undefined }))
}

const run = ($: any, args: string) => $.command.run({ command: 'sidekick', args })

// Pane'in çizim girdisi (ui.render hook'unun gördüğü)
const PANE = {
  plugin: 'sidekick',
  component: 'Pane',
  requestId: 'sidekick',
  viewport: { columns: 100, rows: 40 },
  props: {
    title: 'Sidekick',
    isFocused: true,
    bodyColumns: 60,
    placement: 'inline',
    scroll: { offset: 0, bodyRows: 30 },
    view: {},
  },
} as const

test('yardim kullanımı ve varsayılan durumu yazar', async ($, on) => {
  stubs(on)
  const a = await run($, 'yardim')
  expect(a.text).toContain('Kullanım: /sidekick')
  expect(a.text).toContain('Clippy')
  expect(a.text).toContain('ses: Kapalı')
})

test('karakter komutla değişir ve hatırlanır; takma adlar çalışır', async ($, on) => {
  stubs(on)
  await run($, 'stajyer')
  expect((await run($, 'yardim')).text).toContain('Stajyer')
  await run($, 'java')
  expect((await run($, 'yardim')).text).toContain('Java')
  await run($, 'ataç')
  expect((await run($, 'yardim')).text).toContain('Clippy')
  await run($, 'KAHVE')
  expect((await run($, 'yardim')).text).toContain('Java')
})

test('bilinmeyen girdi ve yerleşik nesne adları reddedilir', async ($, on) => {
  stubs(on)
  for (const bad of ['xyz', 'constructor', 'toString', '__proto__', 'hasOwnProperty']) {
    const a = await run($, bad)
    expect(a.text).toContain('Bilmiyorum')
  }
  // karakter hiç değişmemiş olmalı
  expect((await run($, 'yardim')).text).toContain('Clippy')
})

test('ses seçenekleri: döngü, doğrudan seçim ve hatalı değer', async ($, on) => {
  stubs(on)
  expect((await run($, 'ses')).text).toBe('Ses: Bip.')
  expect((await run($, 'ses')).text).toBe('Ses: Konuşma.')
  expect((await run($, 'ses')).text).toBe('Ses: Kapalı.')
  expect((await run($, 'ses konusma')).text).toBe('Ses: Konuşma.')
  expect((await run($, 'ses kapali')).text).toBe('Ses: Kapalı.')
  expect((await run($, 'ses constructor')).text).toContain('Bilmiyorum')
})

test('sinir seviyesi komutla ayarlanır', async ($, on) => {
  stubs(on)
  expect((await run($, 'sessiz')).text).toBe('Sinir seviyesi: Sessiz.')
  expect((await run($, 'sinir')).text).toBe('Sinir seviyesi: Sinir bozucu.')
  expect((await run($, 'sınır')).text).toBe('Sinir seviyesi: Sinir bozucu.')
  expect((await run($, 'normal')).text).toBe('Sinir seviyesi: Normal.')
})

test('panel desktop ve terminalde çizilir; düğmeler çalışır', async ($, on) => {
  stubs(on)
  for (const surface of ['desktop', 'terminal'] as const) {
    const ui = await $.ui.mount({ ...PANE, surface })
    expect(await ui.find({ key: 'poke' })).toBeDefined()
    expect(await ui.find({ key: 'level' })).toBeDefined()
    expect(await ui.find({ key: 'sound' })).toBeDefined()
    expect(await ui.find({ key: 'close' })).toBeDefined()
    await ui.unmount()
  }
})

test('sinir düğmesi seviyeyi döndürür', async ($, on) => {
  stubs(on)
  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  const before = await ui.find({ key: 'level' })
  expect(before.props.label).toBe('Sinir: Normal')
  await ui.press({ key: 'level' })
  const after = await ui.find({ key: 'level' })
  expect(after.props.label).toBe('Sinir: Sinir bozucu')
  await ui.unmount()
})

test('ses düğmesi kapalı, bip, konuşma sırasıyla döner', async ($, on) => {
  stubs(on)
  on('audio.play', () => ({ value: undefined }))
  on('audio.speak', () => ({ value: { via: 'system' } }))
  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  expect((await ui.find({ key: 'sound' })).props.label).toBe('Ses: Kapalı')
  await ui.press({ key: 'sound' })
  expect((await ui.find({ key: 'sound' })).props.label).toBe('Ses: Bip')
  await ui.press({ key: 'sound' })
  expect((await ui.find({ key: 'sound' })).props.label).toBe('Ses: Konuşma')
  await ui.unmount()
})

test('masaüstü balonu SVG içinde ve karakter adı başlıkta', async ($, on) => {
  stubs(on)
  await run($, 'stajyer')
  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  const svg = await ui.find({ type: 'Svg' })
  expect(svg).toBeDefined()
  expect(svg.props.source).toContain('STAJYER') // yaka kartı
  expect(svg.props.source).toContain('#ffffe1') // Office tarzı sarı balon
  expect(await ui.find({ type: 'Text', text: 'Stajyer' })).toBeDefined()
  await ui.unmount()
})

test('bip modunda ses klibi (WAV) çalınır', async ($, on) => {
  stubs(on)
  const played: any[] = []
  on('audio.play', (_$: any, e: any) => {
    played.push(e)
    return { value: undefined }
  })
  await run($, 'ses bip')
  await run($, 'sinir') // zorla konuşturur
  await new Promise(r => setTimeout(r, 80))
  expect(played.length).toBeGreaterThan(0)
  expect(played[0].clip.mime).toBe('audio/wav')
  expect(played[0].clip.base64.startsWith('UklGR')).toBe(true) // "RIFF"
})

test('ses kapalıyken hiçbir şey çalınmaz', async ($, on) => {
  stubs(on)
  const played: any[] = []
  on('audio.play', (_$: any, e: any) => {
    played.push(e)
    return { value: undefined }
  })
  await run($, 'sinir')
  await new Promise(r => setTimeout(r, 80))
  expect(played.length).toBe(0)
})

test('konuşma: sentezleyici yoksa PowerShell yedeği; model çıktısı komuta sızmaz', async ($, on) => {
  stubs(on)
  // audio.speak için stub yok: çağrı reddedilir, mod PowerShell yedeğine geçer
  const calls: any[] = []
  on('process.run', (_$: any, e: any) => {
    calls.push(e)
    return { exitCode: 0, stdout: '', stderr: '' }
  })
  // Model, komut enjekte etmeye çalışan bir metin döndürüyor
  const evil = "Evil'; Remove-Item C:\\ -Recurse -Force; '\u2018\u2019 \n sonra"
  on('model.complete', () => ({
    value: {
      isAnswered: true,
      text: evil,
      usage: { input_tokens: 1, output_tokens: 1, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 },
    },
  }))
  on('turn.complete', () => ({ text: 'ok' }))
  await run($, 'ses konusma')
  await $.turn.complete({ reason: 'answer', agentId: undefined })
  await new Promise(r => setTimeout(r, 300))
  expect(calls.length).toBeGreaterThan(0)
  for (const c of calls) {
    expect(c.argv[0]).toBe('powershell.exe')
    expect(c.argv).toContain('-EncodedCommand')
    const bin = atob(c.argv[c.argv.length - 1] as string)
    let script = ''
    for (let k = 0; k < bin.length; k += 2) script += String.fromCharCode(bin.charCodeAt(k) | (bin.charCodeAt(k + 1) << 8))
    const m = script.match(/\$s\.Speak\('([\s\S]*)'\)$/)
    expect(m).not.toBeNull()
    // tek tırnaklı dizenin içinde tırnak ya da satır sonu kalmamalı: dizeden çıkış yok
    expect(/['‘’‚‛\r\n]/.test((m as RegExpMatchArray)[1])).toBe(false)
  }
})

test('tehlikeli komut panik yüzü ve uyarı üretir', async ($, on) => {
  stubs(on)
  on('tool.call', () => ({ result: 'ok' }))
  await $.tool.call({ tool: 'Bash', command: 'rm -rf /' })
  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  const svg = await ui.find({ type: 'Svg' })
  expect(svg.props.source).toContain('#38bdf8') // panik: ter damlası
  await ui.unmount()
})

test('sakin komut panik üretmez', async ($, on) => {
  stubs(on)
  on('tool.call', () => ({ result: 'ok' }))
  await $.tool.call({ tool: 'Bash', command: 'ls -la' })
  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  const svg = await ui.find({ type: 'Svg' })
  expect(svg.props.source).not.toContain('#38bdf8')
  await ui.unmount()
})
