import { Dom } from '@antv/x6-common'
import { Config } from '../../config'
import { Highlighter } from './index'

export interface ClassHighlighterOptions {
  className?: string
}

const defaultClassName = Config.prefix('highlighted')

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
