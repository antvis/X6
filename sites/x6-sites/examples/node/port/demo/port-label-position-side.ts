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
      a: {
        position: {
          name: 'top',
        },
        label: {
          position: {
            name: 'left',
          },
        },
        attrs: {
          circle: {
            fill: '#fff',
            stroke: '#31d0c6',
            strokeWidth: 2,
            r: 8,
          },
          text: {
            fill: '#666',
            fontSize: 12,
          },
        },
      },
    },
  },
})

Array.from({ length: 3 }).forEach((_, index) => {
  const label =
    index === 2
      ? {
          position: { args: { x: 20, y: -20 } },
        }
      : {}
  const stroke = index === 2 ? { stroke: 'red' } : {}
  const fill = index === 2 ? { fill: 'red' } : {}
  rect.addPort({
    label,
    group: 'a',
    attrs: {
      circle: { magnet: true, ...stroke },
      text: { text: `P${index}`, ...fill },
    },
  })
})

const sides = ['left', 'top', 'right', 'bottom']
let index = 0

function run() {
  index += 1
  if (index === sides.length) {
    index = 0
  }

  rect.prop('ports/groups/a/label/position/name', sides[index])
  rect.attr('label/text', sides[index])

  setTimeout(run, 1000)
}

run()
