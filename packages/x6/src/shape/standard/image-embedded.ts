import { getImageUrlHook } from '../basic/util'
import { createShape } from './util'

export const EmbeddedImage = createShape('image-embedded', {
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
      refWidth: '100%',
      refHeight: '100%',
      stroke: '#333333',
      fill: '#FFFFFF',
      strokeWidth: 2,
    },
    image: {
      // xlinkHref: '[URL]'
      refWidth: '30%',
      refHeight: -20,
      x: 10,
      y: 10,
      preserveAspectRatio: 'xMidYMin',
    },
  },
  propHooks: getImageUrlHook(),
})
