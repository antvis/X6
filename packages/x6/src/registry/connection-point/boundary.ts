import { ObjectExt, Dom } from '../../util'
import { Path, Rectangle, Ellipse, Segment } from '../../geometry'
import { offset, getStrokeWidth, findShapeNode } from './util'
import { ConnectionPoint } from './index'

export interface BoundaryOptions extends ConnectionPoint.StrokedOptions {
  selector?: string | string[]
  insideout?: boolean
  precision?: number
  extrapolate?: boolean
  sticky?: boolean
}

export interface BoundaryCache {
  shapeBBox?: Rectangle | null
  segmentSubdivisions?: Segment[][]
}

/**
 * Places the connection point at the intersection between the
 * edge path end segment and the actual shape of the target magnet.
 */
export const boundary: ConnectionPoint.Definition<BoundaryOptions> = function (
  line,
  view,
  magnet,
  options,
) {
  let node
  let intersection
  const anchor = line.end
  const selector = options.selector

  if (typeof selector === 'string') {
    node = view.findOne(selector)
  } else if (Array.isArray(selector)) {
    node = ObjectExt.getByPath(magnet, selector)
  } else {
    node = findShapeNode(magnet)
  }

  if (!Dom.isSVGGraphicsElement(node)) {
    if (node === magnet || !Dom.isSVGGraphicsElement(magnet)) {
      return anchor
    }
    node = magnet
  }

  const localShape = view.getShapeOfElement(node)
  const magnetMatrix = view.getMatrixOfElement(node)
  const translateMatrix = view.getRootTranslatedMatrix()
  const rotateMatrix = view.getRootRotatedMatrix()
  const targetMatrix = translateMatrix
    .multiply(rotateMatrix)
    .multiply(magnetMatrix)
  const localMatrix = targetMatrix.inverse()
  const localLine = Dom.transformLine(line, localMatrix)
  const localRef = localLine.start.clone()
  const data = view.getDataOfElement(node) as BoundaryCache

  if (options.insideout === false) {
    if (data.shapeBBox == null) {
      data.shapeBBox = localShape.bbox()
    }
    const localBBox = data.shapeBBox
    if (localBBox != null && localBBox.containsPoint(localRef)) {
      return anchor
    }
  }

  if (options.extrapolate === true) {
    localLine.setLength(1e6)
  }

  // Caching segment subdivisions for paths
  let pathOptions
  if (Path.isPath(localShape)) {
    const precision = options.precision || 2
    if (data.segmentSubdivisions == null) {
      data.segmentSubdivisions = localShape.getSegmentSubdivisions({
        precision,
      })
    }
    pathOptions = {
      precision,
      segmentSubdivisions: data.segmentSubdivisions,
    }

    intersection = localLine.intersect(localShape, pathOptions)
  } else {
    intersection = localLine.intersect(localShape)
  }

  if (intersection) {
    if (Array.isArray(intersection)) {
      intersection = localRef.closest(intersection)
    }
  } else if (options.sticky === true) {
    // No intersection, find the closest point instead
    if (Rectangle.isRectangle(localShape)) {
      intersection = localShape.getNearestPointToPoint(localRef)
    } else if (Ellipse.isEllipse(localShape)) {
      intersection = localShape.intersectsWithLineFromCenterToPoint(localRef)
    } else {
      intersection = localShape.closestPoint(localRef, pathOptions)
    }
  }

  const cp = intersection
    ? Dom.transformPoint(intersection, targetMatrix)
    : anchor
  let cpOffset = options.offset || 0
  if (options.stroked !== false) {
    if (typeof cpOffset === 'object') {
      cpOffset = { ...cpOffset }
      if (cpOffset.x == null) {
        cpOffset.x = 0
      }
      cpOffset.x += getStrokeWidth(node) / 2
    } else {
      cpOffset += getStrokeWidth(node) / 2
    }
  }

  return offset(cp, line.start, cpOffset)
}
