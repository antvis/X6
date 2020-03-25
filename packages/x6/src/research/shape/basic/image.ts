import { NodeRegistry } from '../../registry'
import { getMarkup, getName, rootAttr, textAttr } from './util'

export const Image = NodeRegistry.register(getName('image'), {
  markup: getMarkup('image'),
  attrs: {
    ...rootAttr,
    text: {
      ...textAttr,
      refX: 0.5,
      refDy: 20,
    },
  },
})
