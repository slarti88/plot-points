import { useEffect, useState } from 'react'
import type { Level } from '../types'
import { useGameState } from '../hooks/useGameState'
import { useIsMobile } from '../hooks/useIsMobile'
import NodeList from './NodeList'
import CastSidebar from './CastSidebar'
import PointDetailPane from './PointDetailPane'
import WinOverlay from './WinOverlay'
import DragGhost from './DragGhost'
import { halftone } from '../utils/halftone'

interface Props {
  level: Level
  onSelectLevel: () => void
}

export default function GameScreen({ level, onSelectLevel }: Props) {
  const {
    placements, dragState, flashingCards, glowingCards, won,
    startDrag, updateDrag, endDrag, detach, restart,
  } = useGameState(level)

  const isMobile = useIsMobile()

  useEffect(() => {
    if (!dragState) return
    const onMove = (e: MouseEvent) => updateDrag(e.clientX, e.clientY)
    const onUp   = (e: MouseEvent) => endDrag(e.clientX, e.clientY)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup',   onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup',   onUp)
    }
  }, [dragState, updateDrag, endDrag])

  useEffect(() => {
    if (!dragState) return
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      updateDrag(touch.clientX, touch.clientY)
    }
    const onTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0]
      endDrag(touch.clientX, touch.clientY)
    }
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd)
    return () => {
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [dragState, updateDrag, endDrag])

  const handleSlotDragStart = (elementId: string, nodeIdx: number, x: number, y: number) => {
    detach(nodeIdx, elementId)
    startDrag(elementId, nodeIdx, x, y)
  }

  const [selectedNodeIdx, setSelectedNodeIdx] = useState<number>(0)
  const [flippedCardIdx, setFlippedCardIdx] = useState<number | null>(null)

  const handleCardFlip = (nodeIdx: number) => {
    setFlippedCardIdx(prev => prev === nodeIdx ? null : nodeIdx)
  }

  const solvedCount = level.nodes.filter((node, i) => {
    const cap = node.capacity ?? 1
    return (placements.get(i)?.length ?? 0) >= cap
  }).length

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh',
      background: 'var(--paper)',
      userSelect: 'none',
    }}>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px',
        background: 'var(--paper)',
        backgroundImage: halftone('var(--ink)', 0.05, 6),
        borderBottom: '2px solid var(--ink)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={onSelectLevel}
            style={{
              fontFamily: '"Bangers", cursive', fontSize: 14, letterSpacing: '0.06em',
              border: '2px solid var(--ink)', background: 'var(--paper)',
              padding: '4px 10px', cursor: 'pointer',
              boxShadow: '2px 2px 0 var(--ink)',
              color: 'var(--ink)',
              lineHeight: 1, flexShrink: 0,
            }}
          >
            ←
          </button>
          <div>
            <div style={{ fontFamily: '"Bangers", cursive', fontSize: 18, letterSpacing: '0.06em', lineHeight: 1, color: 'var(--ink)' }}>
              {level.title}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={restart}
            style={{
              fontFamily: '"Bangers", cursive', fontSize: 20, letterSpacing: '0.06em',
              border: '2px solid var(--ink)', background: 'var(--paper)',
              padding: '6px 10px', cursor: 'pointer',
              boxShadow: '2px 2px 0 var(--ink)',
              color: 'var(--ink)',
              lineHeight: 1,
            }}
          >
            ↺
          </button>
        </div>
      </header>

      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, position: 'relative' }}>
          <NodeList
            level={level}
            placements={placements}
            flashingCards={flashingCards}
            glowingCards={glowingCards}
            dragState={dragState}
            isMobile={true}
            flippedCardIdx={flippedCardIdx}
            onDetach={detach}
            onSlotDragStart={handleSlotDragStart}
            onNodeSelect={setSelectedNodeIdx}
            onCardFlip={handleCardFlip}
          />
          <CastSidebar
            level={level}
            isMobile={true}
            onDragStart={(id, x, y) => startDrag(id, null, x, y)}
          />
          {won && (
            <WinOverlay
              solvedCount={solvedCount}
              totalCount={level.nodes.length}
              onRestart={restart}
              onSelectLevel={onSelectLevel}
            />
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flex: 1, minHeight: 0, position: 'relative' }}>
          <CastSidebar
            level={level}
            isMobile={false}
            onDragStart={(id, x, y) => startDrag(id, null, x, y)}
          />

          <main style={{ display: 'flex', flex: 1, minWidth: 0, minHeight: 0 }}>
            <NodeList
              level={level}
              placements={placements}
              flashingCards={flashingCards}
              glowingCards={glowingCards}
              dragState={dragState}
              isMobile={false}
              flippedCardIdx={null}
              onDetach={detach}
              onSlotDragStart={handleSlotDragStart}
              onNodeSelect={setSelectedNodeIdx}
              onCardFlip={() => {}}
            />
          </main>

          <PointDetailPane level={level} focusedNodeIdx={selectedNodeIdx} placements={placements} />

          {won && (
            <WinOverlay
              solvedCount={solvedCount}
              totalCount={level.nodes.length}
              onRestart={restart}
              onSelectLevel={onSelectLevel}
            />
          )}
        </div>
      )}

      {dragState && <DragGhost dragState={dragState} level={level} />}
    </div>
  )
}
