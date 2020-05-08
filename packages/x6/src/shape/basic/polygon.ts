import { createShape } from './util'

export const Polygon = createShape('polygon', {
  width: 60,
  height: 40,
  attrs: {
    text: {
      refX: 0.5,
      refDy: 16,
    },
  },
})
