import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

graph.addEdge({
  source: { x: 310, y: 100 },
  target: { x: 380, y: 260 },
  vertices: [{ x: 320, y: 200 }],
  connector: { name: 'smooth' },
  markup: [
    {
      tagName: 'path',
      selector: 'line',
      attrs: {
        fill: 'none',
        pointerEvents: 'none',
      },
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    line: {
      connection: true,
      stroke: '#52c41a',
      strokeWidth: 20,
      strokeLinejoin: 'round',
      targetMarker: '',
    },
    label: {
      // textPath 教程：https://x6.antv.vision/zh/docs/api/registry/attr#textpath
      textPath: { selector: 'line', startOffset: '50%' },
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
      text: 'Label Along Path',
      fill: '#237804',
    },
  },
})
