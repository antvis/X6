import { Curve, Path } from '../../geometry'
import { Connector } from './index'

export const smooth: Connector.Definition = function (
  sourcePoint,
  targetPoint,
  routePoints,
  options = {},
) {
  let path

  if (routePoints && routePoints.length !== 0) {
    const points = [sourcePoint, ...routePoints, targetPoint]
    const curves = Curve.throughPoints(points)
    path = new Path(curves)
  } else {
    // If we have no route, use a default cubic bezier curve, cubic bezier
    // requires two control points, the control points have `x` midway
    // between source and target. This produces an S-like curve.

    path = new Path()
    path.appendSegment(Path.createSegment('M', sourcePoint))

    if (
      Math.abs(sourcePoint.x - targetPoint.x) >=
      Math.abs(sourcePoint.y - targetPoint.y)
    ) {
      const controlPointX = (sourcePoint.x + targetPoint.x) / 2
      path.appendSegment(
        Path.createSegment(
          'C',
          controlPointX,
          sourcePoint.y,
          controlPointX,
          targetPoint.y,
          targetPoint.x,
          targetPoint.y,
        ),
      )
    } else {
      const controlPointY = (sourcePoint.y + targetPoint.y) / 2
      path.appendSegment(
        Path.createSegment(
          'C',
          sourcePoint.x,
          controlPointY,
          targetPoint.x,
          controlPointY,
          targetPoint.x,
          targetPoint.y,
        ),
      )
    }
  }

  return options.raw ? path : path.serialize()
}
