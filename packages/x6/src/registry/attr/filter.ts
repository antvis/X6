import { ObjectExt } from '../../util'
import { Attr } from './index'

export const filter: Attr.Definition = {
  qualify: ObjectExt.isPlainObject,
  set(filter, { view }) {
    return `url(#${view.graph.defineFilter(filter as any)})`
  },
}
