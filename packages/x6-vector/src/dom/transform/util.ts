import { Global } from '../../global'
import type { Matrix } from '../../struct/matrix'
import type { Vector } from '../../vector/vector/vector'
import type { Transform } from './transform'

export function getTransformOrigin(
  o: Matrix.TransformOptions,
  t: Transform<Element>,
): [number, number] {
  // First check if origin is in ox or originX
  let ox = o.ox != null ? o.ox : o.originX != null ? o.originX : 'center'
  let oy = o.oy != null ? o.oy : o.originY != null ? o.originY : 'center'

  // Then check if origin was used and overwrite in that case
  const { origin } = o
  if (origin != null) {
    ;[ox, oy] = Array.isArray(origin)
      ? origin
      : typeof origin === 'object'
      ? [origin.x, origin.y]
      : [origin, origin]
  }

  // Make sure to only call bbox when actually needed
  if (typeof ox === 'string' || typeof oy === 'string') {
    const node = t.node
    const { height, width, x, y } =
      node instanceof Global.window.SVGElement
        ? ((t as any) as Vector).bbox()
        : (node as HTMLElement).getBoundingClientRect()

    // And only overwrite if string was passed for this specific axis
    if (typeof ox === 'string') {
      ox = ox.includes('left')
        ? x
        : ox.includes('right')
        ? x + width
        : x + width / 2
    }

    if (typeof oy === 'string') {
      oy = oy.includes('top')
        ? y
        : oy.includes('bottom')
        ? y + height
        : y + height / 2
    }
  }

  return [ox, oy]
}
