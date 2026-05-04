import type { LevelElement, Attribute } from '../types'

type PortraitState = 'idle' | 'spent' | 'dragging'

interface Props {
  element: LevelElement
  attribute?: Attribute
  state?: PortraitState
  size?: number
  onDragStart?: (elementId: string, x: number, y: number) => void
}

export default function CharacterPortrait({ element, attribute, state = 'idle', size = 72, onDragStart }: Props) {
  const spent    = state === 'spent'
  const dragging = state === 'dragging'
  const badgeSize = Math.round(size * 0.6)
  return (
    <div
      style={{
        opacity: spent ? 0.3 : 1,
        transform: dragging ? 'rotate(-3deg) scale(1.08)' : 'none',
        transition: 'transform 0.15s, opacity 0.2s',
        cursor: spent ? 'not-allowed' : dragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        display: 'inline-block',
        position: 'relative',
      }}
      onMouseDown={e => {
        if (spent || !onDragStart) return
        e.preventDefault()
        onDragStart(element.id, e.clientX, e.clientY)
      }}
      onTouchStart={e => {
        if (spent || !onDragStart) return
        e.preventDefault()
        const touch = e.touches[0]
        onDragStart(element.id, touch.clientX, touch.clientY)
      }}
    >
      {/* Portrait circle */}
      <div
        style={{
          width: size,
          height: Math.round(size * 1.1),
          border: '2px solid var(--ink)',
          borderRadius: '50%',
          background: element.color,
          boxShadow: dragging ? `6px 6px 0 var(--ink)` : `3px 3px 0 var(--ink)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <span style={{ fontSize: Math.round(size * 0.25),
          lineHeight: 1,
          position: 'relative',
          zIndex: 1,
          color: 'var(--paper)',
          fontStyle:'bold',
          fontFamily: '"Bangers", cursive' }}>
          {element.label.toUpperCase()}
        </span>
      </div>

      {/* Attribute badge */}
      {attribute && (
        <div style={{
          position: 'absolute',
          top: -Math.round(size * 0.12),
          right: -Math.round(size * 0.12),
          width: badgeSize,
          height: badgeSize,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: Math.round(badgeSize * 0.6),
          zIndex: 2,
          pointerEvents: 'none',
        }}>
          {attribute.icon}
        </div>
      )}
    </div>
  )
}
