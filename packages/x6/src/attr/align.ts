import { NumberExt } from '../util'
import { Point } from '../geometry'
import { Attr } from '.'

// `x-alignment` when set to `middle` causes centering of the subelement around its new x coordinate.
// `x-alignment` when set to `right` uses the x coordinate as referenced to the right of the bbox.
export const xAlignment: Attr.Definition = {
  offset: offsetWrapper('x', 'width', 'right'),
}

// `y-alignment` when set to `middle` causes centering of the subelement around its new y coordinate.
// `y-alignment` when set to `bottom` uses the y coordinate as referenced to the bottom of the bbox.
export const yAlignment: Attr.Definition = {
  offset: offsetWrapper('y', 'height', 'bottom'),
}

export const resetOffset: Attr.Definition = {
  offset(val, { refBBox }) {
    return val ? { x: -refBBox.x, y: -refBBox.y } : { x: 0, y: 0 }
  },
}

function offsetWrapper(
  axis: 'x' | 'y',
  dimension: 'width' | 'height',
  corner: 'right' | 'bottom',
): Attr.OffsetFunction {
  return (value, { refBBox }) => {
    const point = new Point()
    let delta
    if (value === 'middle') {
      delta = refBBox[dimension] / 2
    } else if (value === corner) {
      delta = refBBox[dimension]
    } else if (typeof value === 'number' && isFinite(value)) {
      delta = value > -1 && value < 1 ? -refBBox[dimension] * value : -value
    } else if (NumberExt.isPercentage(value)) {
      delta = (refBBox[dimension] * parseFloat(value)) / 100
    } else {
      delta = 0
    }
    point[axis] = -(refBBox[axis] + delta)
    return point
  }
}
