import { v } from '../../v'
import { ObjectExt } from '../../util'
import { Path, Rectangle, Ellipse, Segment } from '../../geometry'
import { offset, getStrokeWidth, findShapeNode } from './util'
import { ConnectionPoint } from './index'

export interface BoundaryIntersectionOptions
  extends ConnectionPoint.StrokedOptions {
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
 * link path end segment and the actual shape of the end element.
 */
export const boundary: ConnectionPoint.Definition<BoundaryIntersectionOptions> = function(
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

  if (!v.isSVGGraphicsElement(node)) {
    if (node === magnet || !v.isSVGGraphicsElement(magnet)) {
      return anchor
    }
    node = magnet
  }

  const localShape = view.getNodeShape(node)
  const magnetMatrix = view.getNodeMatrix(node)
  const translateMatrix = view.getRootTranslateMatrix()
  const rotateMatrix = view.getRootRotateMatrix()
  const targetMatrix = translateMatrix
    .multiply(rotateMatrix)
    .multiply(magnetMatrix)
  const localMatrix = targetMatrix.inverse()
  const localLine = v.transformLine(line, localMatrix)
  const localRef = localLine.start.clone()
  const data = view.getNodeData(node) as BoundaryCache

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
  if (localShape instanceof Path) {
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

    localLine.intersect(localShape, pathOptions)
  } else {
    intersection = localLine.intersect(localShape)
  }

  if (intersection) {
    // More than one intersection
    if (Array.isArray(intersection)) {
      intersection = localRef.closest(intersection)
    }
  } else if (options.sticky === true) {
    // No intersection, find the closest point instead
    if (localShape instanceof Rectangle) {
      intersection = localShape.pointNearestToPoint(localRef)
    } else if (localShape instanceof Ellipse) {
      intersection = localShape.intersectionWithLineFromCenterToPoint(localRef)
    } else {
      intersection = localShape.closestPoint(localRef, pathOptions)
    }
  }

  const cp = intersection
    ? v.transformPoint(intersection, targetMatrix)
    : anchor
  let cpOffset = options.offset || 0
  if (options.stroked) cpOffset += getStrokeWidth(node) / 2

  return offset(cp, line.start, cpOffset)
}
