import { FunctionKeys } from 'utility-types'
import { NumberExt } from '../../util'
import { Point, Angle } from '../../geometry'
import { Edge } from '../core/edge'
import { EdgeView } from '../core/edge-view'
import { NodeView } from '../core/node-view'
import { ResolveOptions, resolve } from './util'
import { KeyValue } from '../../types'

export namespace NodeAnchor {
  export type Definition<T> = (
    this: EdgeView,
    /**
     * The NodeView to which we are connecting.
     */
    nodeView: NodeView,
    /**
     * The SVGElement in our graph that contains the magnet
     * (element/subelement/port) to which we are connecting.
     */
    magnet: SVGElement,
    /**
     * A reference to another component of the edge path that may be
     * necessary to find this anchor point. If we are calling this method
     * for a source anchor, it is the first vertex, or if there are no
     * vertices the target anchor. If we are calling this method for a target
     * anchor, it is the last vertex, or if there are no vertices the source
     * anchor...
     */
    ref: Point | Point.PointLike | SVGElement,
    options: T,
    endType: Edge.TerminalType,
  ) => Point

  export type ResolvedDefinition<T> = (
    this: EdgeView,
    view: NodeView,
    magnet: SVGElement,
    refPoint: Point,
    options: T,
  ) => Point

  export interface BBoxAnchorOptions {
    dx?: number | string
    dy?: number | string
    /**
     * Should the anchor bbox rotate with the terminal view.
     *
     * Default is `false`, meaning that the unrotated bbox is used.
     */
    rotated?: boolean
  }

  export interface OrthAnchorOptions extends ResolveOptions {
    padding: number
  }

  export interface MiddleSideAnchorOptions extends ResolveOptions {
    rotated?: boolean
    padding?: number
  }

  export interface NodeCenterAnchorOptions {
    dx?: number
    dy?: number
  }
}

export namespace NodeAnchor {
  export const center = createBBoxAnchor('center')
  export const top = createBBoxAnchor('topCenter')
  export const bottom = createBBoxAnchor('bottomCenter')
  export const left = createBBoxAnchor('leftMiddle')
  export const right = createBBoxAnchor('rightMiddle')
  export const topLeft = createBBoxAnchor('topLeft')
  export const topRight = createBBoxAnchor('topRight')
  export const bottomLeft = createBBoxAnchor('bottomLeft')
  export const bottomRight = createBBoxAnchor('bottomRight')

  function createBBoxAnchor(
    method:
      | 'center'
      | 'topCenter'
      | 'bottomCenter'
      | 'leftMiddle'
      | 'rightMiddle'
      | 'topLeft'
      | 'topRight'
      | 'bottomLeft'
      | 'bottomRight',
  ): NodeAnchor.Definition<NodeAnchor.BBoxAnchorOptions> {
    return function(
      view,
      magnet,
      ref,
      options: NodeAnchor.BBoxAnchorOptions = {},
    ) {
      const bbox = options.rotated
        ? view.getNodeUnrotatedBBox(magnet)
        : view.getNodeBBox(magnet)
      const anchor = bbox[method]

      anchor.x += NumberExt.normalizePercentage(options.dx, bbox.width)
      anchor.y += NumberExt.normalizePercentage(options.dy, bbox.height)

      const cell = view.cell
      return options.rotated
        ? anchor.rotate(-cell.getRotation(), cell.getBBox().getCenter())
        : anchor
    }
  }

  /**
   * Places the anchor of the edge at center of the node bbox.
   */
  export const nodeCenter: Definition<NodeCenterAnchorOptions> = function(
    view,
    magnet,
    ref,
    options,
    endType,
  ) {
    const p = view.cell.getConnectionPoint(this.cell, endType)
    if (options.dx || options.dy) {
      p.translate(options.dx || 0, options.dy || 0)
    }
    return p
  }

  const orthogonal: ResolvedDefinition<OrthAnchorOptions> = function(
    view,
    magnet,
    refPoint,
    options,
  ) {
    const angle = view.cell.rotation
    const bbox = view.getNodeBBox(magnet)
    const anchor = bbox.center
    const topLeft = bbox.origin
    const bottomRight = bbox.corner

    let padding = options.padding
    if (!isFinite(padding)) {
      padding = 0
    }

    if (
      topLeft.y + padding <= refPoint.y &&
      refPoint.y <= bottomRight.y - padding
    ) {
      const dy = refPoint.y - anchor.y
      anchor.x +=
        angle === 0 || angle === 180
          ? 0
          : (dy * 1) / Math.tan(Angle.toRad(angle))
      anchor.y += dy
    } else if (
      topLeft.x + padding <= refPoint.x &&
      refPoint.x <= bottomRight.x - padding
    ) {
      const dx = refPoint.x - anchor.x
      anchor.y +=
        angle === 90 || angle === 270 ? 0 : dx * Math.tan(Angle.toRad(angle))
      anchor.x += dx
    }

    return anchor
  }

  const middleSide: ResolvedDefinition<MiddleSideAnchorOptions> = function(
    view,
    magnet,
    refPoint,
    options,
  ) {
    let bbox
    let angle = 0
    let center

    const node = view.cell
    if (options.rotated) {
      bbox = view.getNodeUnrotatedBBox(magnet)
      center = node.getBBox().getCenter()
      angle = node.rotation
    } else {
      bbox = view.getNodeBBox(magnet)
    }

    const padding = options.padding
    if (padding != null && isFinite(padding)) {
      bbox.inflate(padding)
    }

    if (options.rotated) {
      refPoint.rotate(angle, center)
    }

    const side = bbox.sideNearestToPoint(refPoint)
    let anchor
    switch (side) {
      case 'left':
        anchor = bbox.getLeftMiddle()
        break
      case 'right':
        anchor = bbox.getRightMiddle()
        break
      case 'top':
        anchor = bbox.getTopCenter()
        break
      case 'bottom':
        anchor = bbox.getBottomCenter()
        break
    }

    return options.rotated ? anchor.rotate(-angle, center) : anchor
  }

  /**
   * Tries to place the anchor of the edge inside the view bbox so that the
   * edge is made orthogonal. The anchor is placed along two line segments
   * inside the view bbox (between the centers of the top and bottom side and
   * between the centers of the left and right sides). If it is not possible
   * to place the anchor so that the edge would be orthogonal, the anchor is
   * placed at the center of the view bbox instead.
   */
  export const orth = resolve<
    ResolvedDefinition<OrthAnchorOptions>,
    Definition<OrthAnchorOptions>
  >(orthogonal)

  /**
   * Places the anchor of the edge in the middle of the side of view bbox
   * closest to the other endpoint.
   */
  export const midSide = resolve<
    ResolvedDefinition<ResolveOptions>,
    Definition<ResolveOptions>
  >(middleSide)
}

export namespace NodeAnchor {
  type ModuleType = typeof NodeAnchor

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
