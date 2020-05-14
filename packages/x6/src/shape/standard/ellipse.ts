import { getMarkup, bodyAttr, labelAttr } from './util'
import { Node } from '../../model'

export const Ellipse = Node.registry.register('ellipse', {
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
