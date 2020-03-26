import { NodeRegistry } from '../../registry'
import { getMarkup, getName, rootAttr, shapeAttr, textAttr } from './util'

export const Path = NodeRegistry.register(getName('path'), {
  markup: getMarkup('path'),
  size: { width: 60, height: 60 },
  attrs: {
    ...rootAttr,
    path: {
      ...shapeAttr,
    },
    text: {
      ...textAttr,
      ref: 'path',
      refX: 0.5,
      refDy: 10,
    },
  },
})
