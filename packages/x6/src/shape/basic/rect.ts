import { createShape } from './util'

export const Rect = createShape('rect', {
  attrs: {
    rect: {
      width: 100,
      height: 60,
    },
    text: {
      refX: 0.5,
      refY: 0.5,
    },
  },
})
