import { useState } from 'react'
import type { Level, DragState } from '../types'
import { validate } from '../utils/validate'
import PlotCard, { type CardState } from './PlotCard'
import TimelineSpine from './TimelineSpine'

const INK   = 'var(--ink)'
const PAPER = 'var(--paper)'

interface Props {
  level: Level
  placements: Map<number, string[]>
  flashingCards: Set<number>
  glowingCards: Set<number>
  dragState: DragState | null
  isMobile: boolean
  flippedCardIdx: number | null
  onDetach: (nodeIdx: number, elementId: string) => void
  onSlotDragStart: (elementId: string, nodeIdx: number, x: number, y: number) => void
  onNodeSelect: (nodeIdx: number) => void
  onCardFlip: (nodeIdx: number) => void
}

export default function NodeList({
  level, placements, flashingCards, glowingCards,
  dragState, isMobile, flippedCardIdx,
  onDetach, onSlotDragStart, onNodeSelect, onCardFlip,
}: Props) {
  const [currentIdx, setCurrentIdx] = useState(0)

  function getCardState(nodeIdx: number): CardState {
    const node = level.nodes[nodeIdx]
    const cap = node.capacity ?? 1
    const placed = placements.get(nodeIdx) ?? []

    if (!dragState || dragState.hoverNodeIdx !== nodeIdx) return 'normal'
    if (placed.length >= cap) return 'rejecting'
    return validate(dragState.elementId, nodeIdx, placements, level)
      ? 'accepting'
      : 'rejecting'
  }

  const items = level.nodes.map((node, i) => ({ node, nodeIdx: i }))
  const safeIdx = Math.min(currentIdx, items.length - 1)

  if (isMobile) {
    const { node, nodeIdx } = items[safeIdx]
    const placedIds = placements.get(nodeIdx) ?? []
    const placedElements = placedIds
      .map(id => level.elements.find(e => e.id === id))
      .filter((e): e is NonNullable<typeof e> => e !== undefined)

    return (
      <div style={{ flex: 1, minHeight: 0, position: 'relative', padding: '20px 48px 12px' }}>
        <PlotCard
          node={node}
          nodeIdx={nodeIdx}
          placedElements={placedElements}
          cardState={getCardState(nodeIdx)}
          isGlowing={glowingCards.has(nodeIdx)}
          isFlashing={flashingCards.has(nodeIdx)}
          isMobile={true}
          isFlipped={flippedCardIdx === nodeIdx}
          level={level}
          placements={placements}
          onDetach={onDetach}
          onSlotDragStart={onSlotDragStart}
          onNodeSelect={onNodeSelect}
          onFlip={() => onCardFlip(nodeIdx)}
        />

        {safeIdx > 0 && (
          <button
            onClick={() => setCurrentIdx(i => i - 1)}
            style={{
              position: 'fixed', top: '50%', left: 8,
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: 36, height: 48,
              fontFamily: '"Bangers", cursive', fontSize: 22,
              background: PAPER, color: INK,
              border: `2px solid ${INK}`,
              boxShadow: `2px 2px 0 ${INK}`,
              cursor: 'pointer', padding: 0, lineHeight: 1,
            }}
          >←</button>
        )}

        {safeIdx < items.length - 1 && (
          <button
            onClick={() => setCurrentIdx(i => i + 1)}
            style={{
              position: 'fixed', top: '50%', right: 8,
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: 36, height: 48,
              fontFamily: '"Bangers", cursive', fontSize: 22,
              background: PAPER, color: INK,
              border: `2px solid ${INK}`,
              boxShadow: `2px 2px 0 ${INK}`,
              cursor: 'pointer', padding: 0, lineHeight: 1,
            }}
          >→</button>
        )}
      </div>
    )
  }

  return (
    <div
      className="node-scroll"
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px 36px 20px 20px',
      }}
    >
      <div style={{
        position: 'relative',
        paddingLeft: 36,
        maxWidth: 620,
      }}>
        <TimelineSpine height={items.length * 130} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {items.map(({ node, nodeIdx }) => {
            const placedIds = placements.get(nodeIdx) ?? []
            const placedElements = placedIds
              .map(id => level.elements.find(e => e.id === id))
              .filter((e): e is NonNullable<typeof e> => e !== undefined)

            return (
              <PlotCard
                key={node.id}
                node={node}
                nodeIdx={nodeIdx}
                placedElements={placedElements}
                cardState={getCardState(nodeIdx)}
                isGlowing={glowingCards.has(nodeIdx)}
                isFlashing={flashingCards.has(nodeIdx)}
                isMobile={false}
                isFlipped={false}
                level={level}
                placements={placements}
                onDetach={onDetach}
                onSlotDragStart={onSlotDragStart}
                onNodeSelect={onNodeSelect}
                onFlip={() => {}}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
