import { KeyValue } from '../types'
import { Point, Line } from '../geometry'
import { NodeView } from '../core/node-view'
import * as connectionPoints from './main'

export namespace ConnectionPoint {
  export type Definition<T> = (
    line: Line,
    view: NodeView,
    magnet: SVGElement,
    options: T,
  ) => Point

  export type CommonDefinition = Definition<KeyValue>

  export interface BaseOptions {
    /**
     * Offset the connection point from the anchor by the specified
     * distance along the end link path segment.
     *
     * Default is `0`.
     */
    offset?: number
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
  export const presets = connectionPoints
}

export namespace ConnectionPoint {
  export type Presets = typeof ConnectionPoint['presets']

  export type OptionsMap = {
    readonly [K in keyof Presets]-?: Parameters<Presets[K]>[3]
  }

  export type NativeNames = keyof Presets

  export interface NativeItem<T extends NativeNames> {
    name: T
    args?: OptionsMap[T]
  }

  export interface ManaualItem {
    name: Exclude<string, NativeNames>
    args?: KeyValue
  }
}
