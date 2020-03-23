import { FunctionKeys } from 'utility-types'
import { KeyValue } from '../../types'
import { Point, Line } from '../../geometry'
import { EdgeView } from '../core/edge-view'
import { ResolveOptions, resolve, getPointAtLink } from './util'

export namespace EdgeAnchor {
  export type Definition<T> = (
    this: EdgeView,
    view: EdgeView,
    magnet: SVGElement,
    ref: Point | Point.PointLike | SVGElement,
    options: T,
  ) => Point

  export type ResolvedDefinition<T> = (
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

  export interface ClosestAnchorOptions extends ResolveOptions {}
}

export namespace EdgeAnchor {
  export const ratio: Definition<RatioAnchorOptions> = function(
    view,
    magnet,
    ref,
    options,
  ) {
    const ratio = options.ratio != null ? options.ratio : 0.5
    return view.getPointAtRatio(ratio)!
  }

  export const length: Definition<LengthAnchorOptions> = function(
    view,
    magnet,
    ref,
    options,
  ) {
    const length = options.length != null ? options.length : 20
    return view.getPointAtLength(length)!
  }

  const orthogonal: ResolvedDefinition<OrthAnchorOptions> = function(
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

  const closestPoint: ResolvedDefinition<ClosestAnchorOptions> = function(
    view,
    magnet,
    refPoint,
    options,
  ) {
    const closestPoint = view.getClosestPoint(refPoint)
    return closestPoint != null ? closestPoint : new Point()
  }

  export const orth = resolve<
    ResolvedDefinition<OrthAnchorOptions>,
    Definition<OrthAnchorOptions>
  >(orthogonal)

  export const closest = resolve<
    ResolvedDefinition<ResolveOptions>,
    Definition<ClosestAnchorOptions>
  >(closestPoint)
}

export namespace EdgeAnchor {
  type ModuleType = typeof EdgeAnchor

  export type OptionsMap = {
    [K in FunctionKeys<ModuleType>]: Parameters<ModuleType[K]>[3]
  }

  export type NativeNames = keyof OptionsMap

  export interface NativeItem<T extends NativeNames = NativeNames> {
    name: T
    args?: OptionsMap[T]
  }

  export interface ManaualItem {
    name: string
    args?: KeyValue
  }
}
