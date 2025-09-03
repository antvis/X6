import { Dom } from '../../common'
import { Config } from '../../config'
import type { HighlighterDefinition } from './index'

export type OpacityHighlighterOptions = {}

const className = Config.prefix('highlight-opacity')

export const opacity: HighlighterDefinition<OpacityHighlighterOptions> = {
  highlight(cellView, magnet) {
    Dom.addClass(magnet, className)
  },

  unhighlight(cellView, magnetEl) {
    Dom.removeClass(magnetEl, className)
  },
}
