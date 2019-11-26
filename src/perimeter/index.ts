import * as util from '../util'
import { State } from '../core'
import { Rectangle, Point } from '../struct'

export * from './rectangle'
export * from './ellipse'
export * from './triangle'
export * from './hexagon'
export * from './rhombus'

export namespace Perimeter {
  export type PerimeterFunction = (
    bounds: Rectangle,
    state: State,
    next: Point,
    orthogonal: boolean,
  ) => Point

  const perimeters: { [name: string]: PerimeterFunction } = {}

  export function register(
    name: string,
    permeter: PerimeterFunction,
    force: boolean = false,
  ) {
    util.registerEntity(perimeters, name, permeter, force, () => {
      throw new Error(`Perimeter with name '${name}' already registered.`)
    })
  }

  export function getPerimeter(name: string, allowEval: boolean = false) {
    return util.getEntityFromRegistry<PerimeterFunction>(perimeters, name, allowEval)
  }

  export function getPerimeterNames() {
    return Object.keys(perimeters)
  }
}
