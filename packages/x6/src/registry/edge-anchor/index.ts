import { KeyValue } from '../../types'
import { Point } from '../../geometry'
import { EdgeView } from '../../view'
import { Registry } from '../registry'
import * as anchors from './main'

export namespace EdgeConnectionAnchor {
  export type Definition<T> = (
    this: EdgeView,
    view: EdgeView,
    magnet: SVGElement,
    ref: Point | Point.PointLike | SVGElement,
    options: T,
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

export namespace EdgeConnectionAnchor {
  export type Presets = typeof EdgeConnectionAnchor['presets']

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

export namespace EdgeConnectionAnchor {
  export const presets = anchors
  export const registry = Registry.create<CommonDefinition, Presets>({
    type: 'edge anchor',
  })
  registry.register(presets, true)
}
