import { ObjectExt } from '../../util'
import { createShape } from './util'

export const Path = createShape('path', {
  width: 60,
  height: 60,
  attrs: {
    text: {
      ref: 'path',
      refY: null,
      refDy: 16,
    },
  },
  propHooks(metadata) {
    const { d, ...others } = metadata
    if (d != null) {
      ObjectExt.setByPath(others, 'attrs/path/d', d)
    }
    return others
  },
})
