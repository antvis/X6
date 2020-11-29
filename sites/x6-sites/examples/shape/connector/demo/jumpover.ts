import { Graph } from '@antv/x6'

const container = document.getElementById('container')
const graph = new Graph({
  container: container,
  grid: 10,
})

const rect = graph.createNode({
  x: 100,
  y: 50,
  width: 70,
  height: 30,
  attrs: {
    body: {
      fill: '#ff7875',
      stroke: '#ff4d4f',
    },
    label: {
      text: 'rect',
      magnet: true,
      fill: '#ffffff',
    },
  },
})

for (let i = 0; i < 6; i += 1) {
  const source = rect.clone().translate(i * 100, i * 10)
  graph.addNode(source)

  const target = source.clone().translate(0, 200)
  graph.addNode(target)

  const edge = graph.createEdge({
    source,
    target,
  })

  if (i % 2 === 0) {
    edge.prop('connector', {
      name: 'jumpover',
      args: {
        type: 'gap',
      },
    })
    edge.attr('line/stroke', '#722ed1')
  }

  graph.addEdge(edge)
}

const crossRectA = rect.clone().position(16, 100)
graph.addNode(crossRectA)

const crossRectB = rect.clone().position(16, 200)
graph.addNode(crossRectB)

graph.addEdge({
  source: crossRectA,
  target: crossRectB,
  connector: {
    name: 'jumpover',
  },
  attrs: {
    line: {
      stroke: '#722ed1',
    },
  },
  vertices: [
    {
      x: 700,
      y: 190,
    },
    {
      x: 700,
      y: 280,
    },
  ],
})
