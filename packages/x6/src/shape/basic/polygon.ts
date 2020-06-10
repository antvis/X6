import { createShape } from './util'

export const Polygon = createShape('polygon', {
  width: 60,
  height: 40,
  attrs: {
    text: {
      refY: null,
      refDy: 16,
    },
  },
})
