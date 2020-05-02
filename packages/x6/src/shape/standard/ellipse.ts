import { NodeRegistry } from '../../registry'
import { getMarkup, bodyAttr, labelAttr } from './util'

export const Ellipse = NodeRegistry.register('ellipse', {
  markup: getMarkup('ellipse'),
  attrs: {
    body: {
      ...bodyAttr,
      refCx: '50%',
      refCy: '50%',
      refRx: '50%',
      refRy: '50%',
    },
    label: {
      ...labelAttr,
    },
  },
})
