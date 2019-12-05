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

import { Marker } from './marker'

Marker.register('classic', Marker.createClassicMarker(2), true)
Marker.register('classicThin', Marker.createClassicMarker(3), true)
Marker.register('block', Marker.createClassicMarker(2), true)
Marker.register('blockThin', Marker.createClassicMarker(3), true)
Marker.register('open', Marker.createOpenMarker(2), true)
Marker.register('openThin', Marker.createOpenMarker(3), true)
Marker.register('diamond', Marker.diamond, true)
Marker.register('diamondThin', Marker.diamond, true)
Marker.register('oval', Marker.oval, true)
Marker.register('dash', Marker.dash, true)
Marker.register('cross', Marker.cross, true)
Marker.register('async', Marker.async, true)
Marker.register('openAsync', Marker.createOpenAsyncMarker(2), true)
Marker.register('circle', Marker.circle, true)
Marker.register('circlePlus', Marker.circlePlus, true)
Marker.register('halfCircle', Marker.halfCircle, true)

import { Route } from './route'

Route.register('er', Route.er, true)
Route.register('loop', Route.loop, true)
Route.register('orth', Route.orth, true)
Route.register('segment', Route.segment, true)
Route.register('elbow', Route.elbow, true)
Route.register('sideToSide', Route.sideToSide, true)
Route.register('topToBottom', Route.topToBottom, true)

import { Perimeter } from './perimeter'

Perimeter.register('ellipse', Perimeter.ellipse, true)
Perimeter.register('rectangle', Perimeter.rectangle, true)
Perimeter.register('rhombus', Perimeter.rhombus, true)
Perimeter.register('triangle', Perimeter.triangle, true)
Perimeter.register('hexagon', Perimeter.hexagon, true)
