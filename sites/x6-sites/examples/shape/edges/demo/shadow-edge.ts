import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

graph.addEdge({
  shape: 'shadow-edge',
  source: { x: 320, y: 100 },
  target: { x: 380, y: 260 },
  vertices: [{ x: 320, y: 200 }],
  connector: { name: 'rounded' },
  attrs: {
    line: {
      stroke: '#52c41a',
      strokeWidth: 12,
      targetMarker: {
        tagName: 'path',
        stroke: 'none',
        d: 'M 0 -6 -6 0 0 6 z',
      },
      sourceMarker: {
        tagName: 'path',
        stroke: 'none',
        d: 'M -6 -6 0 0 -6 6 0 6 0 -6 z',
      },
    },
    shadow: {
      refX: -5,
      refY: 6,
      stroke: '#000000',
      strokeWidth: 12,
      targetMarker: {
        tagName: 'path',
        d: 'M 0 -6 -6 0 0 6 z',
        stroke: 'none',
      },
      sourceMarker: {
        tagName: 'path',
        stroke: 'none',
        d: 'M -6 -6 0 0 -6 6 0 6 0 -6 z',
      },
    },
  },
})
