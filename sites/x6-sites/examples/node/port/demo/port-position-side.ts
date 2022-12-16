import { Graph } from '@antv/x6'

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
    label: {
      text: 'left',
      fill: '#888',
      fontSize: 12,
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
        // 文档：https://x6.antv.vision/zh/docs/api/registry/port-layout#left-right-top-bottom
        position: {
          name: 'left',
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
          path: {
            d: 'M -6 -8 L 0 8 L 6 -8 Z',
            magnet: true,
            fill: 'red',
          },
        },
      },
      {
        id: 'port3',
        group: 'group1',
      },
    ],
  },
})

const sides = ['left', 'top', 'right', 'bottom']
let index = 0

function run() {
  index += 1
  if (index === sides.length) {
    index = 0
  }

  rect.prop('ports/groups/group1/position', {
    name: sides[index],
  })
  rect.attr('label/text', sides[index])

  setTimeout(run, 1000)
}

run()
