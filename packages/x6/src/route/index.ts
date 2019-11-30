import * as util from '../util'
import { State } from '../core'
import { Point } from '../struct'

export * from './er'
export * from './loop'
export * from './elbow'
export * from './orth'
export * from './segment'

export namespace Route {
  export type Router = (
    edgeState: State,
    sourceState: State,
    targetState: State,
    points: Point[],
    result: Point[],
  ) => void

  const routers: { [name: string]: Router } = {}

  export function register(
    name: string,
    router: Router,
    force: boolean = false,
  ) {
    util.registerEntity(routers, name, router, force, () => {
      throw new Error(`Router with name '${name}' already registered.`)
    })
  }

  export function getRouter(name: string, allowEval: boolean = false) {
    return util.getEntityFromRegistry(routers, name, allowEval)
  }

  export function getRouterNames() {
    return Object.keys(routers)
  }
}
