import type { LevelElement } from '../types'

export type BodySegment =
  | { type: 'text';  value: string }
  | { type: 'name';  label: string; color: string }
  | { type: 'empty' }

export function parseBody(body: string, placedElements: LevelElement[]): BodySegment[] {
  return body.split(/(<\d+>)/).flatMap(part => {
    const match = part.match(/^<(\d+)>$/)
    if (!match) {
        return part ? [{ type: 'text', value: part }] : []
    }
    const elem = placedElements[parseInt(match[1], 10) - 1]
    const retValue: BodySegment[] = [elem ? { type: 'name', label: elem.label, color: elem.color } : { type: 'empty' }];
    return retValue;
  })
}
