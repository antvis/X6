import { Point } from '../../geometry'
import { KeyValue } from '../../types'
import { Edge } from '../../model'
import { Graph } from '../../graph'
import { CellView } from '../../view'
import { Registry } from '../registry'
import * as strategies from './main'

export namespace ConnectionStrategy {
  export type Definition = (
    this: Graph,
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
