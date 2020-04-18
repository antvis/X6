import { KeyValue } from '../../types'
import { Rectangle } from '../../geometry'
import * as layouts from './index-rollup'

export namespace PortLayout {
  export const presets = layouts
}

export namespace PortLayout {
  export interface Result extends KeyValue {
    x: number
    y: number
    angle: number
  }

  export interface CommonArgs {
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
