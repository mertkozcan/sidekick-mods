import type { Mood, Who } from '../types'

export const RW = 26
export const RH = 44
const RS = 0.18
const ROY = 30

const encodeRaster = (px: number[]) => {
  const rows = RH / 2
  const words = new Uint32Array(RW * rows * 3)
  const DEF = 0x01000000

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < RW; c++) {
      const top = px[2 * r * RW + c]
      const bot = px[(2 * r + 1) * RW + c]
      const i = (r * RW + c) * 3

      if (top < 0 && bot < 0) {
        words[i] = 0x20
        words[i + 1] = DEF
        words[i + 2] = DEF
      } else if (bot < 0) {
        words[i] = 0x2580
        words[i + 1] = top
        words[i + 2] = DEF
      } else if (top < 0) {
        words[i] = 0x2584
        words[i + 1] = bot
        words[i + 2] = DEF
      } else {
        words[i] = 0x2580
        words[i + 1] = top
        words[i + 2] = bot
      }
    }
  }

  return new Uint8Array(words.buffer).toBase64()
}

type Pt = [number, number]

export const clippyRaster = (
  m: Mood,
  isTalking: boolean,
  flapFrame: boolean,
  blink: boolean,
  outfit: string,
  who: Who,
  gz: { gx: number; gy: number },
) => {
  const px: number[] = new Array(RW * RH).fill(-1)
  const dot = (x: number, y: number, rad: number, color: number) => {
    const cx = x * RS
    const cy = (y + ROY) * RS
    const R = rad * RS + 0.5

    for (let j = Math.floor(cy - R); j <= Math.ceil(cy + R); j++) {
      for (let i = Math.floor(cx - R); i <= Math.ceil(cx + R); i++) {
        if (i < 0 || j < 0 || i >= RW || j >= RH) continue
        if ((i + 0.5 - cx) ** 2 + (j + 0.5 - cy) ** 2 <= R * R) px[j * RW + i] = color
      }
    }
  }
  const line = (x1: number, y1: number, x2: number, y2: number) => {
    const out: Pt[] = []
    const n = Math.max(2, Math.ceil(Math.hypot(x2 - x1, y2 - y1) / 2))

    for (let k = 0; k <= n; k++) out.push([x1 + ((x2 - x1) * k) / n, y1 + ((y2 - y1) * k) / n])

    return out
  }
  const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
    const out: Pt[] = []
    const n = Math.max(4, Math.ceil((Math.abs(a1 - a0) * r) / 2))

    for (let k = 0; k <= n; k++) {
      const t = a0 + ((a1 - a0) * k) / n
      out.push([cx + r * Math.cos(t), cy + r * Math.sin(t)])
    }

    return out
  }
  const body: Pt[] = [
    ...line(42, 70, 42, 160),
    ...arc(74, 160, 32, Math.PI, 0),
    ...line(106, 160, 106, 50),
    ...arc(78, 50, 28, 0, -Math.PI),
    ...line(50, 50, 50, 140),
  ]
  const top: Pt[] = [...line(42, 70, 42, 38), ...arc(70, 38, 28, Math.PI, 2 * Math.PI)]

  if (who === 'clippy') {
    for (const p of [...body, ...top]) dot(p[0], p[1], 6, 0x6b7280)
    for (const p of [...body, ...top]) dot(p[0], p[1], 3.5, 0xd1d5db)
  }

  const INK = 0x4b5563
  const ell = (cx: number, cy: number, rx: number, ry: number, color: number) => {
    for (let y = cy - ry; y <= cy + ry; y += 1.5) {
      for (let x = cx - rx; x <= cx + rx; x += 1.5) {
        if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) dot(x, y, 1, color)
      }
    }
  }
  const stroke = (pts: Pt[], color: number) => {
    for (const p of pts) dot(p[0], p[1], 1.2, color)
  }
  const rect = (x0: number, y0: number, x1: number, y1: number, color: number) => {
    for (let y = y0; y <= y1; y += 2) for (let x = x0; x <= x1; x += 2) dot(x, y, 1.6, color)
  }

  if (who === 'stajyer') {
    rect(18, 124, 102, 200, 0x6366f1)
    rect(46, 150, 74, 168, 0xffffff)
    rect(92, 150, 116, 190, 0xffffff)
    ell(60, 80, 42, 48, 0xf2c7a1)
    ell(60, 36, 38, 14, 0x78350f)
  } else if (who === 'java') {
    stroke([...line(44, 34, 40, 20), ...line(40, 20, 48, 8), ...line(48, 8, 44, -8)], 0xf89820)
    stroke([...line(72, 34, 68, 20), ...line(68, 20, 76, 8), ...line(76, 8, 72, -8)], 0xf89820)
    for (const p of [...line(94, 62, 124, 76), ...line(124, 76, 124, 104), ...line(124, 104, 90, 120)]) {
      dot(p[0], p[1], 3, 0x5382a1)
    }
    for (let y = 44; y <= 150; y += 2) {
      const half = 38 - ((y - 44) * 10) / 96
      for (let x = 60 - half; x <= 60 + half; x += 2) dot(x, y, 1.6, 0xf1f5f9)
      dot(60 - half, y, 2.2, 0x5382a1)
      dot(60 + half, y, 2.2, 0x5382a1)
    }
    ell(60, 160, 54, 9, 0x5382a1)
  }

  const eyeOpen = m !== 'sleepy' && m !== 'laugh' && !blink

  if (eyeOpen) {
    const ry = m === 'angry' ? 9 : m === 'panic' ? 15 : 13
    ell(44, 64, 11, ry, 0xffffff)
    ell(76, 64, 11, ry, 0xffffff)
    const dx = m === 'peek' ? -7 : m === 'panic' ? 0 : gz.gx * 5
    const dy = m === 'panic' ? 0 : gz.gy * 4
    dot(46 + dx, 66 + dy, m === 'panic' ? 2 : 4, 0x111827)
    dot(78 + dx, 66 + dy, m === 'panic' ? 2 : 4, 0x111827)
  } else if (m === 'laugh') {
    stroke([...line(33, 68, 44, 58), ...line(44, 58, 55, 68)], INK)
    stroke([...line(65, 68, 76, 58), ...line(76, 58, 87, 68)], INK)
  } else {
    stroke(line(33, 66, 55, 66), INK)
    stroke(line(65, 66, 87, 66), INK)
  }

  const lift = m === 'happy' || m === 'laugh' ? -5 : m === 'panic' ? -9 : 0

  if (m === 'angry') {
    stroke(line(32, 40, 55, 53), INK)
    stroke(line(65, 53, 88, 40), INK)
  } else if (m === 'cry') {
    stroke(line(32, 48, 56, 34), INK)
    stroke(line(64, 34, 88, 48), INK)
  } else if (m !== 'sleepy') {
    stroke([...line(32, 46 + lift, 44, 41 + lift), ...line(44, 41 + lift, 56, 46 + lift)], INK)
    stroke([...line(64, 46 + lift, 76, 41 + lift), ...line(76, 41 + lift, 88, 46 + lift)], INK)
  }

  const flap = isTalking || m === 'laugh'

  if (m === 'cry') {
    ell(40, 84 + (flapFrame ? 8 : 0), 3, 5, 0x7dd3fc)
    ell(80, 92 - (flapFrame ? 8 : 0), 3, 5, 0x7dd3fc)
  }

  if (m === 'panic') ell(60, 98, 7, 9, 0x7f1d1d)
  else if (m === 'cry') stroke([...line(48, 102, 60, 91), ...line(60, 91, 72, 102)], INK)
  else if (flap) ell(60, 97, 10, flapFrame ? 8 : 3, 0x7f1d1d)
  else if (m === 'happy') stroke([...line(46, 92, 60, 104), ...line(60, 104, 74, 92)], INK)
  else if (m === 'angry') stroke([...line(50, 101, 60, 93), ...line(60, 93, 70, 101)], INK)
  else if (m === 'sleepy') stroke(line(54, 96, 66, 96), INK)
  else stroke([...line(50, 94, 60, 99), ...line(60, 99, 70, 94)], INK)

  if (who !== 'clippy') {
    // şapka sadece Clippy'de
  } else if (outfit === 'night') {
    for (let k = 0; k <= 8; k++) ell(66 + k * 3, 10 - k * 2.5, Math.max(1, 12 - k * 1.2), 3, 0xef4444)
    dot(92, -10, 4, 0xffffff)
  } else if (outfit === 'party') {
    for (let k = 0; k <= 8; k++) ell(72, 12 - k * 4, Math.max(1, 20 - k * 2.3), 3, 0xa855f7)
    dot(72, -22, 4, 0xfacc15)
  }

  return encodeRaster(px)
}
