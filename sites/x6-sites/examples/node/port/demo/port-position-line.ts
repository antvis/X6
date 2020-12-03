import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

graph.addNode({
  x: 100,
  y: 60,
  width: 280,
  height: 120,
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'path',
      selector: 'line',
    },
  ],
  attrs: {
    body: {
      refWidth: '100%',
      refHeight: '100%',
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
      strokeWidth: 1,
    },
    line: {
      d: 'M 0 0 280 120',
      stroke: '#73d13d',
      strokeWidth: 1,
      strokeDasharray: '5 5',
    },
  },
  ports: {
    groups: {
      group1: {
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
        position: {
          name: 'line',
          args: {
            start: { x: 0, y: 0 },
            end: { x: 280, y: 120 },
          },
        },
      },
    },
    items: [
      {
        id: 'port1',
        group: 'group1',
      },
      {
        id: 'port2',
        group: 'group1',
        args: { angle: 45 },
        markup: [
          {
            tagName: 'path',
            selector: 'path',
          },
        ],
        attrs: {
          path: { d: 'M -6 -8 L 0 8 L 6 -8 Z', magnet: true, fill: 'red' },
        },
      },
      {
        id: 'port3',
        group: 'group1',
      },
    ],
  },
})
