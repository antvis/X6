import { ObjectExt, Dom } from '../../common'
import { Attr } from './index'

export const style: Attr.Definition = {
  qualify: ObjectExt.isPlainObject,
  set(styles, { elem }) {
    Dom.css(elem, styles as Record<string, string | number>)
  },
}
