import { createShape } from './util'

export const Circle = createShape('circle', {
  attrs: {
    body: {
      refCx: '50%',
      refCy: '50%',
      refR: '50%',
    },
  },
})
