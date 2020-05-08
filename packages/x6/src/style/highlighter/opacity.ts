import { Dom } from '../../util'
import { addClassNamePrefix } from '../../core/globals'
import { Highlighter } from './index'

export interface OpacityHighlighterOptions {}

const className = addClassNamePrefix('highlight-opacity')

export const opacity: Highlighter.Definition<OpacityHighlighterOptions> = {
  highlight(cellView, magnet) {
    Dom.addClass(magnet, className)
  },

  unhighlight(cellView, magnetEl) {
    Dom.removeClass(magnetEl, className)
  },
}
