import { Graph } from '@antv/x6'
import '@antv/x6/es/index.css'

const container = document.getElementById('container')!
const graph = new Graph({
  container,
  grid: true,
})
graph.addNode({
  shape: 'image',
  x: 320,
  y: 240,
  width: 94,
  height: 28,
  imageUrl:
    'https://gw.alipayobjects.com/os/s/prod/antv/assets/image/logo-with-text-73b8a.svg',
})
