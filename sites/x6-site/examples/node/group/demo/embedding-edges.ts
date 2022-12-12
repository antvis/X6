import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

const source = graph.addNode({
  x: 80,
  y: 100,
  width: 80,
  height: 40,
  label: 'Child\n(source)',
  zIndex: 10,
  attrs: {
    body: {
      stroke: 'none',
      fill: '#3199FF',
    },
    label: {
      fill: '#fff',
      fontSize: 12,
    },
  },
})

const target = graph.addNode({
  x: 280,
  y: 80,
  width: 80,
  height: 40,
  label: 'Child\n(target)',
  zIndex: 10,
  attrs: {
    body: {
      stroke: 'none',
      fill: '#47C769',
    },
    label: {
      fill: '#fff',
      fontSize: 12,
    },
  },
})

const parent = graph.addNode({
  x: 40,
  y: 40,
  width: 360,
  height: 160,
  zIndex: 1,
  label: 'Parent\n(try to move me)',
  attrs: {
    label: {
      refY: 140,
      fontSize: 12,
    },
    body: {
      fill: '#fffbe6',
      stroke: '#ffe7ba',
    },
  },
})

parent.addChild(source)
parent.addChild(target)

graph.addEdge({
  source,
  target,
  vertices: [
    { x: 120, y: 60 },
    { x: 200, y: 100 },
  ],
})
