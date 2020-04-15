import { FunctionKeys } from 'utility-types'
import { KeyValue } from '../../types'
import { Point, Line } from '../../geometry'
import { NodeView } from '../core/node-view'
import * as connectionPoints from './index-rollup'

export namespace ConnectionPoint {
  export type Definition<T> = (
    line: Line,
    view: NodeView,
    magnet: SVGElement,
    options: T,
  ) => Point

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
  export const bbox = connectionPoints.bbox
  export const anchor = connectionPoints.anchor
  export const rect = connectionPoints.rect
  export const boundary = connectionPoints.boundary
}

export namespace ConnectionPoint {
  type ModuleType = typeof ConnectionPoint

  export type OptionsMap = {
    [K in FunctionKeys<ModuleType>]: Parameters<ModuleType[K]>[3]
  }

  export type NativeNames = keyof OptionsMap

  export interface NativeItem<T extends NativeNames> {
    name: T
    args?: OptionsMap[T]
  }

  export interface ManaualItem {
    name: Exclude<string, NativeNames>
    args?: KeyValue
  }
}
