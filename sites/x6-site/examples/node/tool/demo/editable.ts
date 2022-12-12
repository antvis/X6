import { Graph } from '@antv/x6'
import '../index.less'

const container = document.getElementById('container')!
const graph = new Graph({
  container: container,
  grid: true,
})

const source = graph.addNode({
  x: 180,
  y: 60,
  width: 100,
  height: 40,
  attrs: {
    body: {
      stroke: '#5F95FF',
      fill: '#EFF4FF',
      strokeWidth: 1,
    },
  },
})

const target = graph.addNode({
  x: 320,
  y: 250,
  width: 100,
  height: 40,
  attrs: {
    body: {
      stroke: '#5F95FF',
      fill: '#EFF4FF',
      strokeWidth: 1,
    },
  },
})

graph.addEdge({
  source,
  target,
  attrs: {
    line: {
      stroke: '#A2B1C3',
      strokeWidth: 2,
    },
  },
})

graph.on('cell:dblclick', ({ cell, e }) => {
  const isNode = cell.isNode()
  const name = cell.isNode() ? 'node-editor' : 'edge-editor'
  cell.removeTool(name)
  cell.addTools({
    name,
    args: {
      event: e,
      attrs: {
        backgroundColor: isNode ? '#EFF4FF' : '#FFF',
      },
    },
  })
})
