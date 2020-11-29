import { Graph } from '@antv/x6'

const container = document.getElementById('container')
const graph = new Graph({
  container: container,
  width: 800,
  height: 600,
  grid: 1,
  snapline: true,
})

graph.addNode({
  shape: 'rect',
  x: 50,
  y: 50,
  width: 100,
  height: 40,
  attrs: {
    body: {
      fill: '#ff9c6e',
      stroke: '#ff7a45',
    },
    label: {
      text: 'A',
    },
  },
})

graph.addNode({
  shape: 'circle',
  x: 250,
  y: 80,
  width: 50,
  height: 50,
  attrs: {
    body: {
      fill: '#d3f261',
      stroke: '#bae637',
    },
    label: {
      text: 'B',
    },
  },
})

graph.addNode({
  shape: 'ellipse',
  x: 350,
  y: 150,
  width: 80,
  height: 40,
  attrs: {
    body: {
      fill: '#5cdbd3',
      stroke: '#36cfc9',
    },
    label: {
      text: 'C',
    },
  },
})
