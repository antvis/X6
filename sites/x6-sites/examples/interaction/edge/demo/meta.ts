import { Graph } from '@antv/x6'

const container = document.getElementById('container')
const graph = new Graph({
  container,
  grid: true,
  keyboard: true,
  connecting: {
    allowBlank: false,
  },
})

const source = graph.addNode({
  shape: 'rect',
  width: 120,
  height: 50,
  x: 120,
  y: 50,
  label: 'Hello',
  attrs: {
    body: {
      fill: '#efdbff',
      stroke: '#9254de',
      strokeWidth: 2,
    },
  },
})

graph.addNode({
  shape: 'rect',
  width: 120,
  height: 50,
  x: 500,
  y: 250,
  label: 'World',
  attrs: {
    body: {
      fill: '#ffd591',
      stroke: '#ffa940',
      strokeWidth: 2,
    },
  },
})

graph.bindKey('meta', () => {
  source.attr('body/magnet', true)
})

graph.on('edge:connected', () => {
  source.attr('body/magnet', false)
})
