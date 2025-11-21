import type { KeyValue } from '../../common'
import type { PointLike, Rectangle } from '../../geometry'
import { Registry } from '../registry'
import * as layouts from './main'

export interface PortLayoutResult {
  position: PointLike
  angle?: number
}

export interface PortLayoutCommonArgs {
  x?: number
  y?: number
  dx?: number
  dy?: number
}

export type PortLayoutDefinition<T> = (
  portsPositionArgs: T[],
  elemBBox: Rectangle,
  groupPositionArgs: T,
) => PortLayoutResult[]

type CommonDefinition = PortLayoutDefinition<KeyValue>

type Presets = typeof portLayoutPresets

type OptionsMap = {
  readonly [K in keyof Presets]-?: Parameters<Presets[K]>[2]
}

export type PortLayoutNativeNames = keyof Presets

export interface PortLayoutNativeItem<
  T extends PortLayoutNativeNames = PortLayoutNativeNames,
> {
  name: T
  args?: OptionsMap[T]
}

export interface PortLayoutManualItem {
  name: Exclude<string, PortLayoutNativeNames>
  args?: PortLayoutCommonArgs
}

export const portLayoutPresets = layouts

export const portLayoutRegistry = Registry.create<CommonDefinition, Presets>({
  type: 'port layout',
})

portLayoutRegistry.register(portLayoutPresets, true)
