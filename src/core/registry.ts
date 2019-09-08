import * as shapes from '../shape'
import * as routers from '../router'
import * as perimeters from '../perimeter'
import { registerMarker } from '../marker'
import { evalString } from '../util'
import { State } from './state'
import {
  Point,
  Rectangle,
  ShapeNames,
  RouterNames,
  PerimeterNames,
} from '../struct'

// #region shapes

export const registerShape = shapes.Shape.registerShape

registerShape(ShapeNames.rectangle, shapes.RectangleShape)
registerShape(ShapeNames.ellipse, shapes.EllipseShape)
registerShape(ShapeNames.doubleEllipse, shapes.DoubleEllipse)
registerShape(ShapeNames.triangle, shapes.Triangle)
registerShape(ShapeNames.hexagon, shapes.Hexagon)
registerShape(ShapeNames.cylinder, shapes.Cylinder)
registerShape(ShapeNames.rhombus, shapes.Rhombus)
registerShape(ShapeNames.actor, shapes.Actor)
registerShape(ShapeNames.cloud, shapes.Cloud)
registerShape(ShapeNames.line, shapes.Line)
registerShape(ShapeNames.image, shapes.ImageShape)
registerShape(ShapeNames.label, shapes.Label)
registerShape(ShapeNames.swimlane, shapes.Swimlane)
registerShape(ShapeNames.connector, shapes.Connector)
registerShape(ShapeNames.arrow, shapes.Arrow)
registerShape(ShapeNames.arrowConnector, shapes.ArrowConnector)

// #endregion

// #region marker

export { registerMarker }

// #endregion

// #region router

export type RoutingFunction = (
  edgeState: State,
  sourceState: State,
  targetState: State,
  points: Point[],
  result: Point[],
) => void

const routerMap: { [name: string]: RoutingFunction } = {}
export function registerRouter(name: string, routing: RoutingFunction) {
  if (routerMap[name]) {
    throw new Error(`Router with name '${name}' already registered.`)
  }
  routerMap[name] = routing
}

function getEntity<T>(
  map: any,
  name: string,
  allowEval: boolean = false,
): T | null {
  let ret = map[name]
  if (ret == null && allowEval) {
    ret = evalString(name)
  }

  return typeof ret === 'function' ? ret : null
}

export function getRouter(name: string, allowEval: boolean = false) {
  return getEntity<RoutingFunction>(routerMap, name, allowEval)
}

registerRouter(RouterNames.elbow, routers.elbowConnector)
registerRouter(RouterNames.entityRelation, routers.entityRelation)
registerRouter(RouterNames.loop, routers.loop)
registerRouter(RouterNames.sideToSide, routers.sideToSide)
registerRouter(RouterNames.topToBottom, routers.topToBottom)
registerRouter(RouterNames.orthogonal, routers.orthConnector)
registerRouter(RouterNames.segment, routers.segmentConnector)

// #endregion

// #region permeter

export type PerimeterFunction = (
  bounds: Rectangle,
  state: State,
  next: Point,
  orthogonal: boolean,
) => Point

const perimeterMap: { [name: string]: PerimeterFunction } = {}

export function registerPerimeter(name: string, permeter: PerimeterFunction) {
  if (perimeterMap[name]) {
    throw new Error(`Perimeter with name '${name}' already registered.`)
  }
  perimeterMap[name] = permeter
}

export function getPerimeter(name: string, allowEval: boolean = false) {
  return getEntity<PerimeterFunction>(perimeterMap, name, allowEval)
}

registerPerimeter(PerimeterNames.ellipse, perimeters.ellipse)
registerPerimeter(PerimeterNames.rectangle, perimeters.rectangle)
registerPerimeter(PerimeterNames.rhombus, perimeters.rhombus)
registerPerimeter(PerimeterNames.triangle, perimeters.triangle)
registerPerimeter(PerimeterNames.hexagon, perimeters.hexagon)

// #endregion
