import { Graph, Path, Point, Registry } from '@antv/x6'

if (!Registry.Connector.registry.exist('wobble')) {
  Graph.registerConnector(
    'wobble',
    (sourcePoint, targetPoint, vertices, args) => {
      const spread = args.spread || 20
      const points = [...vertices, targetPoint].map((p) => Point.create(p))
      let prev = Point.create(sourcePoint)
      const path = new Path(Path.createSegment('M', prev))

      for (var i = 0, n = points.length; i < n; i += 1) {
        const next = points[i]
        const distance = prev.distance(next)
        let d = spread

        while (d < distance) {
          var current = prev.clone().move(next, -d)
          current.translate(
            Math.floor(7 * Math.random()) - 3,
            Math.floor(7 * Math.random()) - 3,
          )
          path.appendSegment(Path.createSegment('L', current))
          d += spread
        }

        path.appendSegment(Path.createSegment('L', next))
        prev = next
      }

      return path
    },
  )
}

const container = document.getElementById('container')!
const graph = new Graph({
  container: container,
  grid: 10,
})

const source = graph.addNode({
  shape: 'rect',
  x: 50,
  y: 50,
  width: 140,
  height: 70,
  attrs: {
    label: { text: 'Source' },
  },
})

const target = source.clone().translate(700, 400).attr('label/text', 'Target')
graph.addNode(target)

graph.addEdge({
  source,
  target,
  shape: 'edge',
  connector: {
    name: 'wobble',
    args: {
      spread: 10,
    },
  },
})
