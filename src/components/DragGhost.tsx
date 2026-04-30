import { createPortal } from 'react-dom'
import type { DragState, Level } from '../types'
import CharacterPortrait from './CharacterPortrait'

interface Props {
  dragState: DragState
  level: Level
}

export default function DragGhost({ dragState, level }: Props) {
  const elem = level.elements.find(e => e.id === dragState.elementId)
  if (!elem) return null

  return createPortal(
    <div
      style={{
        position: 'fixed',
        left: dragState.x,
        top: dragState.y,
        transform: 'translate(-50%, -50%)',
        zIndex: 50,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <CharacterPortrait element={elem} state="dragging" size={64} />
    </div>,
    document.body,
  )
}
