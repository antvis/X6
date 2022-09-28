import { Dom } from '@antv/x6-common'
import { Config } from '../../config'
import { Highlighter } from './index'

export interface OpacityHighlighterOptions {}

const className = Config.prefix('highlight-opacity')

export const opacity: Highlighter.Definition<OpacityHighlighterOptions> = {
  highlight(cellView, magnet) {
    Dom.addClass(magnet, className)
  },

  unhighlight(cellView, magnetEl) {
    Dom.removeClass(magnetEl, className)
  },
}
