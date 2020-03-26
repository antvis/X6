import { NodeRegistry } from '../../registry'
import { getMarkup, getName, rootAttr, shapeAttr, textAttr } from './util'

export const Polygon = NodeRegistry.register(getName('polygon'), {
  markup: getMarkup('polygon'),
  size: { width: 60, height: 40 },
  attrs: {
    ...rootAttr,
    polygon: {
      ...shapeAttr,
    },
    text: {
      ...textAttr,
      refX: 0.5,
      refDy: 16,
    },
  },
})
