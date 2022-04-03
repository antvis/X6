import { Point } from '@antv/x6-geometry'
import { Registry, KeyValue } from '@antv/x6-common'
import { Edge } from '../../model'
import { CellView } from '../../view'
import * as strategies from './main'

export namespace ConnectionStrategy {
  export type Definition = (
    this: any, // todo Graph
    terminal: Edge.TerminalCellData,
    cellView: CellView,
    magnet: Element,
    coords: Point.PointLike,
    edge: Edge,
    type: Edge.TerminalType,
    options: KeyValue,
  ) => Edge.TerminalCellData
}

export namespace ConnectionStrategy {
  export type Presets = typeof ConnectionStrategy['presets']

  export type NativeNames = keyof Presets

  export interface NativeItem<T extends NativeNames = NativeNames> {
    name: T
    args?: KeyValue
  }

  export interface ManaualItem {
    name: Exclude<string, NativeNames>
    args?: KeyValue
  }
}

export namespace ConnectionStrategy {
  export const presets = strategies
  export const registry = Registry.create<Definition, Presets>({
    type: 'connection strategy',
  })

  registry.register(presets, true)
}
