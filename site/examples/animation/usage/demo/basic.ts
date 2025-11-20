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
      fill: '#9254de',
      stroke: 'none',
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
      fill: '#85C054',
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

graph.addNode({
  x: 40,
  y: 160,
  width: 60,
  height: 60,
  attrs: {
    body: {
      fill: '#06b6d4',
      stroke: 'none',
      rx: 10,
    },
  },
  animation: [
    [
      {
        angle: 360,
      },
      {
        duration: 1000,
        iterations: Infinity,
      },
    ],
  ],
})

graph.addNode({
  x: 200,
  y: 160,
  width: 100,
  height: 60,
  attrs: {
    body: {
      fill: '#DB655C',
      stroke: 'none',
      rx: 10,
    },
  },
  animation: [
    [
      {
        'attrs/body/opacity': [0.5, 1],
      },
      {
        duration: 1000,
        direction: 'alternate',
        iterations: Infinity,
      },
    ],
  ],
})

graph.addNode({
  x: 360,
  y: 160,
  width: 100,
  height: 60,
  label: '文本',
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
        'attrs/text/fontSize': [10, 16],
      },
      {
        duration: 1000,
        direction: 'alternate',
        iterations: Infinity,
      },
    ],
  ],
})
