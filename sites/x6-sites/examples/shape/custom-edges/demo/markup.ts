import { Graph } from '@antv/x6'

Graph.registerEdge(
  'custom-edge',
  {
    inherit: 'edge',
    attrs: {
      line: {
        stroke: '#5755a1',
      },
    },
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
          fill: 'black',
          fontSize: 14,
          textAnchor: 'middle',
          textVerticalAnchor: 'middle',
          pointerEvents: 'none',
        },
        body: {
          ref: 'label',
          fill: 'white',
          stroke: '#5755a1',
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

const container = document.getElementById('container')
const graph = new Graph({
  container,
  grid: true,
})

graph.addEdge({
  shape: 'custom-edge',
  labels: [
    {
      attrs: {
        text: {
          text: 'Custom Edge',
        },
      },
    },
  ],
  source: [140, 240],
  target: [520, 240],
})
