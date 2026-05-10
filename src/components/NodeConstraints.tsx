import type { Level } from '../types'
import CharacterPortrait from './CharacterPortrait'

interface Props {
  level: Level
  nodeIdx: number
  placements: Map<number, string[]>
}

export default function NodeConstraints({ level, nodeIdx, placements }: Props) {
  const node = level.nodes[nodeIdx]
  const cap = node.capacity ?? 1
  const thisElements = placements.get(nodeIdx) ?? []

  const allowed = node.allowedElements ?? []
  const showAllowed = allowed.length > 0 && allowed.length < level.elements.length
  const eligibleElements = showAllowed
    ? level.elements.filter(e => allowed.includes(e.id))
    : []

  const slots = Array.from({ length: cap }, (_, i) => {
    const notShareId = node.mustNotShareWith?.[i]
    const notShareRef = notShareId ? level.nodes.findIndex(n => n.id === notShareId) : -1
    const notShareLabel = notShareRef !== -1 ? level.nodes[notShareRef].label : null

    const exists = thisElements.length > i
    const isViolated = !exists || (placements.get(notShareRef) ?? []).some(id => id === thisElements[i])
    const notShareViolated = notShareRef !== -1 && isViolated

    const shareId = node.mustShareWith?.[i]
    const shareRef = shareId ? level.nodes.findIndex(n => n.id === shareId) : -1
    const shareLabel = shareRef !== -1 ? level.nodes[shareRef].label : null
    const shareMet = shareRef !== -1
      && thisElements.length > 0
      && thisElements.some(id => (placements.get(shareRef) ?? []).includes(id))

    const cooldown = node.t[i] ?? 0

    const attributeLabel = node.attribute;

    return { notShareLabel, notShareViolated, shareLabel, shareMet, cooldown, attributeLabel }
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {showAllowed && <div style={{
                  display: 'flex', flexWrap: 'wrap', gap: 4,
                  alignContent: 'flex-start', overflow: 'hidden',
                  flexShrink: 0,
                }}>
                  <div style={{ fontSize: 11, color: '#403a30', flexShrink: 0 }}>Only/:</div>
                  {eligibleElements.map(el => (
                      <div
                        key={el.id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 3,
                          background: el.color + '33',
                          border: `1.5px solid var{--ink}`,
                          boxShadow: `1.5px 1.5px 0 var{--ink}`,
                          padding: '2px 4px 2px 3px',
                          cursor: 'grab', userSelect: 'none',
                          fontFamily: '"Nunito", sans-serif', fontSize: 10, fontWeight: 700,
                        }}
                      >
                        <span style={{ color: 'var{--ink}' }}>{el.label}</span>
                      </div>
                    ))}
                </div>
      }
      {slots.map((slot, i) => {
        const hasConditions = slot.notShareLabel || slot.shareLabel || slot.cooldown > 0
        return (
          <div
            key={i}
            style={{
              borderTop: i > 0 ? '1px dashed rgba(21,19,26,0.2)' : 'none',
              paddingTop: i > 0 ? 10 : 0,
            }}
          >
            {cap > 1 && (
              <div style={{
                fontFamily: '"Bangers", cursive', fontSize: 12, letterSpacing: '0.08em',
                color: 'var(--muted)', marginBottom: 5,
              }}>
                SLOT {i + 1}
              </div>
            )}
            {!hasConditions && (
              <div style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic' }}>No conditions</div>
            )}
            {slot.notShareLabel && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 6,
                border: '1.5px solid var(--ink)',
                padding: '4px 7px', marginBottom: 4,
                background: slot.notShareViolated ? '#ffebee' : 'var(--paper)',
                boxShadow: '1.5px 1.5px 0 var(--ink)',
              }}>
                <span style={{
                  fontSize: 12, fontWeight: 700,
                  color: slot.notShareViolated ? '#c62828' : 'var(--muted)',
                  flexShrink: 0, lineHeight: 1.4,
                }}>
                  {slot.notShareViolated ? '✗' : '✓'}
                </span>
                <div style={{ fontSize: 11, color: slot.notShareViolated ? '#c62828' : '#2e7d32', lineHeight: 1.4 }}>
                  Cannot share with <strong>{slot.notShareLabel}</strong>
                </div>
              </div>
            )}
            {slot.shareLabel && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 6,
                border: '1.5px solid var(--ink)',
                padding: '4px 7px', marginBottom: 4,
                background: slot.shareMet ? '#e8f5e9' : 'var(--paper)',
                boxShadow: '1.5px 1.5px 0 var(--ink)',
              }}>
                <span style={{
                  fontSize: 12, fontWeight: 700,
                  color: slot.shareMet ? '#2e7d32' : 'var(--muted)',
                  flexShrink: 0, lineHeight: 1.4,
                }}>
                  {slot.shareMet ? '✓' : '○'}
                </span>
                <div style={{ fontSize: 11, color: slot.shareMet ? '#2e7d32' : '#403a30', lineHeight: 1.4 }}>
                  Shares character with <strong>{slot.shareLabel}</strong>
                </div>
              </div>
            )}
            {slot.cooldown > 0 && (
              <div style={{ fontSize: 11, color: '#403a30', paddingLeft: 2 }}>
                Character cannot be used for the next {slot.cooldown} turn{slot.cooldown !== 1 ? 's' : ''}
              </div>
            )}
            {slot.attributeLabel && (
              <div style={{ fontSize: 11, color: '#403a30', paddingLeft: 2 }}>
                <b>{slot.attributeLabel}</b> needed!
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
