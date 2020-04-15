import { FunctionKeys } from 'utility-types'
import { KeyValue } from '../../types'
import { Point, Rectangle } from '../../geometry'
import { Attr } from '../attr'
import * as layouts from './index-rollup'

export namespace PortLabelLayout {
  export const manual = layouts.manual
  export const left = layouts.left
  export const top = layouts.top
  export const right = layouts.right
  export const bottom = layouts.bottom
  export const inside = layouts.inside
  export const insideOriented = layouts.insideOriented
  export const outside = layouts.outside
  export const outsideOriented = layouts.outsideOriented
  export const radial = layouts.radial
  export const radialOriented = layouts.radialOriented
}

export namespace PortLabelLayout {
  export interface Result {
    x: number
    y: number
    angle: number
    attrs: Attr.CellAttrs
  }

  export type Definition<T> = (
    portPosition: Point,
    elemBBox: Rectangle,
    args: T,
  ) => Result
}

export namespace PortLabelLayout {
  type ModuleType = typeof PortLabelLayout

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
    args?: KeyValue
  }
}
