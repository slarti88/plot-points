export default function TimelineSpine({ height = 900 }: { height?: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 2,
        height,
        background: 'var(--ink)',
      }}
    />
  )
}
