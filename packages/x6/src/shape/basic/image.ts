import { createShape, getImageUrlHook } from './util'

export const Image = createShape('image', {
  attrs: {
    text: {
      refY: null,
      refDy: 16,
    },
  },
  propHooks: getImageUrlHook(),
})
