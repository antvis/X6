/* eslint-disable @typescript-eslint/ban-types */
import type { ValuesType } from 'utility-types'
import type { KeyValue } from '../../common'
import { Registry } from '../registry'
import * as patterns from './main'

export interface BackgroundOptions {
  color?: string
  image?: string
  position?: BackgroundPosition<{
    x: number
    y: number
  }>
  size?: BackgroundSize<{
    width: number
    height: number
  }>
  repeat?: BackgroundRepeat
  opacity?: number
}

export interface BackgroundCommonOptions
  extends Omit<BackgroundOptions, 'repeat'> {
  quality?: number
}

export type BackgroundDefinition<
  T extends BackgroundCommonOptions = BackgroundCommonOptions,
> = (img: HTMLImageElement, options: T) => HTMLCanvasElement

type Presets = typeof presets

type OptionsMap = {
  readonly [K in keyof Presets]-?: Parameters<Presets[K]>[1] & {
    repeat: K
  }
}

export type BackgroundNativeItem = ValuesType<OptionsMap>

export type BackgroundManualItem = BackgroundCommonOptions &
  KeyValue & {
    repeat: string
  }

const presets: { [name: string]: BackgroundDefinition } = { ...patterns }

presets['flip-x'] = patterns.flipX
presets['flip-y'] = patterns.flipY
presets['flip-xy'] = patterns.flipXY

export const backgroundRegistry = Registry.create<
  BackgroundDefinition,
  Presets
>({
  type: 'background pattern',
})

backgroundRegistry.register(presets, true)

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
