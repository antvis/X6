import { FunctionKeys } from 'utility-types'
import { KeyValue } from '../../types'
import { Rectangle } from '../../geometry'
import * as layouts from './index-rollup'

export namespace PortLayout {
  export const absolute = layouts.absolute
  export const line = layouts.line
  export const left = layouts.left
  export const top = layouts.top
  export const right = layouts.right
  export const bottom = layouts.bottom
  export const ellipse = layouts.ellipse
  export const ellipseSpread = layouts.ellipseSpread
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
}

export namespace PortLayout {
  type ModuleType = typeof PortLayout

  export type OptionsMap = {
    [K in FunctionKeys<ModuleType>]: Parameters<ModuleType[K]>[2]
  }

  export type NativeNames = keyof OptionsMap

  export interface NativeItem<T extends NativeNames = NativeNames> {
    name: T
    args?: OptionsMap[T]
  }

  export interface ManaualItem {
    name: Exclude<string, NativeNames>
    args?: CommonArgs
  }
}
