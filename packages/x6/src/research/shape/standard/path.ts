import { NodeRegistry } from '../../registry'
import { getMarkup, bodyAttr, labelAttr } from './util'

export const Path = NodeRegistry.register('path', {
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
