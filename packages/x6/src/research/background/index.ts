import { FunctionKeys } from 'utility-types'
import * as CSS from 'csstype'
import * as patterns from './index-rollup'
import { KeyValue } from '../../types'

export namespace Background {
  export interface Options {
    color?: string
    image?: string
    position?: CSS.BackgroundPositionProperty<{
      x: number
      y: number
    }>
    size?: CSS.BackgroundSizeProperty<{
      width: number
      height: number
    }>
    repeat?: CSS.BackgroundRepeatProperty
    opacity?: number
    quality?: number
    watermarkAngle?: number
  }

  export type Definition<T extends Options = Options> = (
    img: HTMLImageElement,
    options: T,
  ) => HTMLCanvasElement
}

export namespace Background {
  export const flipX = patterns.flipX
  export const flipY = patterns.flipY
  export const flipXY = patterns.flipXY
  export const watermark = patterns.watermark
}

export namespace Background {
  type ModuleType = typeof Background

  export type OptionsMap = {
    [K in FunctionKeys<ModuleType>]: Parameters<ModuleType[K]>[1]
  }

  export type NativeNames = keyof OptionsMap

  export type NativeItem<
    T extends NativeNames = NativeNames
  > = OptionsMap[T] & {
    pattern: T
  }

  export type ManaualItem = Options &
    KeyValue & {
      pattern: Exclude<string, NativeNames>
    }
}
