import { Graph, Color } from '@antv/x6'

const color1 = Color.randomHex()
const color2 = Color.randomHex()

Graph.registerNode(
  'performance_node',
  {
    width: 80,
    height: 30,
    zIndex: 2,
    markup: [
      {
        tagName: 'rect',
        selector: 'body',
        // 在 Markup 中定义生命周期中不变的原生属性，不能定义特殊属性
        attrs: {
          stroke: color1,
          strokeWidth: 2,
          fill: Color.darken(color1, 40),
        },
      },
      {
        tagName: 'text',
        selector: 'label',
        attrs: {
          fill: Color.invert(color1, true),
        },
      },
    ],
    attrs: {
      body: {
        // 使用 ref-xxx 属性时，只要没有同时定义 ref 属性，所有计算都是纯 JavaScript 计算，
        // 因此计算非常快；一旦定义了 ref 属性，就需要先基于浏览器的包围盒计算拿到 ref 指代
        // 元素的包围盒，计算开销相对较大。
        refWidth: '100%',
        refHeight: '100%',
      },
      label: {
        refX: '50%',
        refY: '50%',
        fontSize: 12,
        // 尽量避免使用 `xAlign` 和 `yAlign` 属性，因为这两个属性的计算首先需要计算
        // <SVGText> 元素的包围盒，通常浏览器的包围盒计算都不是那么快。
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
      },
    },
  },
  true,
)
Graph.registerEdge(
  'performance_edge',
  {
    zIndex: 1,
    markup: [
      {
        tagName: 'path',
        selector: 'wrap',
        attrs: {
          fill: 'none',
          cursor: 'pointer',
          stroke: 'transparent',
          strokeWidth: 10,
          strokeLinecap: 'round',
        },
      },
      {
        tagName: 'path',
        selector: 'line',
      },
    ],
    attrs: {
      wrap: {
        connection: true,
      },
      line: {
        connection: true,
        stroke: color2,
        strokeWidth: 1,
        targetMarker: 'classic',
      },
    },
  },
  true,
)
