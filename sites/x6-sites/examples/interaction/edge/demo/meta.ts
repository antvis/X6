import { Graph } from '@antv/x6'

const container = document.getElementById('container')
const graph = new Graph({
  container,
  grid: true,
  keyboard: {
    enabled: true,
  },
  connecting: {
    dangling: false,
  },
})

const source = graph.addNode({
  shape: 'rect',
  width: 120,
  height: 60,
  x: 100,
  y: 100,
  attrs: {
    body: {
      fill: '#ff7875',
      stroke: '#ff4d4f',
    },
    text: {
      fill: '#ffffff',
    },
  },
})

graph.addNode({
  shape: 'rect',
  width: 120,
  height: 60,
  x: 500,
  y: 200,
  attrs: {
    body: {
      fill: '#ff9c6e',
      stroke: '#ff7a45',
    },
    text: {
      fill: '#ffffff',
    },
  },
})

graph.bindKey('meta', () => {
  source.attr('body/magnet', true)
})

graph.on('edge:connected', () => {
  source.attr('body/magnet', false)
})
