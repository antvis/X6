import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

const rect = graph.createNode({
  x: 140,
  y: 40,
  width: 70,
  height: 30,
  attrs: {
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
    },
  },
})

const source = graph.addNode(rect.clone().position(30, 90))
const target = graph.addNode(rect.clone().position(30, 170))

const edge = graph.addEdge({
  source,
  target,
  vertices: [
    { x: 640, y: 160 },
    { x: 640, y: 240 },
  ],
  attrs: {
    line: {
      stroke: '#722ed1',
    },
  },
})

for (let i = 0; i < 5; i += 1) {
  const source = graph.addNode(rect.clone().translate(i * 100, i * 10))
  const target = graph.addNode(source.clone().translate(0, 200))

  if (i % 2 === 0) {
    graph.addEdge({
      source,
      target,
      connector: {
        name: 'jumpover',
        args: {
          type: 'gap',
        },
      },
      attrs: {
        line: {
          stroke: '#faad14',
        },
      },
    })
  } else {
    graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#d9d9d9',
        },
      },
    })
  }
}

edge.setConnector('jumpover')
