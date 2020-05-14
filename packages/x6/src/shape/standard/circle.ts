import { getMarkup, bodyAttr, labelAttr } from './util'
import { Node } from '../../model'

export const Circle = Node.registry.register('circle', {
  markup: getMarkup('circle'),
  attrs: {
    body: {
      ...bodyAttr,
      refCx: '50%',
      refCy: '50%',
      refR: '50%',
    },
    label: {
      ...labelAttr,
    },
  },
})
