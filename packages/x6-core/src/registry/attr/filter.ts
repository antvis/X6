import { ObjectExt } from '@antv/x6-common'
import { Attr } from './index'

export const filter: Attr.Definition = {
  qualify: ObjectExt.isPlainObject,
  set(filter, { view }) {
    return `url(#${view.renderer.defineFilter(filter as any)})`
  },
}
