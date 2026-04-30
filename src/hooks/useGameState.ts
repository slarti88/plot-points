import { useCallback, useEffect, useRef, useState } from 'react'
import type { DragState, Level } from '../types'
import { validate } from '../utils/validate'

export function useGameState(level: Level) {
  const [placements, setPlacements]       = useState<Map<number, string[]>>(new Map())
  const [dragState, setDragState]         = useState<DragState | null>(null)
  const [flashingCards, setFlashingCards] = useState<Set<number>>(new Set())
  const [glowingCards, setGlowingCards]   = useState<Set<number>>(new Set())
  const [won, setWon]                     = useState(false)

  const placementsRef = useRef(placements)
  placementsRef.current = placements

  // Auto-win when every node is at capacity
  useEffect(() => {
    const allFull = level.nodes.every((node, i) => {
      const cap = node.capacity ?? 1
      return (placements.get(i)?.length ?? 0) >= cap
    })
    if (allFull) {
      const t = setTimeout(() => setWon(true), 800)
      return () => clearTimeout(t)
    }
  }, [placements, level.nodes])

  const glowCard = useCallback((nodeIdx: number) => {
    setGlowingCards(prev => new Set(prev).add(nodeIdx))
    setTimeout(() => {
      setGlowingCards(prev => { const n = new Set(prev); n.delete(nodeIdx); return n })
    }, 1300)
  }, [])

  const flashCard = useCallback((nodeIdx: number) => {
    setFlashingCards(prev => new Set(prev).add(nodeIdx))
    setTimeout(() => {
      setFlashingCards(prev => { const n = new Set(prev); n.delete(nodeIdx); return n })
    }, 400)
  }, [])

  const attach = useCallback((nodeIdx: number, elementId: string) => {
    setPlacements(prev => {
      const next = new Map(prev)
      const existing = next.get(nodeIdx) ?? []
      if (existing.includes(elementId))return next;
      next.set(nodeIdx, [...existing, elementId])
      return next
    })
    glowCard(nodeIdx)
  }, [glowCard])

  const detach = useCallback((nodeIdx: number, elementId: string) => {
    setPlacements(prev => {
      const next = new Map(prev)
      const existing = next.get(nodeIdx) ?? []
      const updated = existing.filter(id => id !== elementId)
      if (updated.length === 0) next.delete(nodeIdx)
      else next.set(nodeIdx, updated)
      return next
    })
  }, [])

  const resolveHoverNodeIdx = (x: number, y: number): number | null => {
    const el = document.elementFromPoint(x, y)
    const cardEl = el?.closest<HTMLElement>('[data-node-idx]')
    const raw = cardEl?.dataset.nodeIdx
    return raw !== undefined ? parseInt(raw, 10) : null
  }

  const startDrag = useCallback((elementId: string, originNodeIdx: number | null, x: number, y: number) => {
    setDragState({ elementId, originNodeIdx, x, y, hoverNodeIdx: null })
  }, [])

  const updateDrag = useCallback((x: number, y: number) => {
    setDragState(prev => {
      if (!prev) return null
      const hoverNodeIdx = resolveHoverNodeIdx(x, y)
      return { ...prev, x, y, hoverNodeIdx }
    })
  }, [])

  const endDrag = useCallback((x: number, y: number) => {
    setDragState(prev => {
      if (!prev) return null
      const { elementId, originNodeIdx } = prev
      const targetIdx = resolveHoverNodeIdx(x, y)
      const currentPlacements = placementsRef.current
      if (targetIdx === null) {
        if (originNodeIdx !== null) attach(originNodeIdx, elementId)
      } else if (originNodeIdx !== null && targetIdx === originNodeIdx) {
        attach(originNodeIdx, elementId)
      } else {
        const ok = validate(elementId, targetIdx, currentPlacements, level.nodes, level.elements)
        if (ok) {
          attach(targetIdx, elementId)
        } else {
          flashCard(targetIdx)
          if (originNodeIdx !== null) attach(originNodeIdx, elementId)
        }
      }
      return null
    })
  }, [level.nodes, attach, flashCard])

  const restart = useCallback(() => {
    setPlacements(new Map())
    setDragState(null)
    setFlashingCards(new Set())
    setGlowingCards(new Set())
    setWon(false)
  }, [])

  return {
    placements,
    dragState,
    flashingCards,
    glowingCards,
    won,
    startDrag,
    updateDrag,
    endDrag,
    detach,
    restart,
  }
}
