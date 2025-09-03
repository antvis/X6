import type { KeyValue } from '../../common'
import type { Point } from '../../geometry'
import type { Edge } from '../../model'
import type { EdgeView, NodeView } from '../../view'
import { Registry } from '../registry'
import * as anchors from './main'

export type NodeAnchorDefinition<T> = (
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
  args: T,
  type: Edge.TerminalType,
) => Point

type CommonDefinition = NodeAnchorDefinition<KeyValue>

export type NodeAnchorResolvedDefinition<T> = (
  this: EdgeView,
  view: NodeView,
  magnet: SVGElement,
  refPoint: Point,
  args: T,
) => Point

type Presets = typeof presets

type OptionsMap = {
  readonly [K in keyof Presets]-?: Parameters<Presets[K]>[3]
}

type NativeNames = keyof Presets

export interface NodeAnchorNativeItem<T extends NativeNames = NativeNames> {
  name: T
  args?: OptionsMap[T]
}

export interface NodeAnchorManualItem {
  name: Exclude<string, NativeNames>
  args?: KeyValue
}

const presets = anchors

export const nodeAnchorRegistry = Registry.create<CommonDefinition, Presets>({
  type: 'node endpoint',
})

nodeAnchorRegistry.register(presets, true)
