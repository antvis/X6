import { getMarkup, bodyAttr, labelAttr } from './util'
import { Node } from '../../model'

export const Polygon = Node.registry.register('polygon', {
  markup: getMarkup('polygon'),
  attrs: {
    body: {
      ...bodyAttr,
      refPoints: '0 0 10 0 10 10 0 10',
    },
    label: {
      ...labelAttr,
    },
  },
})
