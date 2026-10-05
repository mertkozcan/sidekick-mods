import type { Mood, Who } from '../types'

// Çizimin dışarıdan ayarlanan durumu; render çizimden hemen önce doldurur
export const ctx = {
  halo: '#fff', // kaş/ağız konturunun rengi
  look: { gx: 0, gy: 0 }, // farenin bulunduğu bölge (-1, 0, 1)
  phase: 0, // animasyon fazı (sn)
  scanMode: 'idle' as 'idle' | 'read',
  gestureNow: '',
}

// ---- SVG yüz (desktop / vscode / mobil) ----

// kaş/ağız konturunun rengi; karakter çizilirken zemine uyarlanır

const ink = (d: string, w: number) =>
  `<path d="${d}" fill="none" stroke="${ctx.halo}" stroke-width="${w + 4}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="#111827" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`

const openMouth = (cx: number, cy: number, rx: number, ry: number, flap: boolean) => {
  const anim = flap
    ? `<animate attributeName="ry" values="${ry * 0.25};${ry};${ry * 0.4};${ry * 1.1};${ry * 0.25}" dur="0.45s" repeatCount="indefinite"/>`
    : ''

  return (
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx + 2}" ry="${ry}" fill="${ctx.halo}" stroke="${ctx.halo}" stroke-width="4">${anim}</ellipse>` +
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#7f1d1d" stroke="#111827" stroke-width="2">${anim}</ellipse>`
  )
}

// farenin bulunduğu bölge (-1, 0, 1); çizimden hemen önce render'da atanır

// animasyon fazı (saniye) ve göz hareketi kipi; çizimden hemen önce render'da atanır.
// phase: her yeniden çizimde animasyonlar kaldığı yerden devam etsin diye (aşağıda negatif begin)

type Scan = 'none' | 'idle' | 'read' | 'sweep'

// jest: boştayken rastgele yapılan hareket (esneme, zıplama, dönme...); render'da atanır

// idle: hafif bakınma; read: çalışırken kodu okuyormuş gibi sağa sola; sweep: hızlı bakınma
const scanAnim = (scan: Scan) =>
  scan === 'idle'
    ? '<animateTransform attributeName="transform" type="translate" values="0 0;-3 0;0 0;3 1;0 0" dur="7s" repeatCount="indefinite"/>'
    : scan === 'read'
      ? '<animateTransform attributeName="transform" type="translate" values="-5 -1;5 -1;-5 -1" dur="2.4s" repeatCount="indefinite"/>'
      : scan === 'sweep'
        ? '<animateTransform attributeName="transform" type="translate" values="-7 0;7 0;-7 0" dur="1.1s" repeatCount="indefinite"/>'
        : ''

const eyeball = (
  cx: number,
  ry: number,
  pupil: number,
  blink: boolean,
  dx = 2 + ctx.look.gx * 5,
  scan: Scan = 'none',
) =>
  `<ellipse cx="${cx}" cy="64" rx="11" ry="${ry}" fill="#fff" stroke="#111827" stroke-width="2">` +
  (blink
    ? `<animate attributeName="ry" values="${ry};${ry};${ry};${ry};1.5;${ry}" dur="4s" repeatCount="indefinite"/>`
    : '') +
  `</ellipse><circle cx="${cx + dx}" cy="${66 + ctx.look.gy * 4}" r="${pupil}" fill="#111827">${scanAnim(scan)}</circle>`

// düşünce noktaları: aynı sürede, art arda belirir
const thinkDots =
  '<circle cx="102" cy="36" r="2.5" fill="#9ca3af"><animate attributeName="opacity" values="0;1;1;1;1;0" dur="2.4s" repeatCount="indefinite"/></circle>' +
  '<circle cx="112" cy="24" r="3.5" fill="#9ca3af"><animate attributeName="opacity" values="0;0;1;1;1;0" dur="2.4s" repeatCount="indefinite"/></circle>' +
  '<circle cx="126" cy="10" r="5" fill="#9ca3af"><animate attributeName="opacity" values="0;0;0;1;1;0" dur="2.4s" repeatCount="indefinite"/></circle>'

const faceSvg = (m: Mood, isTalking: boolean) => {
  const flap = isTalking || m === 'laugh'
  const scan: Scan = m === 'normal' ? (ctx.gestureNow === 'look' ? 'sweep' : ctx.scanMode) : 'none'
  const eyes = (ry: number, pupil: number) =>
    eyeball(44, ry, pupil, true, undefined, scan) + eyeball(76, ry, pupil, true, undefined, scan)

  switch (m) {
    case 'peek':
      // koda bakıyor: gözler sola, bir kaş yukarıda, ağız düz
      return (
        eyeball(44, 13, 4, false, -7) +
        eyeball(76, 13, 4, false, -7) +
        ink('M32 38 Q44 28 56 38', 3) +
        ink('M64 48 L88 46', 3) +
        ink('M52 98 L68 98', 3)
      )
    case 'happy':
      return (
        eyes(13, 4) +
        ink('M32 41 Q44 33 56 41', 3) +
        ink('M64 41 Q76 33 88 41', 3) +
        (flap ? openMouth(60, 96, 11, 8, true) : ink('M46 92 Q60 108 74 92', 3))
      )
    case 'angry':
      return (
        eyes(9, 4) +
        ink('M32 40 L55 53', 4) +
        ink('M65 53 L88 40', 4) +
        (flap ? openMouth(60, 98, 9, 5, true) : ink('M50 101 Q60 92 70 101', 3))
      )
    case 'panic':
      return (
        eyeball(44, 15, 2.5, false) +
        eyeball(76, 15, 2.5, false) +
        ink('M32 38 Q44 28 56 38', 3) +
        ink('M64 38 Q76 28 88 38', 3) +
        openMouth(60, 98, 7, 9, false) +
        '<path d="M104 40 Q110 52 104 56 Q98 52 104 40Z" fill="#38bdf8" stroke="#0369a1" stroke-width="1.5"/>'
      )
    case 'sleepy':
      return (
        ink('M33 66 Q44 74 55 66', 3) +
        ink('M65 66 Q76 74 87 66', 3) +
        ink('M54 96 L66 96', 3) +
        '<text x="96" y="24" font-size="20" font-weight="700" fill="#9ca3af">Zzz<animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite"/></text>'
      )
    case 'laugh':
      return (
        ink('M33 68 Q44 52 55 68', 3) +
        ink('M65 68 Q76 52 87 68', 3) +
        ink('M32 42 Q44 34 56 42', 3) +
        ink('M64 42 Q76 34 88 42', 3) +
        openMouth(60, 96, 12, 9, true)
      )
    default:
      if (ctx.gestureNow === 'yawn' && !flap) {
        // esneme: gözler kapanır, ağız yavaşça açılıp kapanır
        return (
          ink('M33 66 Q44 72 55 66', 3) +
          ink('M65 66 Q76 72 87 66', 3) +
          ink('M32 44 Q44 38 56 44', 3) +
          ink('M64 44 Q76 38 88 44', 3) +
          `<ellipse cx="60" cy="98" rx="12" ry="4" fill="${ctx.halo}" stroke="${ctx.halo}" stroke-width="4"><animate attributeName="ry" values="4;17;17;4" dur="3s" repeatCount="indefinite"/></ellipse>` +
          '<ellipse cx="60" cy="98" rx="10" ry="4" fill="#7f1d1d" stroke="#111827" stroke-width="2"><animate attributeName="ry" values="4;17;17;4" dur="3s" repeatCount="indefinite"/></ellipse>'
        )
      }

      if (ctx.gestureNow === 'brows' && !flap) {
        // kaş oynatma
        const wiggle = '<animateTransform attributeName="transform" type="translate" values="0 0;0 -7;0 0" dur="0.4s" repeatCount="indefinite"/>'

        return (
          eyes(13, 4) +
          `<g>${ink('M32 46 Q44 38 56 46', 3)}${ink('M64 46 Q76 38 88 46', 3)}${wiggle}</g>` +
          ink('M46 92 Q60 106 74 92', 3)
        )
      }

      return (
        eyes(13, 4) +
        ink('M32 46 Q44 38 56 46', 3) +
        ink('M64 46 Q76 38 88 46', 3) +
        (flap
          ? openMouth(60, 96, 9, 7, true)
          : scan === 'read'
            ? ink('M52 98 Q60 96 68 98', 3) + thinkDots
            : ink('M50 94 Q60 101 70 94', 3))
      )
  }
}

const hatSvg = (outfit: string) => {
  if (outfit === 'night') {
    return '<path d="M40 14 Q50 -22 92 -10 Q80 -2 100 16 Z" fill="#ef4444" stroke="#7f1d1d" stroke-width="2"/><circle cx="92" cy="-10" r="6" fill="#fff" stroke="#9ca3af"/>'
  }
  if (outfit === 'party') {
    return '<path d="M50 14 L72 -22 L94 14 Z" fill="#a855f7" stroke="#6b21a8" stroke-width="2"/><circle cx="72" cy="-22" r="5" fill="#facc15"/>'
  }

  return ''
}

const clippySvg = (m: Mood, isTalking: boolean, outfit: string) => {
  const sway =
    m === 'panic'
      ? '<animateTransform attributeName="transform" type="translate" values="-3 0;3 0;-3 0" dur="0.12s" repeatCount="indefinite"/>'
      : '<animateTransform attributeName="transform" type="rotate" values="-2 70 200;2 70 200;-2 70 200" dur="3s" repeatCount="indefinite"/>'

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -30 140 250">
  <g>
    ${sway}
    <path d="M42 70 L42 160 A32 32 0 0 0 106 160 L106 50 A28 28 0 0 0 50 50 L50 140" fill="none" stroke="#6b7280" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M42 70 L42 160 A32 32 0 0 0 106 160 L106 50 A28 28 0 0 0 50 50 L50 140" fill="none" stroke="#d1d5db" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M42 70 L42 38 A28 28 0 0 1 98 38" fill="none" stroke="#6b7280" stroke-width="12" stroke-linecap="round"/>
    <path d="M42 70 L42 38 A28 28 0 0 1 98 38" fill="none" stroke="#d1d5db" stroke-width="7" stroke-linecap="round"/>
    ${faceSvg(m, isTalking)}
    ${hatSvg(outfit)}
  </g>
</svg>`
}

const SKIN = '#f2c7a1'
const CUP = '#f1f5f9'
const JAVA_BLUE = '#5382a1'
const JAVA_ORANGE = '#f89820'

const swayOf = (m: Mood) =>
  m === 'panic'
    ? '<animateTransform attributeName="transform" type="translate" values="-3 0;3 0;-3 0" dur="0.12s" repeatCount="indefinite"/>'
    : '<animateTransform attributeName="transform" type="rotate" values="-1.5 70 150;1.5 70 150;-1.5 70 150" dur="3s" repeatCount="indefinite"/>'

// Bıkkın stajyer: yüz Clippy ile aynı koordinatlarda; kafa, saç, göz altı morluğu, kapüşonlu gövde, kahve bardağı
const stajyerSvg = (m: Mood, isTalking: boolean) => {
  ctx.halo = SKIN
  const face = faceSvg(m, isTalking)
  ctx.halo = '#fff'

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -30 140 250">
  <g>
    ${swayOf(m)}
    <path d="M14 220 L18 150 Q22 124 60 120 Q98 124 102 150 L106 220 Z" fill="#6366f1" stroke="#3730a3" stroke-width="3"/>
    <path d="M44 124 Q60 140 76 124" fill="none" stroke="#3730a3" stroke-width="3"/>
    <rect x="46" y="150" width="28" height="18" rx="2" fill="#fff" stroke="#3730a3" stroke-width="1.5"/>
    <text x="60" y="162" font-size="7" font-weight="700" text-anchor="middle" fill="#111827">STAJYER</text>
    <ellipse cx="60" cy="80" rx="42" ry="48" fill="${SKIN}" stroke="#a16207" stroke-width="2"/>
    <path d="M20 66 Q18 22 60 22 Q104 22 100 66 Q92 40 60 42 Q28 40 20 66Z" fill="#78350f"/>
    <path d="M30 28 L26 14 M50 22 L52 8 M72 22 L78 10" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
    ${face}
    <path d="M34 84 Q44 90 54 84" fill="none" stroke="#7c3aed" stroke-width="2" opacity="0.5"/>
    <path d="M66 84 Q76 90 86 84" fill="none" stroke="#7c3aed" stroke-width="2" opacity="0.5"/>
    <g>
      <path d="M92 150 L116 150 L113 186 Q112 192 106 192 L102 192 Q96 192 95 186 Z" fill="#fff" stroke="#6b7280" stroke-width="2"/>
      <path d="M115 158 Q128 160 124 172 Q121 180 112 178" fill="none" stroke="#6b7280" stroke-width="3"/>
      <path d="M100 142 Q96 134 100 128 M108 142 Q104 134 108 126" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round">
        <animate attributeName="opacity" values="0.2;0.9;0.2" dur="2s" repeatCount="indefinite"/>
      </path>
    </g>
  </g>
</svg>`
}

// Java: buharı tüten kahve bardağı (logo göndermesi)
const javaSvg = (m: Mood, isTalking: boolean) => {
  ctx.halo = CUP
  const face = faceSvg(m, isTalking)
  ctx.halo = '#fff'

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -30 140 250">
  <g>
    ${swayOf(m)}
    <path d="M44 34 Q34 20 44 8 Q54 -4 44 -18" fill="none" stroke="${JAVA_ORANGE}" stroke-width="6" stroke-linecap="round">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="2.4s" repeatCount="indefinite"/>
    </path>
    <path d="M72 34 Q62 20 72 8 Q82 -4 72 -18" fill="none" stroke="${JAVA_ORANGE}" stroke-width="6" stroke-linecap="round">
      <animate attributeName="opacity" values="1;0.3;1" dur="2.4s" repeatCount="indefinite"/>
    </path>
    <path d="M94 62 Q130 60 126 94 Q122 124 90 122" fill="none" stroke="${JAVA_BLUE}" stroke-width="9" stroke-linecap="round"/>
    <path d="M22 44 L98 44 L88 140 Q86 152 74 152 L46 152 Q34 152 32 140 Z" fill="${CUP}" stroke="${JAVA_BLUE}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M26 46 L94 46" stroke="${JAVA_BLUE}" stroke-width="6" stroke-linecap="round"/>
    <path d="M30 128 L90 128" stroke="${JAVA_BLUE}" stroke-width="5"/>
    <ellipse cx="60" cy="160" rx="54" ry="9" fill="${JAVA_BLUE}"/>
    <g transform="translate(0 12)">${face}</g>
    <text x="60" y="190" font-size="14" font-weight="700" text-anchor="middle" fill="${JAVA_BLUE}">Java</text>
  </g>
</svg>`
}

// ---- Office tarzı konuşma balonu (SVG içinde; SVG metni kendiliğinden kaydırmaz) ----

const wrapText = (text: string, max: number) => {
  const lines: string[] = []
  let cur = ''

  for (const raw of text.split(/\s+/)) {
    let word = raw

    while (word.length > max) {
      if (cur) {
        lines.push(cur)
        cur = ''
      }
      lines.push(word.slice(0, max))
      word = word.slice(max)
    }

    if (cur && cur.length + 1 + word.length > max) {
      lines.push(cur)
      cur = word
    } else {
      cur = cur ? `${cur} ${word}` : word
    }
  }

  if (cur) lines.push(cur)

  return lines
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// karakter y = -30..220 arası çizilir; balon onun üstüne konur
export const bubbleMetrics = (text: string) => {
  const lines = wrapText(text, 30)
  const h = lines.length * 14 + 16
  const top = -30 - 22 - h

  return { lines, h, top, total: 220 - top }
}

const bubbleSvg = (text: string) => {
  const { lines, h, top } = bubbleMetrics(text)
  const bottom = top + h
  const tspans = lines
    .map(
      (l, i) =>
        `<text x="-14" y="${top + 18 + i * 14}" font-size="10.5" font-family="Tahoma, 'Segoe UI', sans-serif" fill="#000">${esc(l)}</text>`,
    )
    .join('')

  return (
    `<rect x="-21" y="${top + 3}" width="188" height="${h}" rx="8" fill="#000" opacity="0.25"/>` +
    `<rect x="-24" y="${top}" width="188" height="${h}" rx="8" fill="#ffffe1" stroke="#000" stroke-width="1.5"/>` +
    `<path d="M50 ${bottom} L62 ${bottom + 17} L74 ${bottom}" fill="#ffffe1" stroke="#000" stroke-width="1.5" stroke-linejoin="round"/>` +
    `<line x1="51.5" y1="${bottom}" x2="72.5" y2="${bottom}" stroke="#ffffe1" stroke-width="3"/>` +
    tspans
  )
}

// peek: ekrana yaklaşır (büyür); walking: panelde sağa sola yürür (hafif zıplayarak);
// balon hareketten bağımsız, karakterin üstünde sabit durur
export const characterSvg = (w: Who, m: Mood, isTalking: boolean, outfit: string, walking: boolean, text: string) => {
  const raw =
    w === 'stajyer' ? stajyerSvg(m, isTalking) : w === 'java' ? javaSvg(m, isTalking) : clippySvg(m, isTalking, outfit)
  let body = raw.slice(raw.indexOf('>') + 1, raw.lastIndexOf('</svg>'))

  const EASE = 'calcMode="spline" keyTimes="0;0.5;1" keySplines="0.33 0 0.67 1;0.33 0 0.67 1"'
  const move = (type: string, values: string, dur: string, ease = false) =>
    `<animateTransform attributeName="transform" type="${type}" values="${values}" dur="${dur}" ${ease ? EASE : ''} repeatCount="indefinite"/>`

  if (m === 'peek') {
    body = `<g transform="translate(-14 -19) scale(1.2)">${body}</g>`
  } else if (walking && m !== 'panic' && m !== 'sleepy') {
    body =
      `<g>${move('translate', '-30 0;30 0;-30 0', '12s')}` +
      `<g>${move('translate', '0 0;0 -5;0 0', '0.5s')}${body}</g></g>`
  } else if (m === 'happy') {
    // sevinç: zıplama
    body = `<g>${move('translate', '0 0;0 -24;0 0', '0.7s', true)}${body}</g>`
  } else if (m === 'laugh') {
    // gülme: küçük hızlı sıçramalar
    body = `<g>${move('translate', '0 0;0 -5;0 0', '0.28s')}${body}</g>`
  } else if (m === 'angry') {
    // öfke: titreme
    body = `<g>${move('translate', '-2 0;2 0;-2 0', '0.09s')}${body}</g>`
  } else if (m === 'sleepy') {
    // uyku: yavaş nefes alma (alttan ölçekler)
    body =
      '<g transform="translate(70 220)"><g>' +
      move('scale', '1 1;1.02 1.035;1 1', '3.5s', true) +
      `<g transform="translate(-70 -220)">${body}</g></g></g>`
  } else if (m === 'normal' && ctx.gestureNow === 'jump') {
    body = `<g>${move('translate', '0 0;0 -24;0 0', '0.7s', true)}${body}</g>`
  } else if (m === 'normal' && ctx.gestureNow === 'spin') {
    // kendi etrafında dönme: yatayda ölçek -1'e gidip gelir
    body =
      '<g transform="translate(70 0)"><g>' +
      move('scale', '1 1;0.05 1;-1 1;0.05 1;1 1', '1.3s') +
      `<g transform="translate(-70 0)">${body}</g></g></g>`
  } else if (m === 'normal' && ctx.gestureNow === 'nod') {
    body = `<g>${move('translate', '0 0;0 9;0 0', '0.55s', true)}${body}</g>`
  } else if (m === 'normal' && ctx.gestureNow === 'shiver') {
    body = `<g>${move('translate', '-1.5 0;1.5 0;-1.5 0', '0.07s')}${body}</g>`
  } else if (m === 'normal' && ctx.gestureNow === 'dance') {
    body =
      `<g>${move('rotate', '-7 70 200;7 70 200;-7 70 200', '0.6s')}` +
      `<g>${move('translate', '0 0;0 -10;0 0', '0.3s', true)}${body}</g></g>`
  }

  const { top, total } = bubbleMetrics(text)
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-30 ${top} 200 ${total}">` + bubbleSvg(text) + body + '</svg>'

  // her animasyonu saat fazına göre başlat: SVG yeniden yüklendiğinde sıfırlanmak yerine kaldığı yerden devam eder
  return svg.replace(/dur="([\d.]+)s"/g, (hit, d) => `${hit} begin="-${(ctx.phase % parseFloat(d)).toFixed(3)}s"`)
}

export const outfitFor = (ms: number) => {
  const d = new Date(ms)
  const h = d.getHours()
  const dow = d.getDay()

  if (h >= 22 || h < 7) return 'night'
  if (dow === 0 || dow === 6) return 'party'

  return 'day'
}
