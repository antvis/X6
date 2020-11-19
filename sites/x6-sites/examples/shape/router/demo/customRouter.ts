import { Graph, Point, Registry } from '@antv/x6'

if (!Registry.Router.registry.exist('random')) {
  Graph.registerRouter('random', (vertices, args, view) => {
    const BOUNCES = args.bounces || 20
    const points = vertices.map((p) => Point.create(p))

    for (var i = 0; i < BOUNCES; i++) {
      const sourceCorner = view.sourceBBox.getCenter()
      const targetCorner = view.targetBBox.getCenter()
      const randomPoint = Point.random(
        sourceCorner.x,
        targetCorner.x,
        sourceCorner.y,
        targetCorner.y,
      )
      points.push(randomPoint)
    }

    return points
  })
}

const container = document.getElementById('container')
const graph = new Graph({
  container: container,
  grid: 10,
})

const source = graph.addNode({
  x: 50,
  y: 50,
  width: 120,
  height: 80,
  attrs: {
    body: {
      fill: '#ff7875',
      stroke: '#ff4d4f',
    },
    label: { text: 'Source' },
  },
})

const target = graph.addNode(
  source.clone().translate(600, 400).attr('label/text', 'Target'),
)

graph.addEdge({
  source,
  target,
  router: {
    name: 'random',
    args: {
      bounces: 10,
    },
  },
})
