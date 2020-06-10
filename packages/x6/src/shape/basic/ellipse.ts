import { createShape } from './util'

export const Ellipse = createShape('ellipse', {
  width: 60,
  height: 40,
  attrs: {
    ellipse: {
      rx: 30,
      ry: 20,
      cx: 30,
      cy: 20,
    },
  },
})
