import { FunctionKeys } from 'utility-types'
import { KeyValue } from '../../types'
import { Point } from '../../geometry'
import { EdgeView } from '../core/edge-view'
import * as routers from './index-rollup'

export namespace Router {
  export type Definition<T> = (
    this: EdgeView,
    vertices: Point.PointLike[],
    options: T,
    edgeView: EdgeView,
  ) => Point.PointLike[]
}

export namespace Router {
  export const normal = routers.normal
  export const oneSide = routers.oneSide
}

export namespace Router {
  type RouterType = typeof Router

  export type OptionsMap = {
    [K in FunctionKeys<RouterType>]: Parameters<RouterType[K]>[1]
  }

  export type NativeNames = keyof OptionsMap

  export interface NativeDefine<T extends NativeNames = NativeNames> {
    name: T
    args?: OptionsMap[T]
  }

  export interface ManaualDefine {
    name: string
    args?: KeyValue
  }
}
