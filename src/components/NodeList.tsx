import type { Level, DragState } from '../types'
import { validate } from '../utils/validate'
import PlotCard, { type CardState } from './PlotCard'
import TimelineSpine from './TimelineSpine'

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
  function getCardState(nodeIdx: number): CardState {
    const node = level.nodes[nodeIdx]
    const cap = node.capacity ?? 1
    const placed = placements.get(nodeIdx) ?? []

    if (!dragState || dragState.hoverNodeIdx !== nodeIdx) return 'normal'
    if (placed.length >= cap) return 'rejecting'
    return validate(dragState.elementId, nodeIdx, placements, level.nodes, level.elements)
      ? 'accepting'
      : 'rejecting'
  }

  const items = level.nodes.map((node, i) => ({ node, nodeIdx: i }))

  return (
    <div
      className="node-scroll"
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: isMobile ? '20px 12px 12px' : '20px 36px 20px 20px',
      }}
    >
      <div style={{
        position: 'relative',
        paddingLeft: isMobile ? 0 : 36,
        maxWidth: isMobile ? '100%' : 620,
      }}>
        {!isMobile && <TimelineSpine height={items.length * 130} />}

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
                isMobile={isMobile}
                isFlipped={flippedCardIdx === nodeIdx}
                level={level}
                placements={placements}
                onDetach={onDetach}
                onSlotDragStart={onSlotDragStart}
                onNodeSelect={onNodeSelect}
                onFlip={() => onCardFlip(nodeIdx)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
