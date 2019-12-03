/* tslint:disable:variable-name */

import { Actor as ActorShape } from './actor'
import { ArrowConnector as ArrowConnectorShape } from './arrow-connector'
import { Arrow as ArrowShape } from './arrow'
import { Cloud as CloudShape } from './cloud'
import { Connector as ConnectorShape } from './connector'
import { Cylinder as CylinderShape } from './cylinder'
import { DoubleEllipse as DoubleEllipseShape } from './double-ellipse'
import { EllipseShape } from './ellipse'
import { Hexagon as HexagonShape } from './hexagon'
import { HtmlShape } from './html'
import { ImageShape } from './image'
import { Label as LabelShape } from './label'
import { Line as LineShape } from './line'
import { Polyline as PolylineShape } from './polyline'
import { RectangleShape } from './rectangle'
import { Rhombus as RhombusShape } from './rhombus'
import { Shape as ShapeBase } from './shape'
import { Stencil as StencilShape } from './stencil'
import { Swimlane as SwimlaneShape } from './swimlane'
import { Text as TextShape } from './text'
import { Triangle as TriangleShape } from './triangle'

export class ShapeRegistry extends ShapeBase {}

export namespace ShapeRegistry {
  export const Actor = ActorShape
  export const Arrow = ArrowShape
  export const ArrowConnector = ArrowConnectorShape
  export const Cloud = CloudShape
  export const Connector = ConnectorShape
  export const Cylinder = CylinderShape
  export const DoubleEllipse = DoubleEllipseShape
  export const Ellipse = EllipseShape
  export const Hexagon = HexagonShape
  export const HTML = HtmlShape
  export const Image = ImageShape
  export const Label = LabelShape
  export const Line = LineShape
  export const Polyline = PolylineShape
  export const Rectangle = RectangleShape
  export const Rhombus = RhombusShape
  export const Shape = ShapeBase
  export const Stencil = StencilShape
  export const Swimlane = SwimlaneShape
  export const Text = TextShape
  export const Triangle = TriangleShape
}
