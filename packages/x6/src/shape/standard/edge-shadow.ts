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
        cursor: 'pointer',
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
        name: 'path',
        stroke: 'none',
        d: 'M 0 -10 -10 0 0 10 z',
        offsetX: -5,
      },
      sourceMarker: {
        name: 'path',
        stroke: 'none',
        d: 'M -10 -10 0 0 -10 10 0 10 0 -10 z',
        offsetX: -5,
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
        name: 'path',
        d: 'M 0 -10 -10 0 0 10 z',
        stroke: 'none',
        offsetX: -5,
      },
      sourceMarker: {
        name: 'path',
        stroke: 'none',
        d: 'M -10 -10 0 0 -10 10 0 10 0 -10 z',
        offsetX: -5,
      },
    },
  },
})
