import { Point } from '../../geometry'

/**
 * Routes the link always to/from a certain side
 */
export function oneSide(vertices: Point[], options: Options, linkView) {
  const side = options.side || 'bottom'
  const pd = options.padding || 40
  const padding = { left: pd, top: pd, right: pd, bottom: pd }
  const sourceBBox = linkView.sourceBBox
  const targetBBox = linkView.targetBBox
  const sourcePoint = sourceBBox.center()
  const targetPoint = targetBBox.center()

  let coordinate
  let dimension
  let direction

  switch (side) {
    case 'top':
      direction = -1
      coordinate = 'y'
      dimension = 'height'
      break
    case 'left':
      direction = -1
      coordinate = 'x'
      dimension = 'width'
      break
    case 'right':
      direction = 1
      coordinate = 'x'
      dimension = 'width'
      break
    case 'bottom':
    default:
      direction = 1
      coordinate = 'y'
      dimension = 'height'
      break
  }

  // move the points from the center of the element to outside of it.
  sourcePoint[coordinate] +=
    direction * (sourceBBox[dimension] / 2 + padding[side])
  targetPoint[coordinate] +=
    direction * (targetBBox[dimension] / 2 + padding[side])

  // make link orthogonal (at least the first and last vertex).
  if (direction * (sourcePoint[coordinate] - targetPoint[coordinate]) > 0) {
    targetPoint[coordinate] = sourcePoint[coordinate]
  } else {
    sourcePoint[coordinate] = targetPoint[coordinate]
  }

  return [sourcePoint].concat(vertices, targetPoint)
}

export interface Options {
  side?: 'left' | 'top' | 'right' | 'bottom'
  padding?: number
}
