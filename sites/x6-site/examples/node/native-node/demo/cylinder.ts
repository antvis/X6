import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

graph.addNode({
  shape: 'cylinder',
  x: 320,
  y: 120,
  width: 80,
  height: 120,
  label: 'cylinder',
  attrs: {
    top: {
      fill: '#fe854f',
      fillOpacity: 0.5,
    },
    body: {
      fill: '#ED8A19',
      fillOpacity: 0.8,
    },
  },
})
