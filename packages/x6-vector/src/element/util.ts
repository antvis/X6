import type { Box } from '../struct/box'
import type { VectorElement } from './element'
import { UnitNumber } from '../struct/unit-number'
import { Color } from '../struct/color'
import { Vector } from './vector'

export namespace Util {
  export function normalizeSize(
    element: VectorElement,
    width?: string | number | null,
    height?: string | number | null,
    box?: Box,
  ) {
    if (width == null || height == null) {
      const bbox = box || element.bbox()

      let w = width
      let h = height
      if (w == null) {
        w = (bbox.width / bbox.height) * UnitNumber.toNumber(h!)
      } else if (h == null) {
        h = (bbox.height / bbox.width) * UnitNumber.toNumber(w)
      }

      return { width: w, height: h! }
    }

    return {
      width,
      height,
    }
  }
}

export namespace Util {
  const map = {
    fill: ['color', 'opacity', 'rule'],
    stroke: [
      'color',
      'width',
      'opacity',
      'linecap',
      'linejoin',
      'miterlimit',
      'dasharray',
      'dashoffset',
    ],
  }

  const prefix = (t: string, a: string) => (a === 'color' ? t : `${t}-${a}`)

  export function fillOrStroke<T extends SVGElement>(
    elem: Vector<T>,
    type: 'fill' | 'stroke',
    value:
      | string
      | Color
      | Color.RGBALike
      | Vector<T>
      | Record<string, string | number>
      | null,
  ) {
    if (value === null) {
      elem.attr(type, null)
    } else if (typeof value === 'string' || value instanceof Vector) {
      elem.attr(type, value.toString())
    } else if (value instanceof Color || Color.isRgbLike(value)) {
      const color = new Color(value)
      elem.attr(type, color.toString())
    } else {
      const names = map[type]
      for (let i = names.length - 1; i >= 0; i -= 1) {
        const k = names[i]
        const v = value[k]
        if (v != null) {
          elem.attr(prefix(type, k), v)
        }
      }
    }
  }
}
