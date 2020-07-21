import { KeyValue } from '../../types'
import { Rectangle, Point } from '../../geometry'
import { Registry } from '../registry'
import * as layouts from './main'

export namespace PortLayout {
  export const presets = layouts
  export const registry = Registry.create<CommonDefinition, Presets>({
    type: 'port layout',
  })

  registry.register(presets, true)
}

export namespace PortLayout {
  export interface Result {
    position: Point.PointLike
    angle?: number
  }

  export interface CommonArgs {
    x?: number
    y?: number
    dx?: number
    dy?: number
  }

  export type Definition<T> = (
    portsPositionArgs: T[],
    elemBBox: Rectangle,
    groupPositionArgs: T,
  ) => Result[]

  export type CommonDefinition = Definition<KeyValue>
}

export namespace PortLayout {
  export type Presets = typeof PortLayout['presets']

  export type OptionsMap = {
    readonly [K in keyof Presets]-?: Parameters<Presets[K]>[2]
  }

  export type NativeNames = keyof Presets

  export interface NativeItem<T extends NativeNames = NativeNames> {
    name: T
    args?: OptionsMap[T]
  }

  export interface ManaualItem {
    name: Exclude<string, NativeNames>
    args?: CommonArgs
  }
}
