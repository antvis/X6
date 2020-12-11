import { KeyValue } from '../../types'
import { Point, Line } from '../../geometry'
import { Edge } from '../../model/edge'
import { CellView } from '../../view/cell'
import { Registry } from '../registry'
import * as connectionPoints from './main'

export namespace ConnectionPoint {
  export type Definition<T> = (
    line: Line,
    view: CellView,
    magnet: SVGElement,
    options: T,
    type: Edge.TerminalType,
  ) => Point

  export type CommonDefinition = Definition<KeyValue>

  export interface BaseOptions {
    /**
     * Offset the connection point from the anchor by the specified
     * distance along the end edge path segment.
     *
     * Default is `0`.
     */
    offset?: number | Point.PointLike
  }

  export interface StrokedOptions extends BaseOptions {
    /**
     * If the stroke width should be included when calculating the
     * connection point.
     *
     * Default is `false`.
     */
    stroked?: boolean
  }
}

export namespace ConnectionPoint {
  export type Presets = typeof ConnectionPoint['presets']

  export type OptionsMap = {
    readonly [K in keyof Presets]-?: Parameters<Presets[K]>[3]
  }

  export type NativeNames = keyof Presets

  export interface NativeItem<T extends NativeNames = NativeNames> {
    name: T
    args?: OptionsMap[T]
  }

  export interface ManaualItem {
    name: Exclude<string, NativeNames>
    args?: KeyValue
  }
}

export namespace ConnectionPoint {
  export const presets = connectionPoints
  export const registry = Registry.create<CommonDefinition, Presets>({
    type: 'connection point',
  })

  registry.register(presets, true)
}
