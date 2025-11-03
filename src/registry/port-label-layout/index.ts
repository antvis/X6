import type { KeyValue } from '../../common'
import type { Point, Rectangle } from '../../geometry'
import type { CellAttrs } from '../attr'
import { Registry } from '../registry'
import * as layouts from './main'
import type { PointLike } from '@/types'
export interface PortLabelLayoutResult {
  position: PointLike
  angle: number
  attrs: CellAttrs
}

export type PortLabelLayoutDefinition<T> = (
  portPosition: Point,
  elemBBox: Rectangle,
  args: T,
) => PortLabelLayoutResult

type CommonDefinition = PortLabelLayoutDefinition<KeyValue>

export interface PortLabelLayoutCommonOptions {
  x?: number
  y?: number
  angle?: number
  attrs?: CellAttrs
}

export type Presets = typeof portLabelLayoutPresets

export type OptionsMap = {
  readonly [K in keyof Presets]-?: Parameters<Presets[K]>[2]
}

export type PortLabelLayoutNativeNames = keyof Presets

export interface PortLabelLayoutNativeItem<
  T extends PortLabelLayoutNativeNames = PortLabelLayoutNativeNames,
> {
  name: T
  args?: OptionsMap[T]
}

export interface PortLabelLayoutManualItem {
  name: Exclude<string, PortLabelLayoutNativeNames>
  args?: KeyValue
}

export const portLabelLayoutPresets = layouts
export const portLabelLayoutRegistry = Registry.create<
  CommonDefinition,
  Presets
>({
  type: 'port label layout',
})

portLabelLayoutRegistry.register(portLabelLayoutPresets, true)
