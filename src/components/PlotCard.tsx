import { halftone } from '../utils/halftone'
import { parseBody } from '../utils/parseBody'
import type { Attribute, Level, LevelElement, LevelNode } from '../types'
import NodeConstraints from './NodeConstraints'

export type CardState = 'normal' | 'accepting' | 'rejecting'

interface Props {
  node: LevelNode
  nodeIdx: number
  placedElements: LevelElement[]
  cardState: CardState
  isGlowing: boolean
  isFlashing: boolean
  isMobile: boolean
  isFlipped: boolean
  level: Level
  placements: Map<number, string[]>
  onSlotDragStart: (elementId: string, nodeIdx: number, x: number, y: number) => void
  onDetach: (nodeIdx: number, elementId: string) => void
  onNodeSelect: (nodeIdx: number) => void
  onFlip: () => void
}

const INK     = 'var(--ink)'
const PAPER   = 'var(--paper)'
const ACCENT  = 'var(--accent)'
const ACCENT2 = 'var(--accent2)'
const REJECT  = 'var(--reject)'

export default function PlotCard({
  node, nodeIdx, placedElements, cardState, isGlowing, isFlashing,
  isMobile, isFlipped, level, placements,
  onSlotDragStart, onDetach, onNodeSelect, onFlip,
}: Props) {
  const cap      = node.capacity ?? 1
  const isFull   = placedElements.length >= cap
  const isEmpty  = placedElements.length === 0
  const accepting = cardState === 'accepting'
  const rejecting = cardState === 'rejecting' || isFlashing

  const borderColor = rejecting ? REJECT : INK
  const shadow      = rejecting ? `4px 4px 0 ${REJECT}` : `4px 4px 0 ${INK}`
  const borderStyle = accepting ? 'dashed' : 'solid'

  if (isMobile) {
    return (
      <div style={{ position: 'relative', height: 'calc((100svh - 176px) / 4)' }}>
        {isGlowing && (
          <div
            className="animate-hf-pulse"
            style={{
              position: 'absolute', inset: -8, borderRadius: 4, pointerEvents: 'none',
              background: `radial-gradient(ellipse at center, ${ACCENT2}99 0%, transparent 70%)`,
              filter: 'blur(8px)',
            }}
          />
        )}

        {/* Number badge positioned on outer wrapper so it isn't clipped */}
        <div style={{
          position: 'absolute', top: -13, left: -13, zIndex: 3,
          width: 28, height: 28, borderRadius: '50%',
          background: isFull ? ACCENT : PAPER,
          border: `2px solid ${INK}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: '"Bangers", cursive', fontSize: 14,
          color: isFull ? PAPER : INK,
          boxShadow: `2px 2px 0 ${INK}`,
        }}>
          {nodeIdx + 1}
        </div>

        <div
          data-node-idx={nodeIdx}
          onClick={onFlip}
          style={{
            border: `2px ${borderStyle} ${borderColor}`,
            background: PAPER,
            boxShadow: shadow,
            position: 'relative',
            cursor: 'default',
            height: '100%',
            display: 'flex',
          }}
        >
          {isFlipped ? (
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '10px 12px',
            }}>
              <NodeConstraints level={level} nodeIdx={nodeIdx} placements={placements} />
            </div>
          ) : (
            <>
              {/* Image region — left 38% */}
              <div style={{
                width: '38%',
                flexShrink: 0,
                height: '100%',
                borderRight: `2px solid ${borderColor}`,
                position: 'relative',
                overflow: 'hidden',
              }}>
                {accepting
                  ? <AcceptingSlot />
                  : (rejecting && isEmpty)
                  ? <RejectingSlot />
                  : <LayeredImageRegion
                      node={node}
                      placedElements={placedElements}
                      isEmpty={isEmpty}
                      isSingleSlot={cap === 1}
                      attributes={level.attributes}
                      onDragStart={(x, y) => onSlotDragStart(placedElements[0].id, nodeIdx, x, y)}
                    />
                }
              </div>

              {/* Text panel — right 62% */}
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: '8px 8px 6px',
                overflow: 'hidden',
                gap: 5,
              }}>
                <div style={{
                  fontFamily: '"Bangers", cursive',
                  fontSize: 14, letterSpacing: '0.04em',
                  color: INK, lineHeight: 1.1,
                  flexShrink: 0,
                }}>
                  {node.label}
                </div>

                <div style={{
                  display: 'flex', flexWrap: 'wrap', gap: 4,
                  alignContent: 'flex-start', overflow: 'hidden',
                  flexShrink: 0,
                }}>
                  {Array.from({ length: cap }).map((_, slotIdx) => {
                    const elem = placedElements[slotIdx]
                    return elem ? (
                      <div
                        key={elem.id}
                        onMouseDown={e => { e.preventDefault(); e.stopPropagation(); onSlotDragStart(elem.id, nodeIdx, e.clientX, e.clientY) }}
                        onTouchStart={e => { e.preventDefault(); e.stopPropagation(); const t = e.touches[0]; onSlotDragStart(elem.id, nodeIdx, t.clientX, t.clientY) }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 3,
                          background: elem.color + '33',
                          border: `1.5px solid ${INK}`,
                          boxShadow: `1.5px 1.5px 0 ${INK}`,
                          padding: '2px 4px 2px 3px',
                          cursor: 'grab', userSelect: 'none',
                          fontFamily: '"Nunito", sans-serif', fontSize: 10, fontWeight: 700,
                        }}
                      >
                        <span style={{ fontSize: 11 }}>{elem.icon}</span>
                        <span style={{ color: INK }}>{elem.label}</span>
                        <button
                          onMouseDown={e => { e.preventDefault(); e.stopPropagation(); onDetach(nodeIdx, elem.id) }}
                          onTouchStart={e => { e.preventDefault(); e.stopPropagation(); onDetach(nodeIdx, elem.id) }}
                          style={{
                            marginLeft: 2, width: 14, height: 14, borderRadius: '50%',
                            background: PAPER, border: `1.5px solid ${INK}`,
                            fontFamily: '"Bangers", cursive', fontSize: 10,
                            cursor: 'pointer', padding: 0, lineHeight: 1,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: INK, flexShrink: 0,
                          }}
                        >×</button>
                      </div>
                    ) : (
                      <div
                        key={`empty-${slotIdx}`}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          width: 38, height: 20,
                          border: `1.5px dashed ${INK}`,
                          color: 'var(--muted)',
                          fontFamily: '"Bangers", cursive', fontSize: 12,
                        }}
                      >+</div>
                    )
                  })}
                </div>

                {node.body && (
                  <div style={{
                    fontFamily: '"Nunito", sans-serif',
                    fontSize: 10,
                    lineHeight: 1.4,
                    color: '#403a30',
                    fontStyle: 'italic',
                    flex: 1,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {parseBody(node.body, placedElements).map((seg, i) =>
                      seg.type === 'text'  ? seg.value :
                      seg.type === 'name'  ? <span key={i} style={{ color: seg.color, fontWeight: 700, fontStyle: 'normal' }}>{seg.label}</span> :
                                             <span key={i} style={{ color: 'var(--muted)' }}>???</span>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  // Desktop layout
  return (
    <div style={{ position: 'relative' }}>
      {isGlowing && (
        <div
          className="animate-hf-pulse"
          style={{
            position: 'absolute', inset: -10, borderRadius: 4, pointerEvents: 'none',
            background: `radial-gradient(ellipse at center, ${ACCENT2}99 0%, transparent 70%)`,
            filter: 'blur(8px)',
          }}
        />
      )}

      <div
        data-node-idx={nodeIdx}
        onClick={() => onNodeSelect(nodeIdx)}
        style={{
          border: `2px ${borderStyle} ${borderColor}`,
          background: PAPER,
          boxShadow: shadow,
          position: 'relative',
          cursor: 'default',
        }}
      >
        <div style={{
          position: 'absolute', top: -14, left: -14, zIndex: 3,
          width: 32, height: 32, borderRadius: '50%',
          background: isFull ? ACCENT : PAPER,
          border: `2px solid ${INK}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: '"Bangers", cursive', fontSize: 16,
          color: isFull ? PAPER : INK,
          boxShadow: `2px 2px 0 ${INK}`,
        }}>
          {nodeIdx + 1}
        </div>

        <div style={{
          height: 140, width: 280,
          borderRight: `2px solid ${borderColor}`,
          position: 'relative', overflow: 'hidden',
          background: PAPER,
        }}>
          {accepting
            ? <AcceptingSlot />
            : (rejecting && isEmpty)
            ? <RejectingSlot />
            : <LayeredImageRegion
                node={node}
                placedElements={placedElements}
                isEmpty={isEmpty}
                isSingleSlot={cap === 1}
                attributes={level.attributes}
                onDragStart={(x, y) => onSlotDragStart(placedElements[0].id, nodeIdx, x, y)}
              />
          }

          {placedElements.length > 0 && !accepting && !(rejecting && isEmpty) && (
            <div style={{
              position: 'absolute', top: 8, right: 8,
              display: 'flex', flexDirection: 'column', gap: 4, zIndex: 2,
            }}>
              {placedElements.map(elem => (
                <div key={elem.id} style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  background: PAPER, border: `1.5px solid ${INK}`,
                  boxShadow: `1.5px 1.5px 0 ${INK}`,
                  padding: '2px 4px', fontSize: 13,
                }}>
                  {elem.icon}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{
          display: 'flex', gap: 6, padding: '6px 10px',
          borderBottom: `2px solid ${borderColor}`,
          background: PAPER, flexWrap: 'wrap',
        }}>
          {Array.from({ length: cap }).map((_, slotIdx) => {
            const elem = placedElements[slotIdx]
            return elem
              ? (
                <div
                  key={elem.id}
                  onMouseDown={e => { e.preventDefault(); e.stopPropagation(); onSlotDragStart(elem.id, nodeIdx, e.clientX, e.clientY) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    background: elem.color + '33',
                    border: `1.5px solid ${INK}`,
                    boxShadow: `1.5px 1.5px 0 ${INK}`,
                    padding: '3px 6px 3px 5px',
                    cursor: 'grab', userSelect: 'none',
                    fontFamily: '"Nunito", sans-serif', fontSize: 11, fontWeight: 700,
                  }}
                >
                  <span style={{ fontSize: 13 }}>{elem.icon}</span>
                  <span style={{ color: INK }}>{elem.label}</span>
                  <button
                    onMouseDown={e => { e.preventDefault(); e.stopPropagation(); onDetach(nodeIdx, elem.id) }}
                    style={{
                      marginLeft: 2, width: 16, height: 16, borderRadius: '50%',
                      background: PAPER, border: `1.5px solid ${INK}`,
                      fontFamily: '"Bangers", cursive', fontSize: 11,
                      cursor: 'pointer', padding: 0, lineHeight: 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: INK, flexShrink: 0,
                    }}
                  >×</button>
                </div>
              )
              : (
                <div
                  key={`empty-${slotIdx}`}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 48, height: 26,
                    border: `1.5px dashed ${INK}`,
                    color: 'var(--muted)',
                    fontFamily: '"Bangers", cursive', fontSize: 14,
                  }}
                >+</div>
              )
          })}
        </div>

        <div>
          <div style={{
            fontFamily: '"Bangers", cursive', fontSize: 15,
            letterSpacing: '0.04em', color: INK, marginBottom: 2,
            position: 'absolute', top: 10, left: 300,
          }}>
            {node.label}
          </div>
          <div style={{
            fontFamily: '"Nunito", sans-serif', fontSize: 11,
            lineHeight: 1.4, color: '#403a30',
            paddingRight: 10,
            fontStyle: isFull ? 'normal' : 'italic',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            position: 'absolute', top: 40, left: 300,
          }}>
            {parseBody(node.body, placedElements).map((seg, i) =>
              seg.type === 'text'  ? seg.value :
              seg.type === 'name'  ? <span key={i} style={{ color: seg.color, fontWeight: 700, fontStyle: 'normal' }}>{seg.label}</span> :
                                     <span key={i} style={{ color: 'var(--muted)' }}>???</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function LayeredImageRegion({ node, placedElements, isEmpty, isSingleSlot, attributes, onDragStart }: {
  node: LevelNode
  placedElements: LevelElement[]
  isEmpty: boolean
  isSingleSlot: boolean
  attributes?: Record<string, Attribute>
  onDragStart: (x: number, y: number) => void
}) {
  const canDrag = isSingleSlot && !isEmpty
  const attrBadges = node.attribute ? attributes?.[node.attribute] : undefined;
  //console.log("attr " + attributes?.["ghost-ring"].name + " elem " + placedElements);

  return (
    <div
      onMouseDown={canDrag ? (e => { e.preventDefault(); onDragStart(e.clientX, e.clientY) }) : undefined}
      onTouchStart={canDrag ? (e => { e.preventDefault(); const t = e.touches[0]; onDragStart(t.clientX, t.clientY) }) : undefined}
      style={{
        width: '100%', height: '100%', position: 'relative',
        background: PAPER,
        cursor: canDrag ? 'grab' : 'default',
      }}
    >
      {node.emptyImage && (
        <img
          src={node.emptyImage} alt="" draggable={false}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }}
        />
      )}

      {placedElements.map(elem => {
        const imgUrl = node.filledImages?.[elem.id]
        if (!imgUrl) return null
        return (
          <img
            key={elem.id}
            src={imgUrl} alt="" draggable={false}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }}
          />
        )
      })}

      {isEmpty && !node.emptyImage && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            border: `2px dashed var(--ink)`, background: PAPER,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: '"Bangers", cursive', fontSize: 18, color: INK,
          }}>?</div>
        </div>
      )}
      {attrBadges && (
        <div style={{
          position: 'absolute', bottom: 6, right: 6, zIndex: 3,
          display: 'flex', flexDirection: 'column', gap: 3,
          alignItems: 'center',
        }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: PAPER, border: `2px solid ${INK}`,
              boxShadow: `1px 1px 0 ${INK}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12,
            }}>
              {attrBadges.icon}
            </div>
        </div>
      )}
    </div>
  )
}

function AcceptingSlot() {
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `${ACCENT2}66`,
      backgroundImage: halftone('var(--ink)', 0.15, 7),
    }}>
      <div className="animate-hf-bob" style={{
        width: 36, height: 36, borderRadius: '50%',
        border: `2px solid var(--ink)`, background: ACCENT2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: '"Bangers", cursive', fontSize: 13, color: INK,
        boxShadow: `2px 2px 0 var(--ink)`,
      }}>
        DROP
      </div>
    </div>
  )
}

function RejectingSlot() {
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `${REJECT}22`,
      backgroundImage: halftone(REJECT, 0.3, 7),
    }}>
      <div style={{
        fontFamily: '"Bangers", cursive', fontSize: 16, color: REJECT,
        background: PAPER, padding: '3px 8px',
        border: `2px solid ${REJECT}`,
        boxShadow: `2px 2px 0 ${REJECT}`,
        transform: 'rotate(-4deg)',
      }}>
        NOPE!
      </div>
    </div>
  )
}
