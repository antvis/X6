import { EdgeRegistry } from '../../registry'

export const Edge = EdgeRegistry.register('edge', {
  markup: [
    {
      tagName: 'path',
      selector: 'wrapper',
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
      attrs: {
        fill: 'none',
        pointerEvents: 'none',
      },
    },
  ],
  attrs: {
    line: {
      connection: true,
      stroke: '#333333',
      strokeWidth: 2,
      strokeLinejoin: 'round',
      targetMarker: {
        type: 'path',
        d: 'M 10 -5 0 0 10 5 z',
      },
    },
    wrapper: {
      connection: true,
      strokeWidth: 10,
      strokeLinejoin: 'round',
    },
  },
})
