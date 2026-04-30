import type { LevelElement, LevelNode } from '../types'

export function validate(
  elementId: string,
  targetIdx: number,
  placements: Map<number, string[]>,
  nodes: LevelNode[],
  elements: LevelElement[]
): boolean {
  const node = nodes[targetIdx]
  const existing = placements.get(targetIdx) ?? []
  const cap = node.capacity ?? 1

  if (!node.allowedElements.includes(elementId)) return false
  if (existing.length >= cap) return false
  if (existing.includes(elementId)) return false

  // Cooldown: find all nodes where this element is already placed
  const placed: number[] = []
  for (const [ni, eids] of placements.entries()) {
    if (eids.includes(elementId)) placed.push(ni)
  }

  const all = [...placed, targetIdx].sort((a, b) => a - b)
  for (let k = 0; k < all.length - 1; k++) {
    const curr = all[k]
    const next = all[k + 1]
    const slot = curr === targetIdx
      ? existing.length
      : (placements.get(curr) ?? []).indexOf(elementId)
    const cooldown = nodes[curr].t[slot] ?? 0
    if (next <= curr + cooldown) return false
  }

  // Per-slot constraint: element at this slot must come from the specified source node
  if (node.mustShareWith) {
    const slot = existing.length
    const requiredNodeId = node.mustShareWith[slot]
    if (requiredNodeId !== undefined) {
      const refIdx = nodes.findIndex(n => n.id === requiredNodeId)
      if (refIdx !== -1 && !(placements.get(refIdx) ?? []).includes(elementId)) return false
    }
  }

  if (node.mustNotShareWith) {
    const slot = existing.length
    if (slot < node.mustNotShareWith.length) {
      const forbiddenNodeId = node.mustNotShareWith[slot]
      if (forbiddenNodeId !== '') {
        const forbidIdx = nodes.findIndex(n => n.id === forbiddenNodeId)
        if (forbidIdx !== -1 && (placements.get(forbidIdx) ?? []).includes(elementId)) return false
      }
    }
  }

  return true
}
