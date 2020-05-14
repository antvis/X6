import { getMarkup, bodyAttr, labelAttr } from './util'
import { Node } from '../../model'

export const Path = Node.registry.register('path', {
  markup: getMarkup('path'),
  attrs: {
    body: {
      ...bodyAttr,
      refD: 'M 0 0 L 10 0 10 10 0 10 Z',
    },
    label: {
      ...labelAttr,
    },
  },
})
