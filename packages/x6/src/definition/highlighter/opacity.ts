import { Dom } from '../../util'
import { Util } from '../../global'
import { Highlighter } from './index'

export interface OpacityHighlighterOptions {}

const className = Util.prefix('highlight-opacity')

export const opacity: Highlighter.Definition<OpacityHighlighterOptions> = {
  highlight(cellView, magnet) {
    Dom.addClass(magnet, className)
  },

  unhighlight(cellView, magnetEl) {
    Dom.removeClass(magnetEl, className)
  },
}
