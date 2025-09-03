import { Dom } from '../../common'
import { Config } from '../../config'
import type { HighlighterDefinition } from './index'

export interface ClassHighlighterOptions {
  className?: string
}

const defaultClassName = Config.prefix('highlighted')

export const className: HighlighterDefinition<ClassHighlighterOptions> = {
  highlight(cellView, magnet, options) {
    const cls = (options && options.className) || defaultClassName
    Dom.addClass(magnet, cls)
  },
  unhighlight(cellView, magnet, options) {
    const cls = (options && options.className) || defaultClassName
    Dom.removeClass(magnet, cls)
  },
}
