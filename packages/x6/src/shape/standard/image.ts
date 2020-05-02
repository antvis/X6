import { NodeRegistry } from '../../registry'
import { bodyAttr, labelAttr, getMarkup } from './util'

export const Image = NodeRegistry.register('image', {
  markup: getMarkup('image', 'image'),
  attrs: {
    image: {
      ...bodyAttr,
      refWidth: '100%',
      refHeight: '100%',
      // xlinkHref: '[URL]'
    },
    label: {
      ...labelAttr,
      refY2: 10,
      textVerticalAnchor: 'top',
    },
  },
})
