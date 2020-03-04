import { Point, Line } from '../../geometry'
import { EdgeView } from '../core/edge-view'
import { ResolveOptions, resolve, getPointAtLink } from './util'
import { KeyValue } from '../../types'

export namespace EdgeAnchor {
  export type AnchorFunction<T> = (
    this: EdgeView,
    view: EdgeView,
    magnet: SVGElement,
    ref: Point | Point.PointLike | SVGElement,
    options: T,
  ) => Point

  export type ResolvedAnchorFunction<T> = (
    this: EdgeView,
    view: EdgeView,
    magnet: SVGElement,
    refPoint: Point,
    options: T,
  ) => Point

  export interface RatioAnchorOptions {
    ratio?: number
  }

  export interface LengthAnchorOptions {
    length?: number
  }

  export interface OrthAnchorOptions extends ResolveOptions {
    fallbackAt?: number | string
  }
}

export namespace EdgeAnchor {
  export const ratio: AnchorFunction<RatioAnchorOptions> = function(
    view,
    magnet,
    ref,
    options,
  ) {
    const ratio = options.ratio != null ? options.ratio : 0.5
    return view.getPointAtRatio(ratio)!
  }

  export const length: AnchorFunction<LengthAnchorOptions> = function(
    view,
    magnet,
    ref,
    options,
  ) {
    const length = options.length != null ? options.length : 20
    return view.getPointAtLength(length)!
  }

  const orthogonal: ResolvedAnchorFunction<OrthAnchorOptions> = function(
    view,
    magnet,
    refPoint,
    options,
  ) {
    const OFFSET = 1e6
    const path = view.getConnection()!
    const segmentSubdivisions = view.getConnectionSubdivisions()
    const vLine = new Line(
      refPoint.clone().translate(0, OFFSET),
      refPoint.clone().translate(0, -OFFSET),
    )
    const hLine = new Line(
      refPoint.clone().translate(OFFSET, 0),
      refPoint.clone().translate(-OFFSET, 0),
    )

    const vIntersections = vLine.intersect(path, {
      segmentSubdivisions,
    })

    const hIntersections = hLine.intersect(path, {
      segmentSubdivisions,
    })

    const intersections = []
    if (vIntersections) {
      intersections.push(...vIntersections)
    }
    if (hIntersections) {
      intersections.push(...hIntersections)
    }

    if (intersections.length > 0) {
      return refPoint.closest(intersections)
    }

    if (options.fallbackAt != null) {
      return getPointAtLink(view, options.fallbackAt)
    }

    return closestPoint.call(this, view, magnet, refPoint, options)
  }

  const closestPoint: ResolvedAnchorFunction<ResolveOptions> = function(
    view,
    magnet,
    refPoint,
    options,
  ) {
    const closestPoint = view.getClosestPoint(refPoint)
    return closestPoint != null ? closestPoint : new Point()
  }

  export const orth = resolve<
    ResolvedAnchorFunction<OrthAnchorOptions>,
    AnchorFunction<OrthAnchorOptions>
  >(orthogonal)

  export const closest = resolve<
    ResolvedAnchorFunction<ResolveOptions>,
    AnchorFunction<ResolveOptions>
  >(closestPoint)
}

export namespace EdgeAnchor {
  export interface NativeAnchorOptionsMap {
    ratio: RatioAnchorOptions
    length: LengthAnchorOptions
    orth: OrthAnchorOptions
    closest: ResolveOptions
  }

  export type NativeAnchorNames = keyof NativeAnchorOptionsMap

  export interface NativeDefine<T extends NativeAnchorNames> {
    name: T
    args?: NativeAnchorOptionsMap[T]
  }

  export interface CommonDefine {
    name: string
    args?: KeyValue
  }
}
