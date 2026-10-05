// Durum satırı: çalışırken dönen komik bir fiil, süre ve araç adı; boştayken "Boşta".
// Panel yeniden çizilmesin diye zamanlayıcı burada, yerel çalışır.
// Prop'lar: { running, base (sn), tool, verbs }. Her yeni prop'ta süre `base`ten yeniden başlar;
// fiil ise kesilmeden akar (her 3 saniyede bir değişir).
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

export default function Elapsed(props: unknown, surface: any) {
  const { Box, Text } = surface.elements
  const p = (props ?? {}) as { running?: boolean; base?: number; tool?: string; verbs?: string[] }
  let st = surface.state as { n: number; k: number; v: number; key: string } | undefined

  if (st === undefined) {
    st = { n: 0, k: 0, v: Math.floor(Math.random() * 1000), key: '' }
    surface.setState(st)
    const live = st

    surface.every(1000, () => {
      live.n += 1
      live.k += 1
      surface.setState(live)
    })
  }

  const key = `${p.running}:${p.base}:${p.tool}`

  if (st.key !== key) {
    st.key = key
    st.n = 0
  }

  const width = surface.columns > 0 ? surface.columns : 34
  const line = !p.running
    ? 'Boşta. Ben de.'
    : (() => {
        const verbs = p.verbs && p.verbs.length > 0 ? p.verbs : ['Çalışıyor']
        const verb = verbs[(st.v + Math.floor(st.k / 3)) % verbs.length]

        return `${verb}… ${fmt((p.base ?? 0) + st.n)}${p.tool ? ` · ${p.tool}` : ''}`
      })()

  return (
    <Box width={width} justifyContent="center">
      <Text>{line}</Text>
    </Box>
  )
}
