import { Edge as EdgeBase } from '../../model/edge'

export const Edge = EdgeBase.define({
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
      strokeLinejoin: 'round',
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
