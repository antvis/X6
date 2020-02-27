import { FunctionKeys } from 'utility-types'
import { v } from '../../v'
import { KeyValue } from '../../types'
import { ObjectExt } from '../../util'
import { Point, Line, Path, Rectangle, Ellipse, Segment } from '../../geometry'
import { NodeView } from './node-view'

export namespace ConnectionPoint {
  export type Definition<T> = (
    line: Line,
    view: NodeView,
    magnet: SVGElement,
    options: T,
  ) => Point

  interface BaseOptions {
    /**
     * Offset the connection point from the anchor by the specified
     * distance along the end link path segment.
     *
     * Default is `0`.
     */
    offset?: number
  }

  interface StrokedOptions extends BaseOptions {
    /**
     * If the stroke width should be included when calculating the
     * connection point.
     *
     * Default is `false`.
     */
    stroked?: boolean
  }

  export interface AnchorIntersectionOptions extends BaseOptions {}

  export interface BBoxIntersectionOptions extends StrokedOptions {}

  export interface RectangleIntersectionOptions extends StrokedOptions {}

  export interface BoundaryIntersectionOptions extends StrokedOptions {
    selector?: string | string[]
    insideout?: boolean
    precision?: number
    extrapolate?: boolean
    sticky?: boolean
  }
}

export namespace ConnectionPoint {
  /**
   * Places the connection point at the edge end's anchor point.
   */
  export const anchor: Definition<AnchorIntersectionOptions> = function(
    line,
    view,
    magnet,
    options,
  ) {
    return Private.offset(line.end, line.start, options.offset)
  }

  /**
   * Places the connection point at the intersection between the link
   * path end segment and the end element bbox.
   */
  export const bbox: Definition<BBoxIntersectionOptions> = function(
    line,
    view,
    magnet,
    options,
  ) {
    const bbox = view.getNodeBBox(magnet)
    if (options.stroked) {
      bbox.inflate(Private.getStrokeWidth(magnet) / 2)
    }
    const intersections = line.intersect(bbox)
    const p = intersections ? line.start.closest(intersections) : line.end
    return Private.offset(p, line.start, options.offset)
  }

  /**
   * Places the connection point at the intersection between the
   * link path end segment and the element's unrotated bbox.
   */
  export const rectangle: Definition<RectangleIntersectionOptions> = function(
    line,
    view,
    magnet,
    options,
  ) {
    const angle = view.cell.getRotation()
    if (angle === 0) {
      return bbox(line, view, magnet, options)
    }

    const bboxRaw = view.getNodeUnrotatedBBox(magnet)
    if (options.stroked) {
      bboxRaw.inflate(Private.getStrokeWidth(magnet) / 2)
    }
    const center = bboxRaw.getCenter()
    const lineRaw = line.clone().rotate(angle, center)
    const intersections = lineRaw.setLength(1e6).intersect(bboxRaw)
    const p = intersections
      ? lineRaw.start.closest(intersections).rotate(-angle, center)
      : line.end

    return Private.offset(p, line.start, options.offset)
  }

  interface BoundaryCache {
    shapeBBox?: Rectangle | null
    segmentSubdivisions?: Segment[][]
  }

  /**
   * Places the connection point at the intersection between the
   * link path end segment and the actual shape of the end element.
   */
  export const boundary: Definition<BoundaryIntersectionOptions> = function(
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
      node = Private.findShapeNode(magnet)
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
        intersection = localShape.intersectionWithLineFromCenterToPoint(
          localRef,
        )
      } else {
        intersection = localShape.closestPoint(localRef, pathOptions)
      }
    }

    const cp = intersection
      ? v.transformPoint(intersection, targetMatrix)
      : anchor
    let cpOffset = options.offset || 0
    if (options.stroked) cpOffset += Private.getStrokeWidth(node) / 2

    return Private.offset(cp, line.start, cpOffset)
  }
}

export namespace ConnectionPoint {
  type ModuleType = typeof ConnectionPoint

  export type OptionsMap = {
    [K in FunctionKeys<ModuleType>]: Parameters<ModuleType[K]>[3]
  }

  export type NativeNames = keyof OptionsMap

  export interface NativeItem<T extends NativeNames> {
    name: T
    args?: OptionsMap[T]
  }

  export interface ManaualItem {
    name: string
    args?: KeyValue
  }
}

namespace Private {
  export function offset(p1: Point, p2: Point, offset?: number) {
    if (offset == null) {
      return p1
    }

    const length = p1.distance(p2)
    if (offset === 0 && length > 0) {
      return p1
    }
    return p1.move(p2, -Math.min(offset, length - 1))
  }

  export function getStrokeWidth(magnet: SVGElement) {
    const stroke = magnet.getAttribute('stroke-width')
    if (stroke === null) {
      return 0
    }
    return parseFloat(stroke) || 0
  }

  export function findShapeNode(magnet: Element) {
    if (magnet == null) {
      return null
    }

    let node = magnet
    do {
      let tagName = node.tagName
      if (typeof tagName !== 'string') return null
      tagName = tagName.toUpperCase()
      if (tagName === 'G') {
        node = node.firstElementChild as Element
      } else if (tagName === 'TITLE') {
        node = node.nextElementSibling as Element
      } else break
    } while (node)

    return node
  }
}
