import type { Level, LevelElement } from '../types'
import { parseBody } from '../utils/parseBody'
import NodeConstraints from './NodeConstraints'

interface Props {
  level: Level
  focusedNodeIdx: number
  placements: Map<number, string[]>
}

export default function PointDetailPane({ level, focusedNodeIdx, placements }: Props) {
  const node = level.nodes[focusedNodeIdx]
  const cap = node.capacity ?? 1
  const placedElements = (placements.get(focusedNodeIdx) ?? [])
    .map(id => level.elements.find(e => e.id === id))
    .filter((e): e is LevelElement => e !== undefined)

  return (
    <aside style={{
      width: 260, flexShrink: 0,
      background: 'var(--paper)',
      borderLeft: '2px solid var(--ink)',
      padding: '28px 18px',
      display: 'flex', flexDirection: 'column', gap: 14,
      overflowY: 'auto',
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--muted)', fontWeight: 700 }}>
            POINT {focusedNodeIdx + 1}
          </div>
          {cap > 1 && (
            <div style={{
              fontFamily: '"Bangers", cursive', fontSize: 11, letterSpacing: '0.08em',
              background: 'var(--cool)', border: '1.5px solid var(--ink)',
              padding: '1px 6px', lineHeight: 1.4, color: '#fff',
            }}>
              {cap} SLOTS
            </div>
          )}
        </div>
        <div style={{ fontFamily: '"Bangers", cursive', fontSize: 24, letterSpacing: '0.04em', lineHeight: 1.1, marginTop: 2 }}>
          {node.label}
        </div>
      </div>

      <div style={{
        border: '2px solid var(--ink)', background: 'var(--paper)',
        boxShadow: '4px 4px 0 var(--ink)', padding: '10px 12px',
      }}>
        <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, color: '#403a30', lineHeight: 1.5, fontStyle: 'italic' }}>
          {parseBody(node.body, placedElements).map((seg, i) =>
            seg.type === 'text'  ? seg.value :
            seg.type === 'name'  ? <span key={i} style={{ color: seg.color, fontWeight: 700, fontStyle: 'normal' }}>{seg.label}</span> :
                                   <span key={i} style={{ color: 'var(--muted)' }}>???</span>
          )}
        </div>
      </div>

      <NodeConstraints level={level} nodeIdx={focusedNodeIdx} placements={placements} />
    </aside>
  )
}
