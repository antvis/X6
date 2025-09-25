import { Dom, NumberExt } from '../../common'
import type { EdgeView } from '../../view/edge'
import type { NodeView } from '../../view/node'
import { ToolItem, type ToolItemOptions } from '../../view/tool'
import type { SimpleAttrs } from '../attr'
import * as Util from './util'

export class Boundary extends ToolItem<EdgeView | NodeView, Options> {
  public static defaults: Options = {
    ...ToolItem.getDefaults(),
    name: 'boundary',
    tagName: 'rect',
    padding: 10,
    useCellGeometry: true,
    attrs: {
      fill: 'none',
      stroke: '#333',
      'stroke-width': 0.5,
      'stroke-dasharray': '5, 5',
      'pointer-events': 'none',
    },
  }

  protected onRender() {
    Dom.addClass(this.container, this.prefixClassName('cell-tool-boundary'))

    if (this.options.attrs) {
      const { class: className, ...attrs } = this.options.attrs
      Dom.attr(this.container, Dom.kebablizeAttrs(attrs))
      if (className) {
        Dom.addClass(this.container, className as string)
      }
    }
    this.update()
  }

  update() {
    const view = this.cellView
    const options = this.options
    const { useCellGeometry, rotate } = options
    const padding = NumberExt.normalizeSides(options.padding)
    let bbox = Util.getViewBBox(view, useCellGeometry).moveAndExpand({
      x: -padding.left,
      y: -padding.top,
      width: padding.left + padding.right,
      height: padding.top + padding.bottom,
    })

    const cell = view.cell
    if (cell.isNode()) {
      const angle = cell.getAngle()
      if (angle) {
        if (rotate) {
          const origin = cell.getBBox().getCenter()
          Dom.rotate(this.container, angle, origin.x, origin.y, {
            absolute: true,
          })
        } else {
          bbox = bbox.bbox(angle)
        }
      }
    }

    Dom.attr(this.container, bbox.toJSON())

    return this
  }
}

interface Options extends ToolItemOptions {
  padding?: NumberExt.SideOptions
  rotate?: boolean
  useCellGeometry?: boolean
  attrs?: SimpleAttrs
}
