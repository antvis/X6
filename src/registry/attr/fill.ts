import { ObjectExt } from '../../common'
import type { AttrDefinition } from './index'

export const fill: AttrDefinition = {
  qualify: ObjectExt.isPlainObject,
  set(fill, { view }) {
    return `url(#${view.graph.defineGradient(fill as any)})`
  },
}
