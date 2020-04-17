import { FunctionKeys, NonUndefined } from 'utility-types'
import { KeyValue } from '../../types'
import * as filters from './index-rollup'

export namespace Filter {
  export const outline = filters.outline
  export const highlight = filters.highlight
  export const blur = filters.blur
  export const dropShadow = filters.dropShadow
  export const grayScale = filters.grayScale
  export const sepia = filters.sepia
  export const saturate = filters.saturate
  export const hueRotate = filters.hueRotate
  export const invert = filters.invert
  export const brightness = filters.brightness
  export const contrast = filters.contrast
}

export namespace Filter {
  export type Definition<T> = (args: T) => string
}

export namespace Filter {
  type ModuleType = typeof Filter

  export type OptionsMap = {
    [K in FunctionKeys<ModuleType>]: NonUndefined<Parameters<ModuleType[K]>[0]>
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
