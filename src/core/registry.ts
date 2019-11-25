import * as util from '../util'
import * as shapes from '../shape'
import * as routers from '../router'
import * as perimeters from '../perimeter'
import { registerMarker } from '../marker'
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

registerShape(ShapeNames.rectangle, shapes.RectangleShape, true)
registerShape(ShapeNames.ellipse, shapes.EllipseShape, true)
registerShape(ShapeNames.doubleEllipse, shapes.DoubleEllipse, true)
registerShape(ShapeNames.triangle, shapes.Triangle, true)
registerShape(ShapeNames.hexagon, shapes.Hexagon, true)
registerShape(ShapeNames.cylinder, shapes.Cylinder, true)
registerShape(ShapeNames.rhombus, shapes.Rhombus, true)
registerShape(ShapeNames.actor, shapes.Actor, true)
registerShape(ShapeNames.cloud, shapes.Cloud, true)
registerShape(ShapeNames.line, shapes.Line, true)
registerShape(ShapeNames.image, shapes.ImageShape, true)
registerShape(ShapeNames.label, shapes.Label, true)
registerShape(ShapeNames.swimlane, shapes.Swimlane, true)
registerShape(ShapeNames.connector, shapes.Connector, true)
registerShape(ShapeNames.arrow, shapes.Arrow, true)
registerShape(ShapeNames.arrowConnector, shapes.ArrowConnector, true)
registerShape(ShapeNames.html, shapes.HtmlShape, true)

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
export function registerRouter(
  name: string,
  routing: RoutingFunction,
  force: boolean = false,
) {
  if (routerMap[name] && !force && !util.isApplyingHMR()) {
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
    ret = util.exec(name)
  }

  return typeof ret === 'function' ? ret : null
}

export function getRouter(name: string, allowEval: boolean = false) {
  return getEntity<RoutingFunction>(routerMap, name, allowEval)
}

registerRouter(RouterNames.elbow, routers.elbow, true)
registerRouter(RouterNames.entityRelation, routers.entityRelation, true)
registerRouter(RouterNames.loop, routers.loop, true)
registerRouter(RouterNames.sideToSide, routers.sideToSide, true)
registerRouter(RouterNames.topToBottom, routers.topToBottom, true)
registerRouter(RouterNames.orthogonal, routers.orthConnector, true)
registerRouter(RouterNames.segment, routers.segmentConnector, true)

// #endregion

// #region permeter

export type PerimeterFunction = (
  bounds: Rectangle,
  state: State,
  next: Point,
  orthogonal: boolean,
) => Point

const perimeterMap: { [name: string]: PerimeterFunction } = {}

export function registerPerimeter(
  name: string,
  permeter: PerimeterFunction,
  force: boolean = false,
) {
  if (perimeterMap[name] && !force && !util.isApplyingHMR()) {
    throw new Error(`Perimeter with name '${name}' already registered.`)
  }
  perimeterMap[name] = permeter
}

export function getPerimeter(name: string, allowEval: boolean = false) {
  return getEntity<PerimeterFunction>(perimeterMap, name, allowEval)
}

registerPerimeter(PerimeterNames.ellipse, perimeters.ellipsePerimeter, true)
registerPerimeter(PerimeterNames.rectangle, perimeters.rectanglePerimeter, true)
registerPerimeter(PerimeterNames.rhombus, perimeters.rhombusPerimeter, true)
registerPerimeter(PerimeterNames.triangle, perimeters.trianglePerimeter, true)
registerPerimeter(PerimeterNames.hexagon, perimeters.hexagonPerimeter, true)

// #endregion
