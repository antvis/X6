import { Graph } from '@antv/x6'

Graph.registerNode(
  'my-rect',
  {
    inherit: 'rect',
    width: 120,
    height: 50,
    ports: {
      groups: {
        in: {
          position: 'top',
          label: {
            position: 'top',
          },
          attrs: {
            circle: {
              r: 6,
              magnet: true,
              stroke: '#31d0c6',
              strokeWidth: 2,
              fill: '#fff',
              style: {
                visibility: 'hidden',
              },
            },
          },
        },
        out: {
          position: 'bottom',
          label: {
            position: 'bottom',
          },
          attrs: {
            circle: {
              r: 6,
              magnet: true,
              stroke: '#31d0c6',
              strokeWidth: 2,
              fill: '#fff',
              style: {
                visibility: 'hidden',
              },
            },
          },
        },
      },
    },
  },
  true,
)

const container = document.getElementById('container')!
const graph = new Graph({
  container,
  grid: true,
  connecting: {
    anchor: 'center',
    connectionPoint: 'anchor',
  },
})

graph.addNode({
  shape: 'my-rect',
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
  ports: [
    {
      id: 'port1',
      group: 'in',
    },
    {
      id: 'port2',
      group: 'out',
    },
  ],
})

graph.addNode({
  shape: 'my-rect',
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
  ports: [
    {
      id: 'port1',
      group: 'in',
    },
    {
      id: 'port2',
      group: 'out',
    },
  ],
})

const changePortsVisible = (visible: boolean) => {
  const ports = container.querySelectorAll(
    '.x6-port-body',
  ) as NodeListOf<SVGAElement>
  for (let i = 0, len = ports.length; i < len; i = i + 1) {
    ports[i].style.visibility = visible ? 'visible' : 'hidden'
  }
}

graph.on('node:mouseenter', () => {
  changePortsVisible(true)
})

graph.on('node:mouseleave', () => {
  changePortsVisible(false)
})
