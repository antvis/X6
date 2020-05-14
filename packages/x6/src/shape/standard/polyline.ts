import { getMarkup, bodyAttr, labelAttr } from './util'
import { Node } from '../../model'

export const Polyline = Node.registry.register('polyline', {
  markup: getMarkup('polyline'),
  attrs: {
    body: {
      ...bodyAttr,
      refPoints: '0 0 10 0 10 10 0 10 0 0',
    },
    label: {
      ...labelAttr,
    },
  },
})
