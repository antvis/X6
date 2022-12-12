import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

graph.addEdge({
  source: { x: 320, y: 100 },
  target: { x: 380, y: 260 },
  vertices: [{ x: 320, y: 200 }],
  markup: [
    {
      tagName: 'path',
      selector: 'stroke',
    },
    {
      tagName: 'path',
      selector: 'fill',
    },
  ],
  connector: { name: 'rounded' },
  attrs: {
    fill: {
      connection: true,
      strokeWidth: 12,
      strokeLinecap: 'round',
      fill: 'none',
      // 渐变使用教程：https://x6.antv.vision/zh/docs/api/registry/attr#fill
      stroke: {
        type: 'linearGradient',
        stops: [
          { offset: '0%', color: '#ccc' },
          { offset: '50%', color: '#73d13d' },
          { offset: '100%', color: '#ccc' },
        ],
      },
    },
    stroke: {
      fill: 'none',
      stroke: '#237804',
      connection: true,
      strokeWidth: 14,
      strokeLinecap: 'round',
    },
  },
})
