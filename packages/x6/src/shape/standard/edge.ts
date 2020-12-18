import { Edge as E } from '../../model/edge'

export const Edge = E.define({
  shape: 'edge',
  markup: [
    {
      tagName: 'path',
      selector: 'wrap',
      groupSelector: 'lines',
      attrs: {
        fill: 'none',
        cursor: 'pointer',
        stroke: 'transparent',
        strokeLinecap: 'round',
      },
    },
    {
      tagName: 'path',
      selector: 'line',
      groupSelector: 'lines',
      attrs: {
        fill: 'none',
        pointerEvents: 'none',
      },
    },
  ],
  attrs: {
    lines: {
      connection: true,
      // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linejoin
      strokeLinejoin: 'round',
      // https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/stroke-linecap
      strokeLinecap: 'square',
    },
    wrap: {
      strokeWidth: 10,
    },
    line: {
      stroke: '#333',
      strokeWidth: 2,
      targetMarker: 'classic',
    },
  },
})
