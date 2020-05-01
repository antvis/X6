import { NodeRegistry } from '../../registry'
import { getMarkup, getName, rootAttr, shapeAttr, textAttr } from './util'

export const Ellipse = NodeRegistry.register(getName('ellipse'), {
  markup: getMarkup('ellipse'),
  size: { width: 60, height: 40 },
  attrs: {
    ...rootAttr,
    ellipse: {
      ...shapeAttr,
      rx: 30,
      ry: 20,
      cx: 30,
      cy: 20,
    },
    text: {
      ...textAttr,
      refX: 0.5,
      refY: 0.5,
    },
  },
})
