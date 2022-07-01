import { ObjectExt } from '@antv/x6-common'
import { Attr } from './index'

export const fill: Attr.Definition = {
  qualify: ObjectExt.isPlainObject,
  set(fill, { view }) {
    return `url(#${view.renderer.defineGradient(fill as any)})`
  },
}
