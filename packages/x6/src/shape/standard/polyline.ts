import { Poly } from './poly'
import { createShape } from './util'

export const Polyline = createShape('polyline', {
  attrs: {
    body: {},
  },
  parent: Poly,
})
