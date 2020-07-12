import { NumberExt } from '../../util'
import { PaddingOptions } from './util'
import { Router } from './index'

export interface OneSideRouterOptions extends PaddingOptions {
  side?: 'left' | 'top' | 'right' | 'bottom'
}

/**
 * Routes the edge always to/from a certain side
 */
export const oneSide: Router.Definition<OneSideRouterOptions> = function (
  vertices,
  options,
  edgeView,
) {
  const side = options.side || 'bottom'
  const padding = NumberExt.normalizeSides(options.padding || 40)
  const sourceBBox = edgeView.sourceBBox
  const targetBBox = edgeView.targetBBox
  const sourcePoint = sourceBBox.getCenter()
  const targetPoint = targetBBox.getCenter()

  let coord: 'x' | 'y'
  let dim: 'width' | 'height'
  let factor

  switch (side) {
    case 'top':
      factor = -1
      coord = 'y'
      dim = 'height'
      break
    case 'left':
      factor = -1
      coord = 'x'
      dim = 'width'
      break
    case 'right':
      factor = 1
      coord = 'x'
      dim = 'width'
      break
    case 'bottom':
    default:
      factor = 1
      coord = 'y'
      dim = 'height'
      break
  }

  // Move the points from the center of the element to outside of it.
  sourcePoint[coord] += factor * (sourceBBox[dim] / 2 + padding[side])
  targetPoint[coord] += factor * (targetBBox[dim] / 2 + padding[side])

  // Make edge orthogonal (at least the first and last vertex).
  if (factor * (sourcePoint[coord] - targetPoint[coord]) > 0) {
    targetPoint[coord] = sourcePoint[coord]
  } else {
    sourcePoint[coord] = targetPoint[coord]
  }

  return [sourcePoint.toJSON(), ...vertices, targetPoint.toJSON()]
}
