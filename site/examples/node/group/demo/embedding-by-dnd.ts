import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
  embedding: {
    enabled: true,
    findParent({ node }) {
      const bbox = node.getBBox()
      return this.getNodes().filter((node) => {
        const data = node.getData<any>()
        if (data && data.parent) {
          const targetBBox = node.getBBox()
          return bbox.isIntersectWithRect(targetBBox)
        }
        return false
      })
    },
  },
  highlighting: {
    embedding: {
      name: 'stroke',
      args: {
        padding: -1,
        attrs: {
          stroke: '#73d13d',
        },
      },
    },
  },
})

graph.addNode({
  x: 40,
  y: 140,
  width: 100,
  height: 50,
  label: 'Child\n(unembed)',
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

graph.addNode({
  x: 500,
  y: 100,
  width: 100,
  height: 50,
  label: 'Child\n(unembed)',
  zIndex: 10,
  attrs: {
    body: {
      stroke: 'none',
      fill: '#47C769',
    },
    label: {
      fill: '#fff',
      fontSize: 12,
    },
  },
})

graph.addNode({
  x: 200,
  y: 80,
  width: 240,
  height: 160,
  zIndex: 1,
  label: 'Parent',
  attrs: {
    body: {
      fill: '#fffbe6',
      stroke: '#ffe7ba',
    },
    label: {
      fontSize: 12,
    },
  },
  data: {
    parent: true,
  },
})

graph.on('node:change:parent', ({ node }) => {
  node.attr({
    label: {
      text: 'Child\n(embed)',
    },
  })
})
