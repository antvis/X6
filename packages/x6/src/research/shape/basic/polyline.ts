import { NodeRegistry } from '../../registry'
import { getMarkup, getName, rootAttr, shapeAttr, textAttr } from './util'

export const Polyline = NodeRegistry.register(getName('polyline'), {
  markup: getMarkup('polyline'),
  size: { width: 60, height: 40 },
  attrs: {
    ...rootAttr,
    polyline: {
      ...shapeAttr,
    },
    text: {
      ...textAttr,
      refX: 0.5,
      refDy: 20,
    },
  },
})
