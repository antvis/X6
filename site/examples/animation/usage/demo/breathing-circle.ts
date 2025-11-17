import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

const palette = ['#3875f6', '#efb041', '#ec5b56', '#72c240']
const radius = 30

palette.forEach((color, index) => {
  graph.addNode({
    shape: 'circle',
    width: radius * 2,
    height: radius * 2,
    x: index % 2 === 0 ? 0 : 300,
    y: index < 2 ? 0 : 300,
    markup: [
      {
        tagName: 'circle',
        selector: 'wrapper',
      },
      {
        tagName: 'circle',
        selector: 'body',
      },
    ],
    attrs: {
      body: {
        fill: color,
        strokeWidth: 0,
      },
      wrapper: {
        r: radius,
        cx: radius,
        cy: radius,
        fill: color,
        opacity: 0.4,
        strokeWidth: 0,
      },
    },
    animation: [
      [
        {
          'attrs/wrapper/r': radius + 10,
        },
        {
          duration: 1000,
          direction: 'alternate',
          iterations: Infinity,
        },
      ],
    ],
  })
})

graph.centerContent()
