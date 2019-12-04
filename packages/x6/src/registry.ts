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

import { Route } from './route'

Route.register('er', Route.er, true)
Route.register('loop', Route.loop, true)
Route.register('orth', Route.orth, true)
Route.register('segment', Route.segment, true)
Route.register('elbow', Route.elbow, true)
Route.register('sideToSide', Route.sideToSide, true)
Route.register('topToBottom', Route.topToBottom, true)

// #endregion

// #region perimeter

import { Perimeter } from './perimeter'

Perimeter.register('ellipse', Perimeter.ellipse, true)
Perimeter.register('rectangle', Perimeter.rectangle, true)
Perimeter.register('rhombus', Perimeter.rhombus, true)
Perimeter.register('triangle', Perimeter.triangle, true)
Perimeter.register('hexagon', Perimeter.hexagon, true)

// #endregion
