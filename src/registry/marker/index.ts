import type { KeyValue } from '../../common'
import type { SimpleAttrs } from '../attr'
import { Registry } from '../registry'
import * as markers from './main'
import { normalize as normalizeMarker } from './util'

export type MarkerFactory<T extends KeyValue = KeyValue> = (
  options: T,
) => MarkerResult

export interface BaseResult extends SimpleAttrs {
  tagName?: string
}

export type MarkerResult = BaseResult & {
  id?: string
  refX?: number
  refY?: number
  // @see https://developer.mozilla.org/en-US/docs/Web/SVG/Element/marker
  markerUnits?: string
  markerOrient?: 'auto' | 'auto-start-reverse' | number
  children?: BaseResult[]
}

type Presets = typeof presets

type OptionsMap = {
  readonly [K in keyof Presets]-?: Parameters<Presets[K]>[0]
}

type NativeNames = keyof OptionsMap

export interface ManualItem {
  name: Exclude<string, NativeNames>
  args?: KeyValue
}

const presets = markers

export const makerRegistry = Registry.create<MarkerFactory, Presets>({
  type: 'marker',
})
makerRegistry.register(presets, true)

export const makerNormalize = normalizeMarker
