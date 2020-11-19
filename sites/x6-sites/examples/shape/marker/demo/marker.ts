import { Graph } from '@antv/x6'

const container = document.getElementById('container')
const graph = new Graph({
  container: container,
})

graph.addNode({
  id: 'a',
  label: 'left',
  shape: 'rect',
  width: 80,
  height: 300,
  x: 100,
  y: 100,
  ports: {
    groups: {
      right: {
        position: 'right',
      },
    },
    items: [
      { id: 'p1', group: 'right' },
      { id: 'p2', group: 'right' },
      { id: 'p3', group: 'right' },
      { id: 'p4', group: 'right' },
      { id: 'p5', group: 'right' },
      { id: 'p6', group: 'right' },
      { id: 'p7', group: 'right' },
      { id: 'p8', group: 'right' },
    ],
  },
  attrs: {
    body: {
      fill: '#b37feb',
      stroke: '#9254de',
    },
    text: {
      fill: '#ffffff',
    },
  },
})

graph.addNode({
  id: 'b',
  label: 'right',
  shape: 'rect',
  width: 80,
  height: 300,
  x: 500,
  y: 100,
  ports: {
    groups: {
      left: {
        position: 'left',
      },
    },
    items: [
      { id: 'p9', group: 'left' },
      { id: 'p10', group: 'left' },
      { id: 'p11', group: 'left' },
      { id: 'p12', group: 'left' },
      { id: 'p13', group: 'left' },
      { id: 'p14', group: 'left' },
      { id: 'p15', group: 'left' },
      { id: 'p16', group: 'left' },
    ],
  },
  attrs: {
    body: {
      fill: '#ff85c0',
      stroke: '#f759ab',
    },
    text: {
      fill: '#ffffff',
    },
  },
})

const types = [
  'block',
  'classic',
  'diamond',
  'circle',
  'circlePlus',
  'ellipse',
  'cross',
  'async',
]
types.forEach((type, index) => {
  graph.addEdge({
    source: {
      cell: 'a',
      port: `p${index + 1}`,
    },
    target: {
      cell: 'b',
      port: `p${index + 9}`,
    },
    attrs: {
      line: {
        targetMarker: type,
        stroke: '#002766',
      },
    },
    label: type,
  })
})
