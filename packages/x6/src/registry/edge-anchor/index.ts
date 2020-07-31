import { KeyValue } from '../../types'
import { Point } from '../../geometry'
import { Edge } from '../../model/edge'
import { EdgeView } from '../../view'
import { Registry } from '../registry'
import * as anchors from './main'

export namespace EdgeAnchor {
  export type Definition<T> = (
    this: EdgeView,
    view: EdgeView,
    magnet: SVGElement,
    ref: Point | Point.PointLike | SVGElement,
    options: T,
    type: Edge.TerminalType,
  ) => Point

  export type CommonDefinition = Definition<KeyValue>

  export type ResolvedDefinition<T> = (
    this: EdgeView,
    view: EdgeView,
    magnet: SVGElement,
    refPoint: Point,
    options: T,
  ) => Point
}

export namespace EdgeAnchor {
  export type Presets = typeof EdgeAnchor['presets']

  export type OptionsMap = {
    readonly [K in keyof Presets]-?: Parameters<Presets[K]>[3]
  }

  export type NativeNames = keyof Presets

  export interface NativeItem<T extends NativeNames = NativeNames> {
    name: T
    args?: OptionsMap[T]
  }

  export interface ManaualItem {
    name: Exclude<string, NativeNames>
    args?: KeyValue
  }
}

export namespace EdgeAnchor {
  export const presets = anchors
  export const registry = Registry.create<CommonDefinition, Presets>({
    type: 'edge endpoint',
  })
  registry.register(presets, true)
}
