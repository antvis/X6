import { Poly } from './poly'
import { createShape } from './util'

export const Polygon = createShape('polygon', {
  attrs: {
    body: {
      refPoints: '0 0 10 0 10 10 0 10',
    },
  },
  parent: Poly,
})
