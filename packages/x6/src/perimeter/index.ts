import { Point, Rectangle } from '../geometry'
import { State } from '../core/state'
import { rectanglePerimeter } from './rectangle'
import { ellipsePerimeter } from './ellipse'
import { trianglePerimeter } from './triangle'
import { hexagonPerimeter } from './hexagon'
import { rhombusPerimeter } from './rhombus'
import { registerEntity, getEntityFromRegistry } from '../registry/util'

export namespace Perimeter {
  export const rectangle = rectanglePerimeter
  export const ellipse = ellipsePerimeter
  export const triangle = trianglePerimeter
  export const hexagon = hexagonPerimeter
  export const rhombus = rhombusPerimeter
}

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
    registerEntity(perimeters, name, permeter, force, () => {
      throw new Error(`Perimeter with name '${name}' already registered.`)
    })
  }

  export function getPerimeter(name: string, allowEval: boolean = false) {
    return getEntityFromRegistry<PerimeterFunction>(perimeters, name, allowEval)
  }

  export function getPerimeterNames() {
    return Object.keys(perimeters)
  }
}
