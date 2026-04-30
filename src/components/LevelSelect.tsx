import type { LevelInfo } from '../types'
import { halftone } from '../utils/halftone'

interface Props {
  levels: LevelInfo[]
  onSelect: (id: string) => void
}

export default function LevelSelect({ levels, onSelect }: Props) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh',
      background: 'var(--paper)',
      backgroundImage: halftone('var(--ink)', 0.05, 6),
      userSelect: 'none',
    }}>
      <header style={{
        padding: '32px 32px 24px',
        borderBottom: '2px solid var(--ink)',
        flexShrink: 0,
      }}>
        <div style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--muted)', fontWeight: 700, marginBottom: 4 }}>
          PLOTPOINTS
        </div>
        <div style={{ fontFamily: '"Bangers", cursive', fontSize: 48, letterSpacing: '0.06em', lineHeight: 1, color: 'var(--ink)' }}>
          SELECT CHAPTER
        </div>
      </header>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        {levels.map((level, idx) => (
          <button
            key={level.id}
            onClick={() => onSelect(level.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 20,
              background: 'var(--paper)',
              border: '2px solid var(--ink)',
              boxShadow: '4px 4px 0 var(--ink)',
              padding: '16px 20px',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              maxWidth: 480,
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              border: '2px solid var(--ink)',
              background: 'var(--paper-alt)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: '"Bangers", cursive', fontSize: 22, letterSpacing: '0.04em',
              color: 'var(--ink)', flexShrink: 0,
            }}>
              {idx + 1}
            </div>
            <div>
              <div style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--muted)', fontWeight: 700, marginBottom: 2 }}>
                CHAPTER {idx + 1}
              </div>
              <div style={{ fontFamily: '"Bangers", cursive', fontSize: 24, letterSpacing: '0.04em', lineHeight: 1, color: 'var(--ink)' }}>
                {level.title}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
