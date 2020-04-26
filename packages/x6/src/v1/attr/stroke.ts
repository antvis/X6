import { ObjectExt } from '../../util'
import { Attr } from '.'

export const stroke: Attr.Definition = {
  qualify: ObjectExt.isPlainObject,
  set(stroke, { view }) {
    return `url(#${view.graph.defineGradient(stroke as any)})`
  },
}
