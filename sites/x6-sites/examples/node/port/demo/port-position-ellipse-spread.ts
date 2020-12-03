import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

const node = graph.addNode({
  x: 100,
  y: 60,
  width: 400,
  height: 200,
  shape: 'ellipse',
  attrs: {
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
      strokeWidth: 1,
    },
  },
  ports: {
    groups: {
      group1: {
        markup: [
          {
            tagName: 'rect',
            selector: 'rect',
          },
          {
            tagName: 'circle',
            selector: 'dot',
          },
        ],
        attrs: {
          rect: {
            magnet: true,
            stroke: '#31d0c6',
            fill: 'rgba(255,255,255,0.8)',
            strokeWidth: 2,
            width: 16,
            height: 16,
            x: -8,
            y: -8,
          },
          dot: {
            fill: '#fe854f',
            r: 2,
          },
          text: {
            fontSize: 12,
            fill: '#6a6c8a',
          },
        },
        // https://x6.antv.vision/zh/docs/api/registry/port-label-layout#radial
        label: {
          position: 'radial',
        },
        // https://x6.antv.vision/zh/docs/api/registry/port-layout#ellipsespread
        position: {
          name: 'ellipseSpread',
          args: {
            start: 45,
          },
        },
      },
    },
  },
})

Array.from({ length: 10 }).forEach((_, index) => {
  node.addPort({
    id: `${index}`,
    group: 'group1',
    attrs: { text: { text: index } },
  })
})

node.portProp('0', {
  attrs: {
    rect: { stroke: 'red' },
    dot: { fill: '#31d0c6' },
  },
})
