import { createShape } from './util'

export const Ellipse = createShape('ellipse', {
  attrs: {
    body: {
      refCx: '50%',
      refCy: '50%',
      refRx: '50%',
      refRy: '50%',
    },
  },
})
