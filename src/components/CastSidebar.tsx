import type { Level } from '../types'
import { halftone } from '../utils/halftone'
import CharacterPortrait from './CharacterPortrait'

interface Props {
  level: Level
  isMobile: boolean
  onDragStart: (elementId: string, x: number, y: number) => void
}

export default function CastSidebar({ level, isMobile, onDragStart }: Props) {

  if (isMobile) {
    const overflows = level.elements.length > 5
    return (
      <div style={{
        flexShrink: 0,
        background: 'var(--paper-alt)',
        backgroundImage: halftone('var(--ink)', 0.06, 6),
        borderTop: '2px solid var(--ink)',
        height: 'calc(128px + env(safe-area-inset-bottom))',
        display: 'flex',
        alignItems: 'center',
        overflowX: overflows ? 'auto' : 'visible',
        justifyContent: overflows ? 'flex-start' : 'center',
        padding: '0 12px',
        paddingBottom: 'calc(25px + env(safe-area-inset-bottom))',
        gap: 12,
      }}>
        {level.elements.map(elem => (
          <div key={elem.id} style={{ flexShrink: 0 }}>
            <CharacterPortrait
              element={elem}
              attribute={elem.attribute ? level.attributes?.[elem.attribute] : undefined}
              size={52}
              state="idle"
              onDragStart={onDragStart}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <aside style={{
      width: 240, flexShrink: 0,
      background: 'var(--paper-alt)',
      backgroundImage: halftone('var(--ink)', 0.06, 6),
      borderRight: '2px solid var(--ink)',
      display: 'flex', flexDirection: 'column', gap: 0,
      height: '100%', overflow: 'hidden',
    }}>
      <div style={{ padding: '24px 18px 12px' }}>
        <div style={{ fontFamily: '"Bangers", cursive', fontSize: 30, letterSpacing: '0.06em', lineHeight: 1 }}>
          THE CAST
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.06em', marginTop: 2 }}>
          DRAG ONTO THE TIMELINE
        </div>
      </div>

      <div style={{ height: '1.5px', background: 'var(--ink)', opacity: 0.15, margin: '0 18px' }} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 18,
        padding: '18px 18px',
        flex: 1,
        alignContent: 'start',
      }}>
        {level.elements.map(elem => (
          <div key={elem.id} style={{ display: 'flex', justifyContent: 'center' }}>
            <CharacterPortrait
              element={elem}
              attribute={elem.attribute ? level.attributes?.[elem.attribute] : undefined}
              size={80}
              state="idle"
              onDragStart={onDragStart}
            />
          </div>
        ))}
      </div>
    </aside>
  )
}
