import { Graph, Cell, Shape } from '@antv/x6'

const LINE_HEIGHT = 24
const NODE_WIDTH = 150

Graph.registerPortLayout(
  'erPortPosition',
  (portsPositionArgs) => {
    return portsPositionArgs.map((_, index) => {
      return {
        position: {
          x: 0,
          y: (index + 1) * LINE_HEIGHT,
        },
        angle: 0,
      }
    })
  },
  true,
)

Graph.registerNode(
  'er-rect',
  {
    inherit: 'rect',
    markup: [
      {
        tagName: 'rect',
        selector: 'body',
      },
      {
        tagName: 'text',
        selector: 'label',
      },
    ],
    attrs: {
      rect: {
        strokeWidth: 1,
        stroke: '#5F95FF',
        fill: '#5F95FF',
      },
      label: {
        fontWeight: 'bold',
        fill: '#ffffff',
        fontSize: 12,
      },
    },
    ports: {
      groups: {
        list: {
          markup: [
            {
              tagName: 'rect',
              selector: 'portBody',
            },
            {
              tagName: 'text',
              selector: 'portNameLabel',
            },
            {
              tagName: 'text',
              selector: 'portTypeLabel',
            },
          ],
          attrs: {
            portBody: {
              width: NODE_WIDTH,
              height: LINE_HEIGHT,
              strokeWidth: 1,
              stroke: '#5F95FF',
              fill: '#EFF4FF',
              magnet: true,
            },
            portNameLabel: {
              ref: 'portBody',
              refX: 6,
              refY: 6,
              fontSize: 10,
            },
            portTypeLabel: {
              ref: 'portBody',
              refX: 95,
              refY: 6,
              fontSize: 10,
            },
          },
          position: 'erPortPosition',
        },
      },
    },
  },
  true,
)

const graph = new Graph({
  container: document.getElementById('container')!,
  connecting: {
    router: {
      name: 'er',
      args: {
        offset: 25,
        direction: 'H',
      },
    },
    createEdge() {
      return new Shape.Edge({
        attrs: {
          line: {
            stroke: '#A2B1C3',
            strokeWidth: 2,
          },
        },
      })
    },
  },
})

fetch('/data/er.json')
  .then((response) => response.json())
  .then((data) => {
    const cells: Cell[] = []
    data.forEach((item: any) => {
      if (item.shape === 'edge') {
        cells.push(graph.createEdge(item))
      } else {
        cells.push(graph.createNode(item))
      }
    })
    graph.resetCells(cells)
    graph.zoomToFit({ padding: 10, maxScale: 1 })
  })
