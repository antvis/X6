import { ObjectExt } from '../../common'
import type { Definition } from './index'

export const filter: Definition = {
  qualify: ObjectExt.isPlainObject,
  set(filter, { view }) {
    return `url(#${view.graph.defineFilter(filter as any)})`
  },
}
