import { Graph, Dom, Point, Line, Registry, Polyline } from '@antv/x6'

const container = document.getElementById('container')!
const graph = new Graph({
  container: container,
  grid: 1,
  translating: {
    restrict: {
      x: 50,
      y: 50,
      width: 700,
      height: 500,
    },
  },
})

function createCircle(x: number, y: number, group: 'inner' | 'outer') {
  const node = graph.addNode({
    shape: 'circle',
    size: { width: 20, height: 20 },
    position: { x: x, y: y },
    group: group,
    attrs: {
      body: {
        strokeWidth: 3,
        fill: group === 'inner' ? '#af9bff' : '#31d0c6',
        stroke: group === 'inner' ? '#7c68fc' : '#009d93',
      },
    },
  })

  node.on('change:position', updateBoundaries)
}

function createBoundary(color: string) {
  var boundary = Dom.createVector('path').attr({
    fill: color,
    'fill-opacity': 0.2,
    stroke: color,
    'stroke-width': 3,
  })

  Dom.createVector(graph.view.stage).prepend(boundary)

  return boundary
}

function updateBoundaries() {
  var padding = 10

  var innerPoints = getPointsByGroup('inner', padding)
  var outerPoints = getPointsByGroup('outer', padding)

  var innerHullPoints = convexHullAlgorithm(innerPoints)
  var innerBoundaryPoints = getPaddedPoints(innerHullPoints, padding)
  var outerHullPoints = convexHullAlgorithm(
    outerPoints.concat(innerBoundaryPoints),
  )

  innerBoundary.attr('d', createData(innerHullPoints))
  outerBoundary.attr('d', createData(outerHullPoints))
}

function getPointsByGroup(group: 'inner' | 'outer', padding: number) {
  var node = graph.model.getNodes().filter((node) => {
    return node.getProp('group') === group
  })

  return node.reduce<Point[]>((memo, el) => {
    return memo.concat(getNodeCornerPoints(el, padding))
  }, [])
}

function getNodeCornerPoints(node: v1.Node, padding: number = 0) {
  var bbox = node.getBBox().inflate(padding)
  return [bbox.origin, bbox.bottomLeft, bbox.corner, bbox.topRight]
}

function getPaddedPoints(points: Point[], padding: number = 0) {
  return points.reduce<Point[]>((memo, point) => {
    memo.push(
      point.clone().translate(padding, padding),
      point.clone().translate(-padding, padding),
      point.clone().translate(padding, -padding),
      point.clone().translate(-padding, -padding),
    )
    return memo
  }, [])
}

function createData(points: Point[], radius?: number) {
  var origin = new Line(points[0], points[points.length - 1]).getCenter()
  return Registry.Connector.presets.rounded.call(this, origin, origin, points, {
    radius: radius || 30,
  })
}

function convexHullAlgorithm(points: Point[]) {
  return new Polyline(points).toHull().points
}

function random(max: number, min: number) {
  return Math.floor(Math.random() * (max - min)) + min
}

Array.from({ length: 10 }).forEach((_, i) => {
  var x = random(100, 700)
  var y = random(100, 500)
  createCircle(x, y, i % 3 === 0 ? 'inner' : 'outer')
})

// create boundaries around elements
var innerBoundary = createBoundary('#fe854f')
var outerBoundary = createBoundary('#feb663')

updateBoundaries()
