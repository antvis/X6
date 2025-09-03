import type { KeyValue } from '../../common'
import type { Line, Point } from '../../geometry'
import type { Edge } from '../../model/edge'
import type { CellView } from '../../view/cell'
import { Registry } from '../registry'
import * as connectionPoints from './main'

export type ConnectionPointDefinition<T> = (
  line: Line,
  view: CellView,
  magnet: SVGElement,
  options: T,
  type: Edge.TerminalType,
) => Point

type CommonDefinition = ConnectionPointDefinition<KeyValue>

export interface ConnectionPointBaseOptions {
  /**
   * Offset the connection point from the anchor by the specified
   * distance along the end edge path segment.
   *
   * Default is `0`.
   */
  offset?: number | Point.PointLike
}

export interface ConnectionPointStrokedOptions
  extends ConnectionPointBaseOptions {
  /**
   * If the stroke width should be included when calculating the
   * connection point.
   *
   * Default is `false`.
   */
  stroked?: boolean
}

type Presets = typeof presets

type OptionsMap = {
  readonly [K in keyof Presets]-?: Parameters<Presets[K]>[3]
}

export type NativeNames = keyof Presets

export interface ConnectionPointNativeItem<
  T extends NativeNames = NativeNames,
> {
  name: T
  args?: OptionsMap[T]
}

export interface ConnectionPointManualItem {
  name: Exclude<string, NativeNames>
  args?: KeyValue
}

const presets = connectionPoints
export const connectionPointRegistry = Registry.create<
  CommonDefinition,
  Presets
>({
  type: 'connection point',
})

connectionPointRegistry.register(presets, true)
