interface Props {
  solvedCount: number
  totalCount: number
  onRestart: () => void
  onSelectLevel: () => void
}

export default function WinOverlay({ solvedCount, totalCount, onRestart, onSelectLevel }: Props) {
  return (
    <div
      style={{
        position: 'absolute', inset: 0, zIndex: 40,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(21,19,26,0.78)',
        backdropFilter: 'blur(2px)',
        animation: 'hf-slide-up 0.3s cubic-bezier(.2,.8,.3,1)',
      }}
    >
      <div style={{
        background: 'var(--paper)',
        border: '3px solid var(--ink)',
        boxShadow: '6px 6px 0 var(--ink)',
        padding: '36px 48px',
        textAlign: 'center',
        maxWidth: 420,
      }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>✦</div>

        <div style={{
          fontFamily: '"Bangers", cursive',
          fontSize: 48, letterSpacing: '0.06em', lineHeight: 1,
          color: 'var(--accent)', marginBottom: 8,
        }}>
          CHAPTER COMPLETE!
        </div>

        <div style={{
          fontFamily: '"Bangers", cursive',
          fontSize: 22, letterSpacing: '0.04em',
          color: 'var(--ink)', marginBottom: 6,
        }}>
          {solvedCount} / {totalCount} POINTS SOLVED
        </div>

        <div style={{
          fontFamily: '"Nunito", sans-serif',
          fontSize: 13, color: '#8a8275', marginBottom: 24, lineHeight: 1.4,
          fontStyle: 'italic',
        }}>
          The road north is finally clear.
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            onClick={onSelectLevel}
            style={{
              fontFamily: '"Bangers", cursive', fontSize: 16, letterSpacing: '0.06em',
              border: '2px solid var(--ink)', background: 'var(--paper)',
              padding: '8px 20px',
              boxShadow: '3px 3px 0 var(--ink)',
              color: 'var(--ink)',
              cursor: 'pointer',
            }}
          >
            ← LEVELS
          </button>
          <button
            onClick={onRestart}
            style={{
              fontFamily: '"Bangers", cursive', fontSize: 16, letterSpacing: '0.06em',
              border: '2px solid var(--ink)', background: 'var(--accent2)',
              padding: '8px 20px',
              boxShadow: '3px 3px 0 var(--ink)',
              color: 'var(--ink)',
              cursor: 'pointer',
            }}
          >
            PLAY AGAIN ↺
          </button>
        </div>
      </div>
    </div>
  )
}
