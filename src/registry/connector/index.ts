import type { KeyValue } from '../../common'
import type { Path, PointLike } from '../../geometry'
import type { EdgeView } from '../../view'
import { Registry } from '../registry'
import * as connectors from './main'

export interface ConnectorBaseOptions {
  raw?: boolean
}

export type ConnectorDefinition<
  T extends ConnectorBaseOptions = ConnectorBaseOptions,
> = (
  this: EdgeView,
  sourcePoint: PointLike,
  targetPoint: PointLike,
  routePoints: PointLike[],
  options: T,
  edgeView: EdgeView,
) => Path | string

type Presets = typeof connectorPresets

type OptionsMap = {
  readonly [K in keyof Presets]-?: Parameters<Presets[K]>[3]
}

type NativeNames = keyof Presets

export interface ConnectorNativeItem<T extends NativeNames = NativeNames> {
  name: T
  args?: OptionsMap[T]
}

export interface ConnectorManualItem {
  name: Exclude<string, NativeNames>
  args?: KeyValue
}

export const connectorPresets = connectors
export const connectorRegistry = Registry.create<ConnectorDefinition, Presets>({
  type: 'connector',
})

connectorRegistry.register(connectorPresets, true)
