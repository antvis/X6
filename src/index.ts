import * as util from './util'
import * as shapes from './shape'
import * as changes from './change'
import { Shapes } from './struct'

export * from './version'
export * from './core'
export * from './struct'
export * from './stylesheet'
export * from './canvas'
export * from './common'
export * from './types'

export { util, shapes, changes }

export const registerShape = shapes.Shape.registerShape

registerShape(Shapes.rectangle, shapes.RectangleShape)
registerShape(Shapes.ellipse, shapes.EllipseShape)
registerShape(Shapes.doubleEllipse, shapes.DoubleEllipse)
registerShape(Shapes.rhombus, shapes.Rhombus)
registerShape(Shapes.cylinder, shapes.Cylinder)
registerShape(Shapes.connector, shapes.Connector)
registerShape(Shapes.actor, shapes.Actor)
registerShape(Shapes.triangle, shapes.Triangle)
registerShape(Shapes.hexagon, shapes.Hexagon)
registerShape(Shapes.cloud, shapes.Cloud)
registerShape(Shapes.line, shapes.Line)
registerShape(Shapes.arrow, shapes.Arrow)
registerShape(Shapes.arrowConnector, shapes.ArrowConnector)
registerShape(Shapes.swimlane, shapes.Swimlane)
registerShape(Shapes.image, shapes.ImageShape)
registerShape(Shapes.label, shapes.Label)
