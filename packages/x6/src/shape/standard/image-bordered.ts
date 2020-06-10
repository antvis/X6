import { getImageUrlHook } from '../basic/util'
import { createShape } from './util'

export const BorderedImage = createShape('image-bordered', {
  markup: [
    {
      tagName: 'rect',
      selector: 'background',
      attrs: {
        stroke: 'none',
      },
    },
    {
      tagName: 'image',
      selector: 'image',
    },
    {
      tagName: 'rect',
      selector: 'border',
      attrs: {
        fill: 'none',
      },
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    background: {
      refWidth: -1,
      refHeight: -1,
      x: 0.5,
      y: 0.5,
      fill: '#ffffff',
    },
    border: {
      refWidth: '100%',
      refHeight: '100%',
      stroke: '#333333',
      strokeWidth: 2,
    },
    image: {
      // xlinkHref: '[URL]'
      refWidth: -1,
      refHeight: -1,
      x: 0.5,
      y: 0.5,
    },
  },
  propHooks: getImageUrlHook(),
})
