import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
  onToolItemCreated({ tool }) {
    const handle = tool as any
    const options = handle.options
    if (options && options.index % 2 === 1) {
      tool.setAttrs({ fill: 'red' })
    }
  },
})

graph.addEdge({
  source: { x: 40, y: 40 },
  target: { x: 380, y: 40 },
  vertices: [
    { x: 40, y: 80 },
    { x: 200, y: 80 },
    { x: 200, y: 40 },
  ],
  attrs: {
    line: {
      stroke: '#3c4260',
      strokeWidth: 2,
      targetMarker: 'classic',
    },
  },
  tools: {
    name: 'segments',
    args: {
      snapRadius: 20,
      attrs: {
        fill: '#444',
      },
    },
  },
})

graph.addEdge({
  source: { x: 40, y: 160 },
  target: { x: 380, y: 160 },
  vertices: [
    { x: 40, y: 200 },
    { x: 200, y: 200 },
    { x: 200, y: 160 },
  ],
  attrs: {
    line: {
      stroke: '#3c4260',
      strokeWidth: 2,
      targetMarker: 'classic',
    },
  },
  connector: 'smooth',
  tools: {
    name: 'segments',
    args: {
      snapRadius: 20,
      attrs: {
        fill: '#444',
      },
    },
  },
})
