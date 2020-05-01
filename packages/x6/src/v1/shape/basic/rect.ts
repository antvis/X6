import { NodeRegistry } from '../../registry'
import { getMarkup, getName, rootAttr, shapeAttr, textAttr } from './util'

export const Rect = NodeRegistry.register(getName('rect'), {
  markup: getMarkup('rect'),
  attrs: {
    ...rootAttr,
    rect: {
      ...shapeAttr,
      width: 100,
      height: 60,
    },
    text: {
      ...textAttr,
      refX: 0.5,
      refY: 0.5,
    },
  },
})
