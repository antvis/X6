import { KeyValue } from '../../types'
import { Point } from '../../geometry'
import { EdgeView } from '../../view'
import { Registry } from '../registry'
import * as routers from './main'

export namespace Router {
  export type Definition<T> = (
    this: EdgeView,
    vertices: Point.PointLike[],
    options: T,
    edgeView: EdgeView,
  ) => Point.PointLike[]
  export type CommonDefinition = Definition<KeyValue>
}

export namespace Router {
  export type Presets = typeof Router['presets']

  export type OptionsMap = {
    readonly [K in keyof Presets]-?: Parameters<Presets[K]>[1]
  }

  export type NativeNames = keyof OptionsMap

  export interface NativeItem<T extends NativeNames = NativeNames> {
    name: T
    args?: OptionsMap[T]
  }

  export interface ManaualItem {
    name: Exclude<string, NativeNames>
    args?: KeyValue
  }
}

export namespace Router {
  export const presets = routers
  export const registry = Registry.create<CommonDefinition, Presets>({
    type: 'router',
  })

  registry.register(presets, true)
}
