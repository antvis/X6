import { Graph } from '@antv/x6'

const container = document.getElementById('container')
const graph = new Graph({
  container: container,
  grid: true,
})

const rect1 = graph.addNode({
  x: 30,
  y: 30,
  width: 100,
  height: 40,
  label: 'hello',
  attrs: {
    body: {
      fill: '#ff7875',
      stroke: '#ff4d4f',
    },
  },
})

const rect2 = graph.addNode({
  x: 300,
  y: 240,
  width: 100,
  height: 40,
  label: 'world',
  attrs: {
    body: {
      fill: '#ff7875',
      stroke: '#ff4d4f',
    },
  },
})

graph.addEdge({
  source: rect1,
  target: rect2,
  router: {
    name: 'oneSide',
    args: {
      side: 'right',
      padding: 50,
    },
  },
})
