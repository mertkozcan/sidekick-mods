import type { Mood, Who } from '../types'

export const SOUND_MODES = ['Kapalı', 'Bip', 'Konuşma']

// segments: [frekans Hz, süre ms]; 8 kHz, 16 bit, mono WAV; base64 döner
export const synthWav = (segments: [number, number][]) => {
  const rate = 8000
  const total = segments.reduce((n, s) => n + Math.round((s[1] * rate) / 1000), 0)
  const bytes = new Uint8Array(44 + total * 2)
  const dv = new DataView(bytes.buffer)
  const tag = (o: number, s: string) => {
    for (let i = 0; i < s.length; i++) dv.setUint8(o + i, s.charCodeAt(i))
  }
  tag(0, 'RIFF')
  dv.setUint32(4, 36 + total * 2, true)
  tag(8, 'WAVE')
  tag(12, 'fmt ')
  dv.setUint32(16, 16, true)
  dv.setUint16(20, 1, true)
  dv.setUint16(22, 1, true)
  dv.setUint32(24, rate, true)
  dv.setUint32(28, rate * 2, true)
  dv.setUint16(32, 2, true)
  dv.setUint16(34, 16, true)
  tag(36, 'data')
  dv.setUint32(40, total * 2, true)
  let at = 44

  for (const [freq, ms] of segments) {
    const n = Math.round((ms * rate) / 1000)

    for (let i = 0; i < n; i++) {
      const fade = Math.min(1, i / 40, (n - i) / 40)
      dv.setInt16(at, Math.round(Math.sin((2 * Math.PI * freq * i) / rate) * 9000 * fade), true)
      at += 2
    }
  }

  return bytes.toBase64()
}

export const CLIPS: Record<string, string> = {}

// karakter ve ruh haline göre kısa bir ses; ilk kullanımda üretilip saklanır
export const clipFor = (w: Who, m: Mood) => {
  const key = `${w}:${m}`

  if (!CLIPS[key]) {
    const base = w === 'stajyer' ? 330 : w === 'java' ? 520 : 760
    const segs: [number, number][] =
      m === 'panic'
        ? [[1100, 90], [700, 90], [1100, 90], [700, 90]]
        : m === 'laugh'
          ? [[base, 70], [base * 1.25, 70], [base, 70], [base * 1.25, 70]]
          : m === 'angry'
            ? [[base * 0.6, 160], [base * 0.5, 160]]
            : m === 'sleepy'
              ? [[base * 0.5, 220]]
              : [[base, 70], [base * 1.5, 90]]
    CLIPS[key] = synthWav(segs)
  }

  return CLIPS[key]
}
