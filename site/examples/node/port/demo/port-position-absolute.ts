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
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff',
          },
          text: {
            fontSize: 12,
            fill: '#888',
          },
        },
        // 文档：https://x6.antv.antgroup.com/api/registry/port-layout#absolute
        position: {
          name: 'absolute',
        },
      },
    },
    items: [
      {
        id: 'port1',
        group: 'group1',
        // 通过 args 指定绝对位置
        args: {
          x: 0,
          y: 60,
        },
        attrs: {
          text: { text: '{ x: 0, y: 60 }' },
        },
      },
      {
        id: 'port2',
        group: 'group1',
        // 通过 args 指定绝对位置和连接桩的旋转角度
        args: {
          x: 0.6,
          y: 32,
          angle: 45,
        },
        // 自定义连接桩渲染的 SVG
        markup: [
          {
            tagName: 'path',
            selector: 'path',
          },
        ],
        zIndex: 10,
        attrs: {
          path: {
            d: 'M -6 -8 L 0 8 L 6 -8 Z',
            magnet: true,
            fill: 'red',
          },
          text: {
            text: '{ x: 0.6, y: 32, angle: 45 }',
            fill: 'red',
          },
        },
      },
      {
        id: 'port3',
        group: 'group1',
        // 通过 args 指定绝对位置
        args: {
          x: '100%',
          y: '100%',
        },
        attrs: {
          text: { text: "{ x: '100%', y: '100%' }" },
        },
        label: {
          position: {
            name: 'right',
          },
        },
      },
    ],
  },
})
