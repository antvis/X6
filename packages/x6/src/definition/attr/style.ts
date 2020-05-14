import { ObjectExt } from '../../util'
import { Attr } from './index'

export const style: Attr.Definition = {
  qualify: ObjectExt.isPlainObject,
  set(styles, { view, elem }) {
    view.$(elem).css(styles as JQuery.PlainObject<string | number>)
  },
}
