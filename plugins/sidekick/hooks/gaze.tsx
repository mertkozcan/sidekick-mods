// Fare takibi: panelin arkasına konan görünmez bölge. İşaretçi karakterin
// merkezine göre hangi yönde olduğuna bakılır ve { gx, gy } (-1, 0, 1) hooks
// modülüne gönderilir. Karakterin merkezi yaklaşık olarak (sütun/2, 12. satır).

export default function Gaze(props: unknown, surface: any) {
  const { Box, Text } = surface.elements
  const rows: number = (props as { rows?: number } | null)?.rows ?? 22
  const centerRow: number = (props as { centerRow?: number } | null)?.centerRow ?? 11

  if (surface.state === undefined) {
    surface.setState({ started: true })

    surface.onPointer((ev: any) => {
      const cols = surface.columns
      let gx = 0
      let gy = 0

      if (ev.type !== 'leave' && cols > 0) {
        const dx = ev.x - cols / 2
        const dy = ev.y - centerRow
        gx = dx < -5 ? -1 : dx > 5 ? 1 : 0
        gy = dy < -4 ? -1 : dy > 4 ? 1 : 0
      }

      surface.post({ gx, gy })
    })
  }

  // Bölge çizilen içeriğin boyunu alıyor: `rows` satır boş metin çiz
  return (
    <Box flexDirection="column" height={rows}>
      {Array.from({ length: rows }, (_, i) => (
        <Text key={`r${i}`}>{' '}</Text>
      ))}
    </Box>
  )
}
