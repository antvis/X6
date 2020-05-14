import { bodyAttr, labelAttr } from './util'
import { Node } from '../../model'

export const EmbeddedImage = Node.registry.register('image-embedded', {
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'image',
      selector: 'image',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    body: {
      ...bodyAttr,
      refWidth: '100%',
      refHeight: '100%',
    },
    image: {
      // xlinkHref: '[URL]'
      refWidth: '30%',
      refHeight: -20,
      x: 10,
      y: 10,
      preserveAspectRatio: 'xMidYMin',
    },
    label: {
      ...labelAttr,
      textVerticalAnchor: 'top',
      textAnchor: 'left',
      refX: '30%',
      refX2: 20, // 10 + 10
      refY: 10,
    },
  },
})
