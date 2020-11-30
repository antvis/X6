import { createShape } from './util'
import { ObjectExt } from '../../util'

export const Path = createShape('path', {})

Path.config({
  propHooks(metadata) {
    const { path, ...others } = metadata
    if (path) {
      ObjectExt.setByPath(others, 'attrs/body/refD', path)
    }
    return others
  },
})
