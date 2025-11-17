import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

const palette = ['#3875f6', '#efb041', '#ec5b56', '#72c240']
const r = 30
const length = 5
const opacity = 0.4

palette.forEach((color, index) => {
  graph.addNode({
    shape: 'circle',
    width: r * 2,
    height: r * 2,
    x: index % 2 === 0 ? 0 : 300,
    y: index < 2 ? 0 : 300,
    markup: [
      ...Array.from({ length }).map((_, markupIndex) => {
        return {
          tagName: 'circle',
          selector: `ripple${markupIndex}`,
          groupSelector: 'rippleGroup',
        }
      }),
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
      rippleGroup: {
        cx: r,
        cy: r,
        fill: color,
        strokeWidth: 0,
      },
    },
    animation: Array.from({ length }).map((_, aniIndex) => [
      {
        [`attrs/ripple${aniIndex}/r`]: [r, r + length * 5],
        [`attrs/ripple${aniIndex}/opacity`]: [opacity, 0],
      },
      {
        duration: 1000 * length,
        iterations: Infinity,
        delay: 1000 * aniIndex,
      },
    ]),
  })
})

graph.centerContent()
