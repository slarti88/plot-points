export interface Attribute {
  name: string
  icon: string
}

export interface LevelNode {
  id: string
  label: string
  body: string
  t: number[]
  allowedElements: string[]
  capacity?: number
  mustShareWith?: string[]
  mustNotShareWith?: string[]
  emptyImage?: string
  filledImages?: Record<string, string>
  attribute?: string[]
}

export interface LevelElement {
  id: string
  label: string
  icon: string
  color: string
  trait: string
  bio: string
  cooldown: number
  attribute?: string
}

export interface Level {
  id: string
  title: string
  nodes: LevelNode[]
  elements: LevelElement[]
  attributes?: Record<string, Attribute>
}

export interface LevelInfo {
  id: string
  title: string
}

export interface DragState {
  elementId: string
  originNodeIdx: number | null
  x: number
  y: number
  hoverNodeIdx: number | null
}
