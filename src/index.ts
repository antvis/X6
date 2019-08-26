import * as util from './util'
import * as shapes from './shape'
import * as changes from './change'
import { ShapeName } from './struct'

export * from './version'
export * from './core'
export * from './struct'
export * from './stylesheet'
export * from './canvas'
export * from './common'
export * from './types'

export { util, shapes, changes }

export const registerShape = shapes.Shape.registerShape

registerShape(ShapeName.rectangle, shapes.RectangleShape)
registerShape(ShapeName.ellipse, shapes.Ellipse)
registerShape(ShapeName.doubleEllipse, shapes.DoubleEllipse)
registerShape(ShapeName.rhombus, shapes.Rhombus)
registerShape(ShapeName.cylinder, shapes.Cylinder)
registerShape(ShapeName.connector, shapes.Connector)
registerShape(ShapeName.actor, shapes.Actor)
registerShape(ShapeName.triangle, shapes.Triangle)
registerShape(ShapeName.hexagon, shapes.Hexagon)
registerShape(ShapeName.cloud, shapes.Cloud)
registerShape(ShapeName.line, shapes.Line)
registerShape(ShapeName.arrow, shapes.Arrow)
registerShape(ShapeName.arrowConnector, shapes.ArrowConnector)
registerShape(ShapeName.swimlane, shapes.Swimlane)
registerShape(ShapeName.image, shapes.ImageShape)
registerShape(ShapeName.label, shapes.Label)
