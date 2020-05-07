import { Dom } from '../../util'
import { addClassNamePrefix } from '../../core/globals'
import { Highlighter } from './index'

export interface ClassHighlighterOptions {
  className?: string
}

const defaultClassName = addClassNamePrefix('highlighted')

export const className: Highlighter.Definition<ClassHighlighterOptions> = {
  highlight(cellView, magnet, options) {
    const cls = (options && options.className) || defaultClassName
    Dom.addClass(magnet, cls)
  },
  unhighlight(cellView, magnet, options) {
    const cls = (options && options.className) || defaultClassName
    Dom.removeClass(magnet, cls)
  },
}
