import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
  translating: {
    restrict(view) {
      const cell = view.cell
      if (cell.isNode()) {
        const parent = cell.getParent()
        if (parent) {
          return parent.getBBox()
        }
      }

      return null
    },
  },
})

const child = graph.addNode({
  x: 120,
  y: 80,
  width: 80,
  height: 40,
  label: 'Child',
  zIndex: 10,
  attrs: {
    body: {
      stroke: 'none',
      fill: '#3199FF',
    },
    label: {
      fill: '#fff',
      fontSize: 12,
    },
  },
})

const parent = graph.addNode({
  x: 40,
  y: 40,
  width: 240,
  height: 160,
  zIndex: 1,
  label: 'Parent\n(try to move me)',
  attrs: {
    label: {
      refY: 120,
      fontSize: 12,
    },
    body: {
      fill: '#fffbe6',
      stroke: '#ffe7ba',
    },
  },
})

parent.addChild(child)
