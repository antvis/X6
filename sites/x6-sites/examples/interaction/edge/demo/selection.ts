import { Graph, Cell } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container')!,
  width: 800,
  height: 600,
  grid: true,
  selecting: true,
})

const source = graph.addNode({
  shape: 'rect',
  x: 80,
  y: 80,
  width: 100,
  height: 40,
  attrs: {
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
    },
  },
})

const target = graph.addNode({
  shape: 'rect',
  x: 320,
  y: 320,
  width: 100,
  height: 40,
  attrs: {
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
    },
  },
})

graph.addEdge({
  source,
  target,
  attrs: {
    line: {
      stroke: '#d9d9d9',
    }
  }
})

graph.on('selection:changed', (args: {
  added: Cell[],
  removed: Cell[],
  selected: Cell[],
}) => {
  args.added.forEach((cell: Cell) => {
    if (cell.isNode()) {
      cell.attr('body', {
        fill: '#ffd591',
        stroke: '#ffa940',
      })
    } else {
      cell.attr('line/stroke', '#ffa940')
    }
  })
  args.removed.forEach((cell: Cell) => {
    if (cell.isNode()) {
      cell.attr('body', {
        fill: '#f5f5f5',
        stroke: '#d9d9d9',
      })
    } else {
      cell.attr('line/stroke', '#d9d9d9')
    }
  })
})