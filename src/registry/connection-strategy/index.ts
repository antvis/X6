import type { KeyValue } from '../../common'
import type { Point } from '../../geometry'
import type { Graph } from '../../graph'
import type { Edge } from '../../model'
import type { CellView } from '../../view'
import { Registry } from '../registry'
import * as strategies from './main'

export type ConnectionStrategyDefinition = (
  this: Graph,
  terminal: Edge.TerminalCellData,
  cellView: CellView,
  magnet: Element,
  coords: Point.PointLike,
  edge: Edge,
  type: Edge.TerminalType,
  options: KeyValue,
) => Edge.TerminalCellData

type Presets = typeof connectionStrategyPresets

type NativeNames = keyof Presets

export interface NativeItem<T extends NativeNames = NativeNames> {
  name: T
  args?: KeyValue
}

export interface ManualItem {
  name: Exclude<string, NativeNames>
  args?: KeyValue
}

export const connectionStrategyPresets = strategies

export const connectionStrategyRegistry = Registry.create<
  ConnectionStrategyDefinition,
  Presets
>({
  type: 'connection strategy',
})

connectionStrategyRegistry.register(connectionStrategyPresets, true)
