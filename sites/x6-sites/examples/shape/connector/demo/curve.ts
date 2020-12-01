import { Graph, Path } from '@antv/x6'

Graph.registerConnector(
  'curve',
  (sourcePoint, targetPoint) => {
    const path = new Path()
    path.appendSegment(Path.createSegment('M', sourcePoint))
    path.appendSegment(
      Path.createSegment(
        'C',
        sourcePoint.x,
        sourcePoint.y + 180,
        targetPoint.x,
        targetPoint.y - 180,
        targetPoint.x,
        targetPoint.y,
      ),
    )
    return path.serialize()
  },
  true,
)

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

const source = graph.addNode({
  x: 120,
  y: 40,
  width: 100,
  height: 40,
  attrs: {
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
    },
  },
})

const target = graph.addNode({
  x: 400,
  y: 260,
  width: 100,
  height: 40,
  attrs: {
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
    },
  },
})

graph.addEdge({
  source: { cell: source, anchor: 'bottom', connectionPoint: 'anchor' },
  target: { cell: target, anchor: 'top', connectionPoint: 'anchor' },
  connector: { name: 'curve' },
  attrs: {
    line: {
      stroke: '#722ed1',
    },
  },
})
