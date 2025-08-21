import { Path } from '../../geometry'

/**
 * Normalizes marker's path data by translate the center
 * of an arbitrary path at <0 + offset,0>.
 */
export function normalize(d: string, offset: { x?: number; y?: number }): string
export function normalize(d: string, offsetX?: number, offsetY?: number): string
export function normalize(
  d: string,
  offset1?: number | { x?: number; y?: number },
  offset2?: number,
) {
  let offsetX: number | undefined
  let offsetY: number | undefined
  if (typeof offset1 === 'object') {
    offsetX = offset1.x
    offsetY = offset1.y
  } else {
    offsetX = offset1
    offsetY = offset2
  }

  const path = Path.parse(d)
  const bbox = path.bbox()
  if (bbox) {
    let ty = -bbox.height / 2 - bbox.y
    let tx = -bbox.width / 2 - bbox.x
    if (typeof offsetX === 'number') {
      tx -= offsetX
    }
    if (typeof offsetY === 'number') {
      ty -= offsetY
    }

    path.translate(tx, ty)
  }

  return path.serialize()
}
