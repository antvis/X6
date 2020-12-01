import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

graph.addEdge({
  shape: 'double-edge',
  source: { x: 320, y: 100 },
  target: { x: 380, y: 260 },
  vertices: [{ x: 320, y: 200 }],
  connector: { name: 'rounded' },
  attrs: {
    line: {
      strokeWidth: 8,
      stroke: '#73d13d',
      targetMarker: {
        tagName: 'path',
        stroke: '#237804',
        strokeWidth: 2,
        d: 'M 0 -4 0 -10 -12 0 0 10 0 4',
      },
    },
    outline: {
      stroke: '#237804',
      strokeWidth: 12,
    },
  },
})
