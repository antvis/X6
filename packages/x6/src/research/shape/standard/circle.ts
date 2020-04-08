import { NodeRegistry } from '../../registry'
import { getMarkup, bodyAttr, labelAttr } from './util'

export const Circle = NodeRegistry.register('circle', {
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
