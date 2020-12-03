import { Graph } from '@antv/x6'
import insertCss from '../../edge/demo/node_modules/insert-css'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

const switchCenter = {
  x: 35,
  y: -2,
}
const switchOpen = `rotate(-30 ${switchCenter.x} ${switchCenter.y})`
const switchClose = `rotate(-12 ${switchCenter.x} ${switchCenter.y})`

graph.addNode({
  x: 320,
  y: 120,
  markup: [
    {
      tagName: 'g',
      selector: 'left-group',
      children: [
        {
          tagName: 'rect',
          selector: 'left',
          groupSelector: 'line',
          attrs: {
            x: 0,
            y: 0,
          },
        },
        {
          tagName: 'circle',
          selector: 'lco',
          groupSelector: 'co',
          attrs: {
            cx: 30,
          },
        },
        {
          tagName: 'circle',
          selector: 'lci',
          groupSelector: 'ci',
          attrs: {
            cx: 30,
          },
        },
      ],
    },
    {
      tagName: 'rect',
      selector: 'switch',
      groupSelector: 'line',
    },
    {
      tagName: 'g',
      selector: 'right-group',
      children: [
        {
          tagName: 'rect',
          selector: 'right',
          groupSelector: 'line',
          attrs: {
            x: 70,
            y: 0,
          },
        },
        {
          tagName: 'circle',
          selector: 'rco',
          groupSelector: 'co',
          attrs: {
            cx: 70,
          },
        },
        {
          tagName: 'circle',
          selector: 'rci',
          groupSelector: 'ci',
          attrs: {
            cx: 70,
          },
        },
      ],
    },
  ],
  attrs: {
    line: {
      width: 30,
      height: 2,
      fill: '#000',
      stroke: '#000',
    },
    co: {
      r: 8,
      fill: '#000',
    },
    ci: {
      r: 4,
      fill: '#fff',
    },
    switch: {
      ...switchCenter,
      width: 35,
      transform: switchOpen,
    },
  },
})

graph.on('node:click', ({ node }) => {
  const attrPath = 'attrs/switch/transform'
  const current = node.prop(attrPath)
  const target = current === switchOpen ? switchClose : switchOpen

  node.transition(attrPath, target, {
    interp: (a: string, b: string) => {
      const reg = /-?\d+/g
      const start = parseInt(a.match(reg)![0], 10)
      const end = parseInt(b.match(reg)![0], 10)
      const d = end - start
      return (t: number) => {
        return `rotate(${start + d * t} ${switchCenter.x} ${switchCenter.y})`
      }
    },
  })
})

// 我们用 insert-css 插入自定义样式，实际使用时请使用自己的样式定义方式
insertCss(`
  .x6-node {
    cursor: pointer;
  }
`)
