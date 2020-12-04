import { Graph } from '@antv/x6'

Graph.registerEdge(
  'arrow',
  {
    markup: [
      {
        tagName: 'path',
        selector: 'wrap',
        attrs: {
          fill: 'none',
          cursor: 'pointer',
          stroke: 'transparent',
        },
      },
      {
        tagName: 'path',
        selector: 'line',
        attrs: {
          fill: 'none',
          'pointer-events': 'none',
        },
      },
      {
        tagName: 'path',
        groupSelector: 'arrow',
        selector: 'arrow1',
      },
      {
        tagName: 'path',
        groupSelector: 'arrow',
        selector: 'arrow2',
      },
      {
        tagName: 'path',
        groupSelector: 'arrow',
        selector: 'arrow3',
      },
    ],
    attrs: {
      wrap: {
        connection: true,
        strokeWidth: 10,
        strokeLinejoin: 'round',
      },
      line: {
        connection: true,
        stroke: '#333333',
        strokeWidth: 2,
        strokeLinejoin: 'round',
        targetMarker: 'classic',
      },
      arrow: {
        d: 'M 0 -10 10 0 0 10 z',
        fill: '#ffffff',
        stroke: '#333333',
        pointerEvents: 'none',
      },
      arrow1: {
        // atConnectionRatio: 将边中的指定元素移动到指定比例 [0, 1] 位置处，并自动旋转元素，
        // 使其方向与所在位置边的斜率保持一致。教程 https://x6.antv.vision/zh/docs/api/registry/attr#atconnectionratiokeepgradient
        atConnectionRatio: 0.25,
      },
      arrow2: {
        atConnectionRatio: 0.5,
      },
      arrow3: {
        atConnectionRatio: 0.75,
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
  source: { x: 320, y: 100 },
  target: { x: 380, y: 260 },
  vertices: [{ x: 320, y: 200 }],
  shape: 'arrow',
  connector: { name: 'rounded' },
  attrs: {
    line: {
      stroke: '#73d13d',
      strokeWidth: 3,
    },
    arrow: {
      d: 'M 0 -6 8 0 0 6 z',
      fill: '#ED8A19',
      stroke: '#ED8A19',
    },
  },
})
