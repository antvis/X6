import { ObjectExt } from '../../common'
import type { AttrDefinition } from './index'

export const filter: AttrDefinition = {
  qualify: ObjectExt.isPlainObject,
  set(filter, { view }) {
    return `url(#${view.graph.defineFilter(filter as any)})`
  },
}
