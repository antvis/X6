import { getMarkup, bodyAttr, labelAttr } from './util'
import { Node } from '../../model'

export const Rect = Node.registry.register('rect', {
  markup: getMarkup('rect'),
  attrs: {
    body: {
      ...bodyAttr,
      refWidth: '100%',
      refHeight: '100%',
    },
    label: {
      ...labelAttr,
    },
  },
})
