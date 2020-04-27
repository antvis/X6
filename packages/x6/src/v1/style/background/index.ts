import { ValuesType } from 'utility-types'
import * as CSS from 'csstype'
import * as patterns from './index-rollup'
import { KeyValue } from '../../../types'

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
  }

  export interface CommonOptions extends Omit<Options, 'repeat'> {
    quality?: number
  }

  export type Definition<T extends CommonOptions = CommonOptions> = (
    img: HTMLImageElement,
    options: T,
  ) => HTMLCanvasElement
}

export namespace Background {
  export const presets = patterns
}

export namespace Background {
  export type Presets = typeof Background['presets']

  export type OptionsMap = {
    readonly [K in keyof Presets]-?: Parameters<Presets[K]>[1] & {
      repeat: K
    }
  }

  export type NativeNames = keyof Presets

  export type NativeItem = ValuesType<OptionsMap>

  export type ManaualItem = CommonOptions &
    KeyValue & {
      repeat: string
    }
}
