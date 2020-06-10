import { createShape } from './util'

export const Polyline = createShape('polyline', {
  width: 60,
  height: 40,
  attrs: {
    text: {
      refY: null,
      refDy: 16,
    },
  },
})
