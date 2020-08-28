import { Graph } from '@antv/x6'

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
