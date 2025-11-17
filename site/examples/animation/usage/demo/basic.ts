import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

graph.addNode({
  x: 40,
  y: 40,
  width: 100,
  height: 60,
  attrs: {
    body: {
      fill: '#efdbff',
      stroke: '#9254de',
      rx: 10,
    },
  },
  animation: [
    [
      { 'position/x': 50 },
      { duration: 1000, direction: 'alternate', iterations: Infinity },
    ],
  ],
})

graph.addNode({
  x: 200,
  y: 40,
  width: 100,
  height: 60,
  attrs: {
    body: {
      stroke: 'none',
      rx: 10,
    },
  },
  animation: [
    [
      { 'attrs/body/fill': ['#9254de', '#06b6d4'] },
      { duration: 3000, direction: 'alternate', iterations: Infinity },
    ],
  ],
})

graph.addNode({
  x: 360,
  y: 40,
  width: 60,
  height: 60,
  attrs: {
    body: {
      fill: '#efdbff',
      stroke: 'none',
      rx: 10,
    },
  },
  animation: [
    [
      {
        'size/width': 120,
      },
      {
        duration: 1000,
        direction: 'alternate',
        iterations: Infinity,
      },
    ],
  ],
})
