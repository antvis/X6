import { Dom, ObjectExt } from '../../common'
import type { AttrDefinition } from './index'

export const style: AttrDefinition = {
  qualify: ObjectExt.isPlainObject,
  set(styles, { elem }) {
    Dom.css(elem, styles as Record<string, string | number>)
  },
}
