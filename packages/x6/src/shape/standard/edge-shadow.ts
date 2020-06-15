import { Edge } from '../../model/edge'

export const ShadowEdge = Edge.define({
  shape: 'shadow-edge',
  markup: [
    {
      tagName: 'path',
      selector: 'shadow',
      attrs: {
        fill: 'none',
      },
    },
    {
      tagName: 'path',
      selector: 'line',
      attrs: {
        fill: 'none',
      },
    },
  ],
  attrs: {
    line: {
      connection: true,
      stroke: '#FF0000',
      strokeWidth: 20,
      strokeLinejoin: 'round',
      targetMarker: {
        type: 'path',
        stroke: 'none',
        d: 'M 0 -10 -10 0 0 10 z',
      },
      sourceMarker: {
        type: 'path',
        stroke: 'none',
        d: 'M -10 -10 0 0 -10 10 0 10 0 -10 z',
      },
    },
    shadow: {
      connection: true,
      refX: 3,
      refY: 6,
      stroke: '#000000',
      strokeOpacity: 0.2,
      strokeWidth: 20,
      strokeLinejoin: 'round',
      targetMarker: {
        type: 'path',
        d: 'M 0 -10 -10 0 0 10 z',
        stroke: 'none',
      },
      sourceMarker: {
        type: 'path',
        stroke: 'none',
        d: 'M -10 -10 0 0 -10 10 0 10 0 -10 z',
      },
    },
  },
})
