import { NodeRegistry } from '../../registry'
import { getMarkup, getName, rootAttr, shapeAttr, textAttr } from './util'

export const Circle = NodeRegistry.register(getName('circle'), {
  markup: getMarkup('circle'),
  size: { width: 60, height: 60 },
  attrs: {
    ...rootAttr,
    circle: {
      ...shapeAttr,
      r: 30,
      cx: 30,
      cy: 30,
    },
    text: {
      ...textAttr,
      refX: 0.5,
      refY: 0.5,
    },
  },
})
