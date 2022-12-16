import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

graph.addNode({
  id: 'a',
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

graph.addNode({
  id: 'b',
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
  source: 'a',
  target: 'b',
  vertices: [
    { x: 200, y: 200 },
    { x: 380, y: 120 },
  ],
  // https://x6.antv.vision/zh/docs/api/registry/connector#normal
  connector: { name: 'normal' },
  attrs: {
    line: {
      stroke: '#722ed1',
    },
  },
})
