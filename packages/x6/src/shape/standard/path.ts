import { Node } from '../../model/node'
import { ObjectExt } from '../../util'
import { labelAttr } from './util'

export const Path = Node.define({
  shape: 'path',
  markup: [
    {
      tagName: 'rect',
      selector: 'bg',
    },
    {
      tagName: 'path',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    bg: {
      refWidth: '100%',
      refHeight: '100%',
      fill: 'none',
      stroke: 'none',
      pointerEvents: 'all',
    },
    body: {
      fill: 'none',
      stroke: '#000',
      strokeWidth: 2,
    },
    label: labelAttr,
  },
  propHooks(metadata) {
    const { path, ...others } = metadata
    if (path) {
      ObjectExt.setByPath(others, 'attrs/body/refD', path)
    }
    return others
  },
})
