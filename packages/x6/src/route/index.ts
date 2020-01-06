import { Point } from '../geometry'
import { State } from '../core/state'
import * as elbowRouters from './elbow'
import { loop as loopRouter } from './loop'
import { er as entityRelationRouter } from './er'
import { orth as orthRouter } from './orth'
import { segment as segmentRouter } from './segment'
import { getEntityFromRegistry, registerEntity } from '../registry/util'

export namespace Route {
  export const er = entityRelationRouter
  export const loop = loopRouter
  export const segment = segmentRouter
  export const orth = orthRouter
  export const elbow = elbowRouters.elbow
  export const sideToSide = elbowRouters.sideToSide
  export const topToBottom = elbowRouters.topToBottom
}

// export * from './er'
// export * from './elbow'
// export * from './loop'
// export * from './orth'
// export * from './segment'

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
    registerEntity(routers, name, router, force, () => {
      throw new Error(`Router with name '${name}' already registered.`)
    })
  }

  export function getRouter(name: string, allowEval: boolean = false) {
    return getEntityFromRegistry(routers, name, allowEval)
  }

  export function getRouterNames() {
    return Object.keys(routers)
  }
}
