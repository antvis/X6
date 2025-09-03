import type { KeyValue } from '../../common'
import type { Point } from '../../geometry'
import type { Edge } from '../../model/edge'
import type { EdgeView } from '../../view'
import { Registry } from '../registry'
import * as anchors from './main'

export type EdgeAnchorDefinition<T> = (
  this: EdgeView,
  view: EdgeView,
  magnet: SVGElement,
  ref: Point | Point.PointLike | SVGElement,
  options: T,
  type: Edge.TerminalType,
) => Point

export type CommonDefinition = EdgeAnchorDefinition<KeyValue>

export type EdgeAnchorResolvedDefinition<T> = (
  this: EdgeView,
  view: EdgeView,
  magnet: SVGElement,
  refPoint: Point,
  options: T,
) => Point

type Presets = typeof presets

type OptionsMap = {
  readonly [K in keyof Presets]-?: Parameters<Presets[K]>[3]
}

type NativeNames = keyof Presets

export interface EdgeAnchorNativeItem<T extends NativeNames = NativeNames> {
  name: T
  args?: OptionsMap[T]
}

export interface EdgeAnchorManualItem {
  name: Exclude<string, NativeNames>
  args?: KeyValue
}

const presets = anchors
export const edgeAnchorRegistry = Registry.create<CommonDefinition, Presets>({
  type: 'edge endpoint',
})
edgeAnchorRegistry.register(presets, true)
