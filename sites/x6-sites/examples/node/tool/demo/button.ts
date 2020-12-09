import { Graph, Cell, Color } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

const source = graph.addNode({
  x: 180,
  y: 60,
  width: 100,
  height: 40,
  attrs: {
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
      strokeWidth: 1,
    },
  },
  tools: [
    {
      name: 'button',
      args: {
        markup: [
          {
            tagName: 'circle',
            selector: 'button',
            attrs: {
              r: 14,
              stroke: '#fe854f',
              strokeWidth: 2,
              fill: 'white',
              cursor: 'pointer',
            },
          },
          {
            tagName: 'text',
            textContent: 'Btn',
            selector: 'icon',
            attrs: {
              fill: '#fe854f',
              fontSize: 10,
              textAnchor: 'middle',
              pointerEvents: 'none',
              y: '0.3em',
            },
          },
        ],
        x: '100%',
        y: '100%',
        offset: { x: -20, y: -20 },
        onClick({ cell }: { cell: Cell }) {
          const fill = Color.randomHex()
          cell.attr({
            body: {
              fill,
            },
            label: {
              fill: Color.invert(fill, true),
            },
          })
        },
      },
    },
  ],
})

const target = graph.addNode({
  x: 320,
  y: 250,
  width: 100,
  height: 40,
  attrs: {
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
      strokeWidth: 1,
    },
  },
})

graph.addEdge({
  source,
  target,
  attrs: {
    line: {
      stroke: '#a0a0a0',
      strokeWidth: 1,
      targetMarker: {
        name: 'classic',
        size: 7,
      },
    },
  },
})

graph.on('node:mouseenter', ({ node }) => {
  if (node === target) {
    node.addTools({
      name: 'button',
      args: {
        markup: [
          {
            tagName: 'circle',
            selector: 'button',
            attrs: {
              r: 14,
              stroke: '#fe854f',
              strokeWidth: 2,
              fill: 'white',
              cursor: 'pointer',
            },
          },
          {
            tagName: 'text',
            textContent: 'Btn',
            selector: 'icon',
            attrs: {
              fill: '#fe854f',
              fontSize: 10,
              textAnchor: 'middle',
              pointerEvents: 'none',
              y: '0.3em',
            },
          },
        ],
        x: 0,
        y: 0,
        offset: { x: 20, y: 20 },
        onClick({ cell }: { cell: Cell }) {
          cell.attr({
            body: {
              stroke: Color.randomHex(),
              strokeDasharray: '5, 1',
              strokeDashoffset:
                (cell.attr<number>('line/strokeDashoffset') | 0) + 20,
            },
          })
        },
      },
    })
  }
})

graph.on('node:mouseleave', ({ cell }) => {
  if (cell === target) {
    cell.removeTools()
  }
})
