import { Poly } from './poly'
import { createShape } from './util'

export const Polyline = createShape('polyline', {
  attrs: {
    body: {
      refPoints: '0 0 10 0 10 10 0 10 0 0',
    },
  },
  parent: Poly,
})
