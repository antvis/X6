import { Point, Line, Rectangle, Polyline } from '@antv/x6-geometry'
import { Dom } from '@antv/x6-common'

const svgDocument = Dom.createSvgElement('svg') as SVGSVGElement
/**
 * Transforms point by an SVG transformation represented by `matrix`.
 */
export function transformPoint(point: Point.PointLike, matrix: DOMMatrix) {
  const ret = Dom.createSVGPoint(point.x, point.y).matrixTransform(matrix)
  return new Point(ret.x, ret.y)
}

/**
 * Transforms line by an SVG transformation represented by `matrix`.
 */
export function transformLine(line: Line, matrix: DOMMatrix) {
  return new Line(
    transformPoint(line.start, matrix),
    transformPoint(line.end, matrix),
  )
}

/**
 * Transforms polyline by an SVG transformation represented by `matrix`.
 */
export function transformPolyline(polyline: Polyline, matrix: DOMMatrix) {
  let points = polyline instanceof Polyline ? polyline.points : polyline
  if (!Array.isArray(points)) {
    points = []
  }

  return new Polyline(points.map((p) => transformPoint(p, matrix)))
}

export function transformRectangle(
  rect: Rectangle.RectangleLike,
  matrix: DOMMatrix,
) {
  const p = svgDocument.createSVGPoint()

  p.x = rect.x
  p.y = rect.y
  const corner1 = p.matrixTransform(matrix)

  p.x = rect.x + rect.width
  p.y = rect.y
  const corner2 = p.matrixTransform(matrix)

  p.x = rect.x + rect.width
  p.y = rect.y + rect.height
  const corner3 = p.matrixTransform(matrix)

  p.x = rect.x
  p.y = rect.y + rect.height
  const corner4 = p.matrixTransform(matrix)

  const minX = Math.min(corner1.x, corner2.x, corner3.x, corner4.x)
  const maxX = Math.max(corner1.x, corner2.x, corner3.x, corner4.x)
  const minY = Math.min(corner1.y, corner2.y, corner3.y, corner4.y)
  const maxY = Math.max(corner1.y, corner2.y, corner3.y, corner4.y)

  return new Rectangle(minX, minY, maxX - minX, maxY - minY)
}
