import { Graph, Shape } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})
graph.addEdge({
  source: { x: 60, y: 60 },
  target: { x: 240, y: 60 },
  attrs: {
    line: {
      strokeDasharray: 5,
      strokeDashoffset: 0,
    },
  },
  animation: [
    [
      { 'attrs/line/strokeDashoffset': -20 },
      {
        duration: 1000,
        iterations: Infinity,
      },
    ],
  ],
})

graph.addEdge({
  source: { x: 60, y: 120 },
  target: { x: 240, y: 120 },
  vertices: [{ x: 160, y: 140 }],
  connector: { name: 'smooth' },
  markup: [
    {
      tagName: 'circle',
      selector: 'marker',
      attrs: {
        stroke: 'none',
        r: 5,
      },
    },
    ...Shape.Edge.getMarkup(),
  ],
  attrs: {
    line: {
      strokeDasharray: 5,
      strokeDashoffset: 0,
      stroke: '#9DADCE',
    },
    marker: {
      fill: '#C7D5F6',
      atConnectionRatio: 0,
    },
  },
  animation: [
    [
      { 'attrs/marker/atConnectionRatio': 1 },
      {
        duration: 2000,
        iterations: Infinity,
      },
    ],
  ],
})

graph.addEdge({
  source: { x: 60, y: 180 },
  target: { x: 240, y: 180 },
  vertices: [{ x: 160, y: 200 }],
  connector: { name: 'smooth' },
  attrs: {
    line: {
      stroke: '#7d8fff',
      strokeWidth: 2,
      opacity: 0.6,
      style: {
        filter: 'drop-shadow(0 0 2px #7d8fff)',
      },
    },
  },
  animation: [
    [
      { 'attrs/line/strokeWidth': 4 },
      {
        duration: 2500,
        iterations: Infinity,
        direction: 'alternate',
        easing: 'ease-in-out-back',
      },
    ],
    [
      'attrs/line/opacity',
      1,
      {
        duration: 2500,
        iterations: Infinity,
        direction: 'alternate',
        easing: 'ease-in-out-back',
      },
    ],
  ],
})

graph.addEdge({
  source: { x: 60, y: 240 },
  target: { x: 240, y: 240 },
  vertices: [{ x: 160, y: 260 }],
  connector: { name: 'smooth' },
  markup: [
    {
      tagName: 'path',
      selector: 'line',
    },
  ],
  attrs: {
    line: {
      connection: true,
      strokeWidth: 8,
      strokeLinecap: 'round',
      targetMarker: null,
      strokeDasharray: '10,20',
      fill: 'none',
      stroke: {
        type: 'linearGradient',
        stops: [
          { offset: '0%', color: '#4874EE', opacity: 1 },
          { offset: '50%', color: '#f0f', opacity: 0.8 },
          { offset: '100%', color: '#DB655C' },
        ],
      },
    },
  },
  animation: [
    [
      {
        'attrs/line/opacity': [0.7, 1],
      },
      {
        duration: 1000,
        fill: 'forwards',
        direction: 'alternate',
        iterations: Infinity,
      },
    ],
    [
      {
        'attrs/line/strokeDashoffset': [30, 0],
      },
      {
        duration: 500,
        iterations: Infinity,
      },
    ],
  ],
})
