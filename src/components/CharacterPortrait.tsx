import { halftone } from '../utils/halftone'
import type { LevelElement } from '../types'

type PortraitState = 'idle' | 'spent' | 'dragging'

interface Props {
  element: LevelElement
  state?: PortraitState
  size?: number
  onDragStart?: (elementId: string, x: number, y: number) => void
}

export default function CharacterPortrait({ element, state = 'idle', size = 72, onDragStart }: Props) {
  const spent    = state === 'spent'
  const dragging = state === 'dragging'

  const nameBannerH = Math.round(size * 0.28)

  return (
    <div
      style={{
        opacity: spent ? 0.3 : 1,
        transform: dragging ? 'rotate(-3deg) scale(1.08)' : 'none',
        transition: 'transform 0.15s, opacity 0.2s',
        cursor: spent ? 'not-allowed' : dragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        display: 'inline-block',
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
      {/* Portrait box */}
      <div
        style={{
          width: size,
          height: Math.round(size * 1.1),
          border: '2px solid var(--ink)',
          background: element.color,
          boxShadow: dragging ? `6px 6px 0 var(--ink)` : `3px 3px 0 var(--ink)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <span style={{ fontSize: Math.round(size * 0.5), lineHeight: 1, position: 'relative', zIndex: 1 }}>
          {element.icon}
        </span>
        {/* Halftone overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: halftone('var(--ink)', 0.15, 5),
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Name banner */}
      <div
        style={{
          marginTop: -1,
          background: 'var(--ink)',
          color: 'var(--paper)',
          fontFamily: '"Bangers", cursive',
          fontSize: Math.round(nameBannerH * 0.72),
          letterSpacing: '0.08em',
          textAlign: 'center',
          padding: '2px 4px',
          border: '2px solid var(--ink)',
          borderTop: 'none',
          width: size,
        }}
      >
        {element.label.toUpperCase()}
      </div>
    </div>
  )
}
