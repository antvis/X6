import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

const parent = graph.addNode({
  x: 40,
  y: 40,
  width: 240,
  height: 160,
  zIndex: 1,
  label: 'Parent\n(try to move me)',
  attrs: {
    label: {
      refY: 120,
      fontSize: 12,
    },
    body: {
      fill: '#fffbe6',
      stroke: '#ffe7ba',
    },
  },
})

const child1 = graph.addNode({
  x: 110,
  y: 80,
  width: 100,
  height: 50,
  label: 'Child\n(inside)',
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

const child2 = graph.createNode({
  x: 360,
  y: 80,
  width: 100,
  height: 50,
  label: 'Child\n(outside)',
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

parent.addChild(child1)
parent.addChild(child2)
