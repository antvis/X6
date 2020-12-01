import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

graph.addEdge({
  source: { x: 240, y: 120 },
  target: { x: 420, y: 80 },
  vertices: [{ x: 320, y: 170 }],
  connector: { name: 'rounded' },
  attrs: {
    line: {
      sourceMarker: {
        tagName: 'path',
        d: 'M 20 -10 0 0 20 10 Z',
      },
      targetMarker: {
        tagName: 'path',
        d: 'M 20 -10 0 0 20 10 Z',
        strokeWidth: 2,
        fill: '#73d13d',
        stroke: '#237804',
      },
    },
  },
})
