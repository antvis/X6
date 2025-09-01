import { ObjectExt } from '../../common'
import type { Definition } from './index'

export const fill: Definition = {
  qualify: ObjectExt.isPlainObject,
  set(fill, { view }) {
    return `url(#${view.graph.defineGradient(fill as any)})`
  },
}
