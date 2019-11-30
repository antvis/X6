// #region shape

import * as shapes from './shape'
const registerShape = shapes.Shape.register
registerShape('rectangle', shapes.RectangleShape, true)
registerShape('ellipse', shapes.EllipseShape, true)
registerShape('doubleEllipse', shapes.DoubleEllipse, true)
registerShape('triangle', shapes.Triangle, true)
registerShape('hexagon', shapes.Hexagon, true)
registerShape('cylinder', shapes.Cylinder, true)
registerShape('rhombus', shapes.Rhombus, true)
registerShape('actor', shapes.Actor, true)
registerShape('cloud', shapes.Cloud, true)
registerShape('line', shapes.Line, true)
registerShape('image', shapes.ImageShape, true)
registerShape('label', shapes.Label, true)
registerShape('swimlane', shapes.Swimlane, true)
registerShape('connector', shapes.Connector, true)
registerShape('arrow', shapes.Arrow, true)
registerShape('arrowConnector', shapes.ArrowConnector, true)
registerShape('html', shapes.HtmlShape, true)

// #endregion

// #region marker

import {
  Marker,
  createClassicMarker,
  createOpenMarker,
  diamond,
  oval,
} from './marker'

Marker.register('classic', createClassicMarker(2), true)
Marker.register('classicThin', createClassicMarker(3), true)
Marker.register('block', createClassicMarker(2), true)
Marker.register('blockThin', createClassicMarker(3), true)
Marker.register('open', createOpenMarker(2), true)
Marker.register('openThin', createOpenMarker(3), true)
Marker.register('diamond', diamond, true)
Marker.register('diamondThin', diamond, true)
Marker.register('oval', oval, true)

// #endregion

// #region route

import {
  Route,
  er,
  loop,
  orth,
  segment,
  elbow,
  sideToSide,
  topToBottom,
} from './route'

Route.register('er', er, true)
Route.register('loop', loop, true)
Route.register('orth', orth, true)
Route.register('segment', segment, true)
Route.register('elbow', elbow, true)
Route.register('sideToSide', sideToSide, true)
Route.register('topToBottom', topToBottom, true)

// #endregion

// #region perimeter

import {
  Perimeter,
  rectanglePerimeter,
  ellipsePerimeter,
  trianglePerimeter,
  hexagonPerimeter,
  rhombusPerimeter,
} from './perimeter'

Perimeter.register('ellipse', ellipsePerimeter, true)
Perimeter.register('rectangle', rectanglePerimeter, true)
Perimeter.register('rhombus', rhombusPerimeter, true)
Perimeter.register('triangle', trianglePerimeter, true)
Perimeter.register('hexagon', hexagonPerimeter, true)

// #endregion
