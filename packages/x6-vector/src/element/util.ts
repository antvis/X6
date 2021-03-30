import type { Box } from '../struct/box'
import type { VectorElement } from './element'
import { UNumber } from '../struct/unumber'

export namespace Util {
  export function proportionalSize(
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
        w = (bbox.width / bbox.height) * UNumber.toNumber(h!)
      } else if (h == null) {
        h = (bbox.height / bbox.width) * UNumber.toNumber(w)
      }

      return { width: w, height: h! }
    }

    return {
      width,
      height,
    }
  }
}
