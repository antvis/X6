import { ValuesType } from 'utility-types'
import { KeyValue } from '../../types'
import { Property } from '../../types/csstype'
import { Registry } from '../registry'
import * as patterns from './main'

export namespace Background {
  export interface Options {
    color?: string
    image?: string
    position?: Property.BackgroundPosition<{
      x: number
      y: number
    }>
    size?: Property.BackgroundSize<{
      width: number
      height: number
    }>
    repeat?: Property.BackgroundRepeat
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
