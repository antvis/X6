import { Dom, ObjectExt } from '../../common'
import type { Definition } from './index'

export const style: Definition = {
  qualify: ObjectExt.isPlainObject,
  set(styles, { elem }) {
    Dom.css(elem, styles as Record<string, string | number>)
  },
}
