import { FunctionKeys } from 'utility-types'
import { KeyValue } from '../../types'
import { Point, Path } from '../../geometry'
import { EdgeView } from '../core/edge-view'
import * as connectors from './index-rollup'

export namespace Connector {
  export interface BaseOptions {
    raw?: boolean
  }

  export type Definition<T extends BaseOptions = BaseOptions> = (
    this: EdgeView,
    sourcePoint: Point.PointLike,
    targetPoint: Point.PointLike,
    routePoints: Point.PointLike[],
    options: T,
    edgeView: EdgeView,
  ) => Path | string
}

export namespace Connector {
  export const normal = connectors.normal
  export const smooth = connectors.smooth
  export const rounded = connectors.rounded
  export const jumpover = connectors.jumpover
}

export namespace Connector {
  type ModuleType = typeof Connector

  export type OptionsMap = {
    [K in FunctionKeys<ModuleType>]: Parameters<ModuleType[K]>[3]
  }

  export type NativeNames = keyof OptionsMap

  export interface NativeItem<T extends NativeNames = NativeNames> {
    name: T
    args?: OptionsMap[T]
  }

  export interface ManaualItem {
    name: string
    args?: KeyValue
  }
}
