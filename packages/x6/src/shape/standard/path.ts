import { createShape } from './util'
import { ObjectExt } from '../../util'

export const Path = createShape('path', {
  attrs: {
    body: {
      refD: 'M 0 0 L 10 0 10 10 0 10 Z',
    },
  },
})

Path.config({
  propHooks(metadata) {
    const { path, ...others } = metadata
    if (path) {
      ObjectExt.setByPath(others, 'attrs/body/refD', path)
    }
    return others
  },
})
