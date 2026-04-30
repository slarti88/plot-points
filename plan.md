# Plotpoints — Puzzle Game Plan

## Game Mechanics Summary

- **Nodes**: A sequence of nodes displayed bottom-to-top. Each node has a `t` (cooldown) value and a list of allowed element IDs.
- **Elements**: Draggable tokens the player attaches to nodes.
- **Cooldown Rule**: When element E is placed on node at index `i` (with cooldown `t`), element E cannot be placed on any node at indices `i+1` through `i+t` (inclusive). It becomes available again at index `i+t+1`.
- **Win Condition**: Every node has a valid element attached when the player hits Finish.

---

## Tech Stack

| Concern | Choice |
|---|---|
| Game engine | Phaser 3 (CDN) |
| Level data | `level.json` (loaded at runtime) |
| Entry point | `index.html` (single page, no build step) |

---

## File Structure

```
plotpoints/
├── index.html          # entry point, loads Phaser + game
├── game.js             # Phaser scene, all game logic
└── level.json          # level definition
```

---

## Level JSON Schema

```json
{
  "id": "level-1",
  "nodes": [
    {
      "id": "n0",
      "label": "Node 1",
      "t": 2,
      "allowedElements": ["e0", "e1"]
    }
  ],
  "elements": [
    { "id": "e0", "label": "A" },
    { "id": "e1", "label": "B" }
  ]
}
```

- `nodes` are ordered; index 0 = bottom of screen.
- `t` on a node = cooldown applied when this node is used (how many subsequent nodes the element is locked out of).
- `allowedElements` = list of element IDs valid for this node.

---

## Layout

```
+-----------------------------+----------+
|                             |          |
|                             | [Elem A] |
|         NODE 5   ←top       | [Elem B] |
|         NODE 4              | [Elem C] |
|         NODE 3              |          |
|         NODE 2              | ELEMENTS |
|         NODE 1   ←bottom    | PANEL    |
|                             | (fixed)  |
|         [scrollable]        |          |
+-----------------------------+----------+
|         [ FINISH ]                     |
+----------------------------------------+
```

- **Left/center column**: nodes in a vertically scrollable container.
- **Right panel**: element tokens, fixed position, always visible.
- **Finish button**: fixed at bottom, disabled when level is not completable.

---

## Drag & Drop Interaction

1. Player drags an element token from the right panel onto a node.
2. On drop:
   - **Invalid element type**: node flashes red, element snaps back.
   - **Cooldown violation**: node flashes red with a "locked" indicator, element snaps back.
   - **Valid**: element attaches to node visually (token displayed inside node card). Original slot in panel dims (element still shown but greyed).
3. Player can drag an already-attached element off a node to reattach it elsewhere (undoes previous placement, releasing cooldown).

---

## Finish Button Logic

Finish is **enabled** only when:
- Every node has an element attached, AND
- No node has an invalid attachment (cooldown or wrong type).

Otherwise the button is visually disabled (grey, non-clickable).

On successful finish: display a "Level Complete!" overlay.

---

## Cooldown Tracking

- Maintain a map: `elementCooldowns: { [elementId]: nextAvailableIndex }`.
- When element `e` is placed on node at index `i` with cooldown `t`: set `nextAvailableIndex[e] = i + t + 1`.
- When element `e` is removed from node at index `i`: recalculate `nextAvailableIndex[e]` from remaining placements.
- A placement is **valid** if `i >= nextAvailableIndex[e]` (considering all other placements of `e`).

---

## Phaser Scene Structure

**Single scene: `GameScene`**

- `preload()`: load `level.json`
- `create()`:
  - Parse level, build node cards in a scrollable zone
  - Build element panel (fixed, above scroll area)
  - Set up drag events
  - Create finish button
- `update()`: validate state each frame, enable/disable finish button

**Key Phaser features used:**
- `Phaser.GameObjects.Container` for node cards and element tokens
- `Phaser.Input.Events` drag/drop events
- Camera or masked zone for scrollable nodes
- `setInteractive({ draggable: true })` on element tokens

---

## Clarification Questions

Before implementation, please confirm:

1. **Cooldown direction**: When element E is placed on node at index `i` (cooldown `t`), does E become unavailable for the `t` nodes *above* it in the sequence (higher indices)? My assumption: yes — unavailable at indices `i+1` to `i+t`.

2. **Re-placement**: Can a player pick up an already-placed element and move it to a different node? I'm assuming yes — this would recalculate cooldowns.

3. **Element copies**: If the level defines 3 instances of the same element ID, are they treated as 3 independent tokens? Or is "element" always a unique ID with one instance?

4. **One element per node**: A node can only have one element attached at a time, correct?

5. **Finish button placement**: Should the Finish button be at the bottom of the screen (fixed), or somewhere else?
