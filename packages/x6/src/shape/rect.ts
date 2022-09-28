import { createShape } from './util'

export const Rect = createShape('rect', {
  attrs: {
    body: {
      refWidth: '100%',
      refHeight: '100%',
    },
  },
})
