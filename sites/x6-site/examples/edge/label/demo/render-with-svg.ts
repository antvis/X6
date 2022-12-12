import { Graph } from '@antv/x6'

Graph.registerEdge(
  'custom-edge-label',
  {
    inherit: 'edge',
    defaultLabel: {
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
        label: {
          fill: '#000',
          fontSize: 14,
          textAnchor: 'middle',
          textVerticalAnchor: 'middle',
          pointerEvents: 'none',
        },
        body: {
          ref: 'label',
          fill: '#ffd591',
          stroke: '#ffa940',
          strokeWidth: 2,
          rx: 4,
          ry: 4,
          refWidth: '140%',
          refHeight: '140%',
          refX: '-20%',
          refY: '-20%',
        },
      },
      position: {
        distance: 200,
        options: {
          absoluteDistance: true,
          reverseDistance: true,
        },
      },
    },
  },
  true,
)

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

graph.addEdge({
  source: [170, 160],
  target: [550, 160],
  shape: 'custom-edge-label',
  attrs: {
    line: {
      stroke: '#ccc',
    },
  },
  labels: [
    {
      attrs: {
        line: {
          stroke: '#73d13d',
        },
        text: {
          text: 'Custom Label',
        },
      },
    },
  ],
})
