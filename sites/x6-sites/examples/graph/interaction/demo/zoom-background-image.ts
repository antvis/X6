import { Graph } from '@antv/x6'

const container = document.getElementById('container')
const graph = new Graph({
  container,
  grid: true,
  mousewheel: {
    enabled: true,
    modifiers: ['ctrl', 'meta'],
  },
  background: {
    image:
      'https://gw.alipayobjects.com/os/s/prod/antv/assets/image/logo-with-text-73b8a.svg',
    size: {
      width: 160,
      height: 120,
    },
    position: {
      x: 250,
      y: 150,
    },
  },
})

graph.on('scale', ({ sx, sy }) => {
  console.log(sx, sy)
})
