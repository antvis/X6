import { Poly } from './poly'
import { createShape } from './util'

export const Polygon = createShape('polygon', {
  attrs: {
    body: {},
  },
  parent: Poly,
})
