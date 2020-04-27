import { v } from '../../../v'
import { addClassNamePrefix } from '../../core/globals'
import { Highlighter } from './index'

export interface OpacityHighlighterOptions {}

const className = addClassNamePrefix('highlight-opacity')

export const opacity: Highlighter.Definition<OpacityHighlighterOptions> = {
  highlight(cellView, magnet) {
    v.addClass(magnet, className)
  },

  unhighlight(cellView, magnetEl) {
    v.removeClass(magnetEl, className)
  },
}
