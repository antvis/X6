import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

// row 1
// -----
graph.addNode({
  shape: 'ellipse',
  x: 40,
  y: 40,
  width: 120,
  height: 60,
  label: 'ellipse',
})

graph.addNode({
  shape: 'ellipse',
  x: 200,
  y: 40,
  width: 120,
  height: 60,
  label: 'ellipse',
  attrs: {
    body: {
      fill: '#efdbff',
      stroke: '#9254de',
    },
  },
})

graph.addNode({
  shape: 'ellipse',
  x: 360,
  y: 40,
  width: 120,
  height: 60,
  label: 'ellipse',
  attrs: {
    body: {
      stroke: '#237804',
      fill: '#73d13d',
    },
  },
})

graph.addNode({
  shape: 'ellipse',
  x: 520,
  y: 40,
  width: 60,
  height: 60,
  label: 'ellipse',
  attrs: {
    body: {
      stroke: '#ffa940',
      fill: '#ffd591',
    },
  },
})

// row 2
// -----

graph.addNode({
  shape: 'ellipse',
  x: 40,
  y: 140,
  width: 120,
  height: 60,
  label: 'ellipse',
  attrs: {
    label: {
      refX: 16,
      refY: 16,
      textAnchor: 'start',
      textVerticalAnchor: 'top',
    },
  },
})

graph.addNode({
  shape: 'ellipse',
  x: 200,
  y: 140,
  width: 120,
  height: 60,
  label: 'ellipse',
  attrs: {
    body: {
      fill: '#efdbff',
      stroke: '#9254de',
    },
    label: {
      refX: 16,
      refY: 0.5,
      textAnchor: 'start',
      textVerticalAnchor: 'middle',
    },
  },
})

graph.addNode({
  shape: 'ellipse',
  x: 360,
  y: 140,
  width: 120,
  height: 60,
  label: 'ellipse',
  attrs: {
    body: {
      stroke: '#237804',
      fill: '#73d13d',
    },
    label: {
      refX: 16,
      refY: '100%',
      refY2: -16,
      textAnchor: 'start',
      textVerticalAnchor: 'bottom',
    },
  },
})

graph.addNode({
  shape: 'ellipse',
  x: 520,
  y: 140,
  width: 60,
  height: 60,
  label: 'ellipse',
  attrs: {
    body: {
      stroke: '#ffa940',
      fill: '#ffd591',
    },
    label: {
      refX: 0.5,
      refY: -4,
      textAnchor: 'middle',
      textVerticalAnchor: 'bottom',
    },
  },
})

// row 3
// -----

graph.addNode({
  shape: 'ellipse',
  x: 40,
  y: 240,
  width: 120,
  height: 60,
  label: 'ellipse',
  attrs: {
    label: {
      refX: 0.5,
      refY: 16,
      textAnchor: 'middle',
      textVerticalAnchor: 'top',
    },
  },
})

graph.addNode({
  shape: 'ellipse',
  x: 200,
  y: 240,
  width: 120,
  height: 60,
  label: 'ellipse',
  attrs: {
    body: {
      fill: '#efdbff',
      stroke: '#9254de',
    },
    label: {
      refX: 0.5,
      refY: 0.5,
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
    },
  },
})

graph.addNode({
  shape: 'ellipse',
  x: 360,
  y: 240,
  width: 120,
  height: 60,
  label: 'ellipse',
  attrs: {
    body: {
      stroke: '#237804',
      fill: '#73d13d',
    },
    label: {
      refX: 0.5,
      refY: '100%',
      refY2: -16,
      textAnchor: 'middle',
      textVerticalAnchor: 'bottom',
    },
  },
})

graph.addNode({
  shape: 'ellipse',
  x: 520,
  y: 240,
  width: 60,
  height: 60,
  label: 'ellipse',
  attrs: {
    body: {
      stroke: '#ffa940',
      fill: '#ffd591',
    },
    label: {
      refX: '100%',
      refX2: 4,
      refY: 0.5,
      textAnchor: 'start',
      textVerticalAnchor: 'middle',
    },
  },
})

// row 4
// -----

graph.addNode({
  shape: 'ellipse',
  x: 40,
  y: 340,
  width: 120,
  height: 60,
  label: 'ellipse',
  attrs: {
    label: {
      refX: '100%',
      refX2: -16,
      refY: 16,
      textAnchor: 'end',
      textVerticalAnchor: 'top',
    },
  },
})

graph.addNode({
  shape: 'ellipse',
  x: 200,
  y: 340,
  width: 120,
  height: 60,
  label: 'ellipse',
  attrs: {
    body: {
      fill: '#efdbff',
      stroke: '#9254de',
    },
    label: {
      refX: '100%',
      refX2: -16,
      refY: 0.5,
      textAnchor: 'end',
      textVerticalAnchor: 'middle',
    },
  },
})

graph.addNode({
  shape: 'ellipse',
  x: 360,
  y: 340,
  width: 120,
  height: 60,
  label: 'ellipse',
  attrs: {
    body: {
      stroke: '#237804',
      fill: '#73d13d',
    },
    label: {
      refX: '100%',
      refX2: -16,
      refY: '100%',
      refY2: -16,
      textAnchor: 'end',
      textVerticalAnchor: 'bottom',
    },
  },
})

graph.addNode({
  shape: 'ellipse',
  x: 520,
  y: 340,
  width: 60,
  height: 60,
  label: 'ellipse',
  attrs: {
    body: {
      stroke: '#ffa940',
      fill: '#ffd591',
    },
    label: {
      refX: 0.5,
      refY: '100%',
      refY2: 4,
      textAnchor: 'middle',
      textVerticalAnchor: 'top',
    },
  },
})
