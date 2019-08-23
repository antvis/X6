import * as s from '../shape'
import { constants } from '../common'
import { Renderer } from './renderer'

export * from './cell'
export * from './model'
export * from './view'
export * from './graph'
export * from './geometry'
export * from './cell-path'
export * from './renderer'
export * from './cell-state'
export * from './cell-overlay'

registerShape(constants.SHAPE_RECTANGLE, s.RectShape)
registerShape(constants.SHAPE_ELLIPSE, s.Ellipse)
registerShape(constants.SHAPE_DOUBLE_ELLIPSE, s.DoubleEllipse)
registerShape(constants.SHAPE_RHOMBUS, s.Rhombus)
registerShape(constants.SHAPE_CYLINDER, s.Cylinder)
registerShape(constants.SHAPE_CONNECTOR, s.Connector)
registerShape(constants.SHAPE_ACTOR, s.Actor)
registerShape(constants.SHAPE_TRIANGLE, s.Triangle)
registerShape(constants.SHAPE_HEXAGON, s.Hexagon)
registerShape(constants.SHAPE_CLOUD, s.Cloud)
registerShape(constants.SHAPE_LINE, s.Line)
registerShape(constants.SHAPE_ARROW, s.Arrow)
registerShape(constants.SHAPE_ARROW_CONNECTOR, s.ArrowConnector)
registerShape(constants.SHAPE_SWIMLANE, s.Swimlane)
registerShape(constants.SHAPE_IMAGE, s.ImageShape)
registerShape(constants.SHAPE_LABEL, s.Label)

export function registerShape(name: string, ctor: Renderer.ShapeClass) {
  Renderer.registerShape(name, ctor)
}
