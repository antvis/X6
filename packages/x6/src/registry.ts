// #region shape

import { ShapeRegistry } from './shape'
ShapeRegistry.register('rectangle', ShapeRegistry.Rectangle, true)
ShapeRegistry.register('ellipse', ShapeRegistry.Ellipse, true)
ShapeRegistry.register('doubleEllipse', ShapeRegistry.DoubleEllipse, true)
ShapeRegistry.register('triangle', ShapeRegistry.Triangle, true)
ShapeRegistry.register('hexagon', ShapeRegistry.Hexagon, true)
ShapeRegistry.register('cylinder', ShapeRegistry.Cylinder, true)
ShapeRegistry.register('rhombus', ShapeRegistry.Rhombus, true)
ShapeRegistry.register('actor', ShapeRegistry.Actor, true)
ShapeRegistry.register('cloud', ShapeRegistry.Cloud, true)
ShapeRegistry.register('line', ShapeRegistry.Line, true)
ShapeRegistry.register('image', ShapeRegistry.Image, true)
ShapeRegistry.register('label', ShapeRegistry.Label, true)
ShapeRegistry.register('swimlane', ShapeRegistry.Swimlane, true)
ShapeRegistry.register('connector', ShapeRegistry.Connector, true)
ShapeRegistry.register('arrow', ShapeRegistry.Arrow, true)
ShapeRegistry.register('arrowConnector', ShapeRegistry.ArrowConnector, true)
ShapeRegistry.register('html', ShapeRegistry.HTML, true)

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
