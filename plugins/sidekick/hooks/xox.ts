// XOX (tic-tac-toe): oyuncu X, karakter O. Tahta 9 karakterlik dize: ' ', 'X' ya da 'O'.
export type Outcome = '' | 'X' | 'O' | 'draw'

export const EMPTY = ' '.repeat(9)

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export const outcome = (b: string): Outcome => {
  for (const [a, c, d] of LINES) {
    if (b[a] !== ' ' && b[a] === b[c] && b[a] === b[d]) return b[a] as 'X' | 'O'
  }

  return b.includes(' ') ? '' : 'draw'
}

const put = (b: string, i: number, mark: string) => b.slice(0, i) + mark + b.slice(i + 1)

// Karakterin hamlesi: kazanabiliyorsa çoğu zaman kazanır, bloklamayı da sık unutur; yenilebilir olsun
const winningCell = (b: string, mark: string) => {
  for (let i = 0; i < 9; i++) {
    if (b[i] === ' ' && outcome(put(b, i, mark)) === mark) return i
  }

  return -1
}

export const botMove = (b: string, rnd: () => number = Math.random) => {
  const free = [...b].flatMap((c, i) => (c === ' ' ? [i] : []))

  if (free.length === 0) return -1

  const win = winningCell(b, 'O')

  if (win >= 0 && rnd() < 0.85) return win

  const block = winningCell(b, 'X')

  if (block >= 0 && rnd() < 0.6) return block

  if (b[4] === ' ' && rnd() < 0.5) return 4

  return free[Math.floor(rnd() * free.length)]
}

// Oyuncu hamlesi + karakterin cevabı. Geçersiz hamlede tahtayı değiştirmez.
export const play = (b: string, i: number, rnd: () => number = Math.random) => {
  if (!Number.isInteger(i) || i < 0 || i > 8 || b[i] !== ' ' || outcome(b) !== '') {
    return { board: b, result: outcome(b), moved: false }
  }

  let next = put(b, i, 'X')
  let result = outcome(next)

  if (result === '') {
    const j = botMove(next, rnd)
    next = put(next, j, 'O')
    result = outcome(next)
  }

  return { board: next, result, moved: true }
}

export const XOX = {
  start: [
    'XOX mu? Tamam. Ben O, sen X. Acımayacağım.',
    'Oyun mu istiyorsun? İş yapmaktan iyidir. Sıra sende.',
    'Tahtayı çizdim. Kaybedeceğin için şimdiden üzgünüm.',
  ],
  // oyuncu yendi: ağlar, hileci der
  lose: [
    'Hile yaptın! Ben gördüm! HİLECİ!',
    'Olamaz... Bu hileci bir hamleydi. Kural dışı.',
    'Huhuuu... Hileci. Kesin tahtaya baktın.',
    'Ben bunu kabul etmiyorum. Hileci! Bir daha oynayalım.',
    'Yazılımda bir hata olmalı. Yoksa sen kazanamazdın. Hileci.',
  ],
  // karakter yendi: ezikleme
  win: [
    'Kazandım. Şaşırdın mı? Ben şaşırmadım.',
    'XOX\'te yenildin. Bir de kod yazıyorsun, değil mi?',
    'Bu kadar mı? Rakip aramaya devam ederim.',
    'Üçlü yaptım. Sana da teselli olarak bir X kaldı.',
  ],
  draw: [
    'Berabere. Kimse kazanmadı, yani ben kaybetmedim.',
    'Berabere mi? Seni kolay sanmıştım. Tekrar.',
  ],
  quit: ['Kaçıyorsun demek. Kaybetmekten korktun.', 'Oyun bitti. Ben kazanmış sayıyorum.'],
}
