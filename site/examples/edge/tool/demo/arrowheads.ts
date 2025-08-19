import { Graph, Shape } from '@antv/x6'

Shape.Rect.config({
  attrs: {
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
      strokeWidth: 1,
    },
  },
  ports: {
    groups: {
      in: {
        position: { name: 'top' },
      },
      out: {
        position: { name: 'bottom' },
      },
    },
  },
  portMarkup: [
    {
      tagName: 'circle',
      selector: 'portBody',
      attrs: {
        r: 5,
        magnet: true,
        stroke: '#31d0c6',
        fill: '#fff',
        strokeWidth: 2,
      },
    },
  ],
})

const magnetAvailabilityHighlighter = {
  name: 'stroke',
  args: {
    padding: 3,
    attrs: {
      strokeWidth: 3,
      stroke: '#52c41a',
    },
  },
}

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
  highlighting: {
    magnetAvailable: magnetAvailabilityHighlighter,
  },
  connecting: {
    snap: true,
    allowBlank: false,
    allowLoop: false,
    allowNode: false,
    highlight: true,
    validateMagnet({ magnet }) {
      return magnet.getAttribute('port-group') !== 'in'
    },

    validateConnection({ sourceMagnet, targetMagnet }) {
      // 只能从输出连接桩创建连接
      if (!sourceMagnet || sourceMagnet.getAttribute('port-group') === 'in') {
        return false
      }

      // 只能连接到输入连接桩
      if (!targetMagnet || targetMagnet.getAttribute('port-group') !== 'in') {
        return false
      }

      return true
    },
  },
})

const source = graph.addNode({
  x: 40,
  y: 40,
  width: 100,
  height: 40,
  ports: [
    { id: 'in-1', group: 'in' },
    { id: 'in-2', group: 'in' },
    { id: 'out-1', group: 'out' },
    { id: 'out-2', group: 'out' },
  ],
})

const target = graph.addNode({
  x: 140,
  y: 240,
  width: 100,
  height: 40,
  ports: [
    { id: 'in-1', group: 'in' },
    { id: 'in-2', group: 'in' },
    { id: 'out-1', group: 'out' },
    { id: 'out-2', group: 'out' },
  ],
})

graph.addNode({
  x: 320,
  y: 120,
  width: 100,
  height: 40,
  ports: [
    { id: 'in-1', group: 'in' },
    { id: 'in-2', group: 'in' },
    { id: 'out-1', group: 'out' },
    { id: 'out-2', group: 'out' },
  ],
})

graph.addEdge({
  source: { cell: source.id, port: 'out-2' },
  target: { cell: target.id, port: 'in-1' },
})

graph.on('edge:mouseenter', ({ cell }) => {
  cell.addTools([
    {
      name: 'source-arrowhead',
    },
    {
      name: 'target-arrowhead',
      args: {
        attrs: {
          fill: 'red',
        },
      },
    },
  ])
})

graph.on('edge:mouseleave', ({ cell }) => {
  cell.removeTools()
})
