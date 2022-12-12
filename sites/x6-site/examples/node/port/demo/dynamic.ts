import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

// 文档：https://x6.antv.vision/zh/docs/tutorial/basic/port

const rect = graph.addNode({
  x: 240,
  y: 60,
  width: 100,
  height: 180,
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
            fill: '#fff',
            strokeWidth: 2,
          },
        },
      },
    },
    items: [{ group: 'group1' }, { group: 'group1' }],
  },
})

const addPort = () => {
  rect.addPort({ group: 'group1' })
}

const removePort = () => {
  const ports = rect.getPorts()
  if (ports.length) {
    rect.removePortAt(ports.length - 1)
  }
}

const count = 5
let current = 0
let adding = true

const run = () => {
  if (adding && current === count) {
    adding = false
  }

  if (!adding && current === 0) {
    adding = true
  }

  if (adding && current < count) {
    addPort()
    current += 1
  }

  if (!adding && current > 0) {
    removePort()
    current -= 1
  }

  setTimeout(run, 1000)
}

run()
