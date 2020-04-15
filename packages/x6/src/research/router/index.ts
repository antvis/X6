import { FunctionKeys } from 'utility-types'
import { KeyValue } from '../../types'
import { Point } from '../../geometry'
import { EdgeView } from '../core/edge-view'
import * as routers from './index-rollup'

export namespace Router {
  export const orth = routers.orth
  export const normal = routers.normal
  export const oneSide = routers.oneSide
  export const manhattan = routers.manhattan
  export const metro = routers.metro
}

export namespace Router {
  export type Definition<T> = (
    this: EdgeView,
    vertices: Point.PointLike[],
    options: T,
    edgeView: EdgeView,
  ) => Point.PointLike[]
}

export namespace Router {
  type ModuleType = typeof Router

  export type OptionsMap = {
    [K in FunctionKeys<ModuleType>]: Parameters<ModuleType[K]>[1]
  }

  export type NativeNames = keyof OptionsMap

  export interface NativeItem<T extends NativeNames = NativeNames> {
    name: T
    args?: OptionsMap[T]
  }

  export interface ManaualItem {
    name: Exclude<string, NativeNames>
    args?: KeyValue
  }
}
