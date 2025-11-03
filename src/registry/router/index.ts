import type { KeyValue } from '../../common'
import type { PointLike } from '../../geometry'
import type { EdgeView } from '../../view'
import { Registry } from '../registry'
import * as routers from './main'

export type RouterDefinition<T> = (
  this: EdgeView,
  vertices: PointLike[],
  options: T,
  edgeView: EdgeView,
) => PointLike[]

type CommonDefinition = RouterDefinition<KeyValue>

type Presets = typeof routerPresets

type OptionsMap = {
  readonly [K in keyof Presets]-?: Parameters<Presets[K]>[1]
}

type NativeNames = keyof OptionsMap

export interface RouterNativeItem<T extends NativeNames = NativeNames> {
  name: T
  args?: OptionsMap[T]
}

export interface RouterManualItem {
  name: Exclude<string, NativeNames>
  args?: KeyValue
}

export const routerPresets = routers

export const routerRegistry = Registry.create<CommonDefinition, Presets>({
  type: 'router',
})

routerRegistry.register(routerPresets, true)
