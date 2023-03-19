/* eslint-disable @typescript-eslint/ban-types */

import { ValuesType } from 'utility-types'
import { KeyValue } from '@antv/x6-common'
import { Registry } from '../registry'
import * as patterns from './main'

export namespace Background {
  export interface Options {
    color?: string
    image?: string
    position?: Background.BackgroundPosition<{
      x: number
      y: number
    }>
    size?: Background.BackgroundSize<{
      width: number
      height: number
    }>
    repeat?: Background.BackgroundRepeat
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
  export type Presets = (typeof Background)['presets']

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

export namespace Background {
  export const presets: { [name: string]: Definition } = { ...patterns }

  presets['flip-x'] = patterns.flipX
  presets['flip-y'] = patterns.flipY
  presets['flip-xy'] = patterns.flipXY

  export const registry = Registry.create<Definition, Presets>({
    type: 'background pattern',
  })

  registry.register(presets, true)
}

export namespace Background {
  type Globals = '-moz-initial' | 'inherit' | 'initial' | 'revert' | 'unset'
  type BgPosition<TLength> =
    | TLength
    | 'bottom'
    | 'center'
    | 'left'
    | 'right'
    | 'top'
    | (string & {})
  type BgSize<TLength> = TLength | 'auto' | 'contain' | 'cover' | (string & {})
  type RepeatStyle =
    | 'no-repeat'
    | 'repeat'
    | 'repeat-x'
    | 'repeat-y'
    | 'round'
    | 'space'
    | (string & {})
  export type BackgroundPosition<TLength = (string & {}) | 0> =
    | Globals
    | BgPosition<TLength>
    | (string & {})
  export type BackgroundSize<TLength = (string & {}) | 0> =
    | Globals
    | BgSize<TLength>
    | (string & {})
  export type BackgroundRepeat = Globals | RepeatStyle | (string & {})
  export interface Padding {
    left: number
    top: number
    right: number
    bottom: number
  }
}
