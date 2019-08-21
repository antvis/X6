import * as util from '../util'
import { constants } from '../common'
import { Perimeter } from './perimeter'

export class Stylesheet {
  styles: { [name: string]: Stylesheet.Styles }

  constructor() {
    this.styles = {}
    this.setDefaultNodeStyle(this.createDefaultNodeStyle())
    this.setDefaultEdgeStyle(this.createDefaultEdgeStyle())
  }

  createDefaultNodeStyle() {
    const style: Stylesheet.Styles = {}
    style[constants.STYLE_SHAPE] = constants.SHAPE_RECTANGLE
    style[constants.STYLE_PERIMETER] = Perimeter.rectangle
    style[constants.STYLE_VERTICAL_ALIGN] = constants.ALIGN_MIDDLE
    style[constants.STYLE_ALIGN] = constants.ALIGN_CENTER
    style[constants.STYLE_FILLCOLOR] = '#C3D9FF'
    style[constants.STYLE_STROKECOLOR] = '#6482B9'
    style[constants.STYLE_FONTCOLOR] = '#774400'
    return style
  }

  createDefaultEdgeStyle() {
    const style: Stylesheet.Styles = {}
    style[constants.STYLE_SHAPE] = constants.SHAPE_CONNECTOR
    style[constants.STYLE_ENDARROW] = constants.ARROW_CLASSIC
    style[constants.STYLE_VERTICAL_ALIGN] = constants.ALIGN_MIDDLE
    style[constants.STYLE_ALIGN] = constants.ALIGN_CENTER
    style[constants.STYLE_STROKECOLOR] = '#6482B9'
    style[constants.STYLE_FONTCOLOR] = '#446299'
    return style
  }

  setDefaultNodeStyle(style: Stylesheet.Styles) {
    this.setCellStyle('defaultNode', style)
  }

  setDefaultEdgeStyle(style: Stylesheet.Styles) {
    this.setCellStyle('defaultEdge', style)
  }

  getDefaultNodeStyle() {
    return this.styles['defaultNode'] as Stylesheet.Styles
  }

  getDefaultEdgeStyle() {
    return this.styles['defaultEdge'] as Stylesheet.Styles
  }

  setCellStyle(name: string, style: Stylesheet.Styles) {
    this.styles[name] = style
  }

  /**
   * Returns the cell style for the specified stylename or the given
   * defaultStyle if no style can be found for the given stylename.
   */
  getCellStyle(styleStr: string, defaultStyle: Stylesheet.Styles) {
    let style = defaultStyle
    if (styleStr != null && styleStr.length > 0) {
      const pairs = styleStr.split(';')
      if (style != null && styleStr.charAt(0) !== ';') {
        style = { ...style } as Stylesheet.Styles
      } else {
        style = {}
      }

      for (let i = 0, ii = pairs.length; i < ii; i += 1) {
        const tmp = pairs[i].trim()
        const pos = tmp.indexOf('=')

        if (pos >= 0) {
          const key = tmp.substring(0, pos).trim()
          const value = tmp.substring(pos + 1).trim()

          if (value === 'none') {
            delete style[key]
          } else if (util.isNumeric(value)) {
            style[key] = +value
          } else {
            style[key] = value
          }
        } else {
          // Merges the entries from a named style
          const stl = this.styles[tmp]
          if (stl != null) {
            Object.keys(stl).forEach(k => (style[k] = stl[k]))
          }
        }
      }
    }

    return style
  }
}

export namespace Stylesheet {
  export type Styles = { [name: string]: any }
}
