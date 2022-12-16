import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

const source = graph.addNode({
  x: 180,
  y: 60,
  width: 100,
  height: 40,
  attrs: {
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
      strokeWidth: 1,
    },
  },
  tools: [
    {
      name: 'boundary',
      args: {
        padding: 5,
        attrs: {
          fill: '#7c68fc',
          stroke: '#9254de',
          strokeWidth: 1,
          fillOpacity: 0.2,
        },
      },
    },
  ],
})

const target = graph.addNode({
  x: 320,
  y: 250,
  width: 100,
  height: 40,
  attrs: {
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
      strokeWidth: 1,
    },
  },
})

graph.addEdge({
  source,
  target,
  attrs: {
    line: {
      stroke: '#a0a0a0',
      strokeWidth: 1,
      targetMarker: {
        name: 'classic',
        size: 7,
      },
    },
  },
})

graph.on('node:mouseenter', ({ node }) => {
  if (node === target) {
    node.addTools({
      name: 'boundary',
      args: {
        attrs: {
          fill: '#7c68fc',
          stroke: '#9254de',
          strokeWidth: 1,
          fillOpacity: 0.2,
        },
      },
    })
  }
})

graph.on('node:mouseleave', ({ node }) => {
  if (node === target) {
    node.removeTools()
  }
})
