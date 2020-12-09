import { Attr } from '../attr'
import { NumberExt, Dom } from '../../util'
import { NodeView } from '../../view/node'
import { EdgeView } from '../../view/edge'
import { ToolsView } from '../../view/tool'
import * as Util from './util'

export class Boundary extends ToolsView.ToolItem<
  EdgeView | NodeView,
  Boundary.Options
> {
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

export namespace Boundary {
  export interface Options extends ToolsView.ToolItem.Options {
    padding?: NumberExt.SideOptions
    rotate?: boolean
    useCellGeometry?: boolean
    attrs?: Attr.SimpleAttrs
  }
}

export namespace Boundary {
  Boundary.config<Boundary.Options>({
    name: 'boundary',
    tagName: 'rect',
    padding: 10,
    attrs: {
      fill: 'none',
      stroke: '#333',
      'stroke-width': 0.5,
      'stroke-dasharray': '5, 5',
      'pointer-events': 'none',
    },
  })
}
