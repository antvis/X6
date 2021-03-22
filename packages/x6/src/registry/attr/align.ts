import { NumberExt } from '../../util'
import { Point } from '../../geometry'
import { Attr } from './index'

// `x-align` when set to `middle` causes centering of the subelement around its new x coordinate.
// `x-align` when set to `right` uses the x coordinate as referenced to the right of the bbox.
export const xAlign: Attr.Definition = {
  offset: offsetWrapper('x', 'width', 'right'),
}

// `y-align` when set to `middle` causes centering of the subelement around its new y coordinate.
// `y-align` when set to `bottom` uses the y coordinate as referenced to the bottom of the bbox.
export const yAlign: Attr.Definition = {
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
    } else if (typeof value === 'number' && Number.isFinite(value)) {
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
