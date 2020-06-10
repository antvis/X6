import { getImageUrlHook } from '../basic/util'
import { createShape } from './util'

export const InscribedImage = createShape('image-inscribed', {
  propHooks: getImageUrlHook(),
  markup: [
    {
      tagName: 'ellipse',
      selector: 'background',
    },
    {
      tagName: 'image',
      selector: 'image',
    },
    {
      tagName: 'ellipse',
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
    border: {
      refRx: '50%',
      refRy: '50%',
      refCx: '50%',
      refCy: '50%',
      stroke: '#333333',
      strokeWidth: 2,
    },
    background: {
      refRx: '50%',
      refRy: '50%',
      refCx: '50%',
      refCy: '50%',
      fill: '#ffffff',
    },
    image: {
      // The image corners touch the border when its size is Math.sqrt(2) / 2 = 0.707.. ~= 70%
      refWidth: '68%',
      refHeight: '68%',
      // The image offset is calculated as (100% - 68%) / 2
      refX: '16%',
      refY: '16%',
      preserveAspectRatio: 'xMidYMid',
      // xlinkHref: '[URL]'
    },
    // label: {
    //   refX: '50%',
    //   refY: '100%',
    //   refY2: 10,
    //   textAnchor: 'middle',
    //   textVerticalAnchor: 'top',
    // },
  },
})
