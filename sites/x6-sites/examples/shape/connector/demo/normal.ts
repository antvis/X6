import { Graph } from '@antv/x6'

const container = document.getElementById('container')
const graph = new Graph({
  container,
  grid: true,
})

graph.addNode({
  id: 'a',
  shape: 'rect',
  width: 160,
  height: 80,
  x: 100,
  y: 100,
  attrs: {
    body: {
      fill: '#ff7875',
      stroke: '#ff4d4f',
    },
    text: {
      fill: '#ffffff',
    },
  },
})

graph.addNode({
  id: 'b',
  shape: 'rect',
  width: 160,
  height: 80,
  x: 500,
  y: 100,
  attrs: {
    body: {
      fill: '#ff9c6e',
      stroke: '#ff7a45',
    },
    text: {
      fill: '#ffffff',
    },
  },
})

graph.addEdge({
  source: 'a',
  target: 'b',
  connector: { name: 'normal' },
  attrs: {
    line: {
      stroke: '#722ed1',
    },
  },
})
