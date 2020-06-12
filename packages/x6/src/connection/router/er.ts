import { Router } from './index'

export interface ErRouterOptions {
  offset?: number
  direction?: 'T' | 'B' | 'L' | 'R' | 'H' | 'V'
}

export const er: Router.Definition<ErRouterOptions> = function (
  vertices,
  options,
  edgeView,
) {
  const offset = options.offset || 32
  let direction = options.direction

  const sourceBBox = edgeView.sourceBBox
  const targetBBox = edgeView.targetBBox
  const sourcePoint = sourceBBox.getCenter()
  const targetPoint = targetBBox.getCenter()

  if (direction == null) {
    const dx = sourcePoint.x - targetPoint.x
    const dy = sourcePoint.y - targetPoint.y

    if (Math.abs(dx) > Math.abs(dy)) {
      direction = dx > 0 ? 'R' : 'L'
    } else {
      direction = dy > 0 ? 'B' : 'T'
    }
  }

  let coord: 'x' | 'y'
  let dim: 'width' | 'height'
  let factor
  const horizontal = direction === 'L' || direction === 'R' || direction === 'H'

  if (horizontal) {
    if (targetPoint.y === sourcePoint.y) {
      return [...vertices]
    }

    factor =
      direction === 'L' || (direction === 'H' && targetPoint.x > sourcePoint.x)
        ? 1
        : -1
    coord = 'x'
    dim = 'width'
  } else {
    if (targetPoint.x === sourcePoint.x) {
      return [...vertices]
    }

    factor =
      direction === 'T' || (direction === 'V' && targetPoint.y > sourcePoint.y)
        ? 1
        : -1
    coord = 'y'
    dim = 'height'
  }

  const source = sourcePoint.clone()
  const target = targetPoint.clone()

  source[coord] += factor * (sourceBBox[dim] / 2 + offset)
  target[coord] -= factor * (targetBBox[dim] / 2 + offset)

  const min = 16
  if (horizontal) {
    const sourceX = source.x
    const targetX = target.x
    const sourceDelta = sourceBBox.width / 2 + min
    const targetDelta = targetBBox.width / 2 + min
    if (targetPoint.x > sourcePoint.x) {
      if (targetX <= sourceX) {
        source.x = Math.max(targetX, sourcePoint.x + sourceDelta)
        target.x = Math.min(sourceX, targetPoint.x - targetDelta)
      }
    } else {
      if (targetX >= sourceX) {
        source.x = Math.min(targetX, sourcePoint.x - sourceDelta)
        target.x = Math.max(sourceX, targetPoint.x + targetDelta)
      }
    }
  } else {
    const sourceY = source.y
    const targetY = target.y
    const sourceDelta = sourceBBox.height / 2 + min
    const targetDelta = targetBBox.height / 2 + min
    if (targetPoint.y > sourcePoint.y) {
      if (targetY <= sourceY) {
        source.y = Math.max(targetY, sourcePoint.y + sourceDelta)
        target.y = Math.min(sourceY, targetPoint.y - targetDelta)
      }
    } else {
      if (targetY >= sourceY) {
        source.y = Math.min(targetY, sourcePoint.y - sourceDelta)
        target.y = Math.max(sourceY, targetPoint.y + targetDelta)
      }
    }
  }

  return [source.toJSON(), ...vertices, target.toJSON()]
}
