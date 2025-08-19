import { Graph } from '@antv/x6'

Graph.registerPortLayout(
  'sin',
  (portsPositionArgs, elemBBox) => {
    return portsPositionArgs.map((_, index) => {
      const step = -Math.PI / 8
      const y = Math.sin(index * step) * 50
      return {
        position: {
          x: index * 12,
          y: y + elemBBox.height,
        },
        angle: 0,
      }
    })
  },
  true,
)

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

const rect = graph.addNode({
  x: 100,
  y: 60,
  width: 280,
  height: 120,
  attrs: {
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
      strokeWidth: 1,
    },
  },
  ports: {
    groups: {
      sin: {
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
        position: 'sin',
      },
    },
  },
})

Array.from({ length: 24 }).forEach(() => {
  rect.addPort({ group: 'sin' })
})
