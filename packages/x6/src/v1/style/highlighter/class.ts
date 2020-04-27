import { v } from '../../../v'
import { addClassNamePrefix } from '../../core/globals'
import { Highlighter } from './index'

export interface ClassHighlighterOptions {
  className?: string
}

const defaultClassName = addClassNamePrefix('highlighted')

export const className: Highlighter.Definition<ClassHighlighterOptions> = {
  highlight(cellView, magnet, options) {
    const cls = (options && options.className) || defaultClassName
    v.addClass(magnet, cls)
  },
  unhighlight(cellView, magnet, options) {
    const cls = (options && options.className) || defaultClassName
    v.removeClass(magnet, cls)
  },
}
