import { Point } from '../../geometry'
import { Dom, NumberExt } from '../../util'
import { CellView } from '../../view/cell'
import { NodeView } from '../../view/node'
import { EdgeView } from '../../view/edge'
import { ToolsView } from '../../view/tool'
import * as Util from './util'

export class Button extends ToolsView.ToolItem<
  EdgeView | NodeView,
  Button.Options
> {
  protected onRender() {
    Dom.addClass(this.container, this.prefixClassName('cell-tool-button'))
    this.update()
  }

  update() {
    this.updatePosition()
    return this
  }

  protected updatePosition() {
    const view = this.cellView
    const matrix = view.cell.isEdge()
      ? this.getEdgeMatrix()
      : this.getNodeMatrix()
    Dom.transform(this.container as SVGElement, matrix, { absolute: true })
  }

  protected getNodeMatrix() {
    const view = this.cellView as NodeView
    const options = this.options

    let { x = 0, y = 0 } = options
    const { offset, useCellBBox, rotate } = options

    let bbox = Util.getViewBBox(view, useCellBBox)
    const angle = view.cell.getAngle()
    if (!rotate) {
      bbox = bbox.bbox(angle)
    }

    let offsetX: number = 0
    let offsetY: number = 0
    if (typeof offset === 'number') {
      offsetX = offset
      offsetY = offset
    } else if (typeof offset === 'object') {
      offsetX = offset.x
      offsetY = offset.y
    }

    x = NumberExt.normalizePercentage(x, bbox.width)
    y = NumberExt.normalizePercentage(y, bbox.height)

    let matrix = Dom.createSVGMatrix().translate(
      bbox.x + bbox.width / 2,
      bbox.y + bbox.height / 2,
    )

    if (rotate) {
      matrix = matrix.rotate(angle)
    }

    matrix = matrix.translate(
      x + offsetX - bbox.width / 2,
      y + offsetY - bbox.height / 2,
    )

    return matrix
  }

  protected getEdgeMatrix() {
    const view = this.cellView as EdgeView
    const options = this.options
    const { offset = 0, distance = 0, rotate } = options

    let tangent
    let position
    let angle
    if (NumberExt.isPercentage(distance)) {
      tangent = view.getTangentAtRatio(parseFloat(distance) / 100)
    } else {
      tangent = view.getTangentAtLength(distance)
    }

    if (tangent) {
      position = tangent.start
      angle = tangent.vector().vectorAngle(new Point(1, 0)) || 0
    } else {
      position = view.getConnection()!.start!
      angle = 0
    }

    let matrix = Dom.createSVGMatrix()
      .translate(position.x, position.y)
      .rotate(angle)
      .translate(0, offset as number)

    if (!rotate) {
      matrix = matrix.rotate(-angle)
    }

    return matrix
  }

  protected onMouseDown(evt: JQuery.MouseDownEvent) {
    if (this.guard(evt)) {
      return
    }

    evt.stopPropagation()
    evt.preventDefault()

    const onClick = this.options.onClick
    if (typeof onClick === 'function') {
      onClick.call(this.cellView, evt, this.cellView, this)
    }
  }
}

export namespace Button {
  export interface Options extends ToolsView.ToolItem.Options {
    x?: number
    y?: number
    distance?: number
    offset?: number | Point.PointLike
    rotate?: boolean
    useCellBBox?: boolean
    onClick?: (
      this: CellView,
      evt: JQuery.MouseDownEvent,
      cellView: CellView,
      btn: Button,
    ) => any
  }
}

export namespace Button {
  Button.config<Button.Options>({
    name: 'button',
    events: {
      mousedown: 'onMouseDown',
      touchstart: 'onMouseDown',
    },
  })
}

export namespace Button {
  export const Remove = Button.define<Button.Options>({
    name: 'button-remove',
    markup: [
      {
        tagName: 'circle',
        selector: 'button',
        attrs: {
          r: 7,
          fill: '#FF1D00',
          cursor: 'pointer',
        },
      },
      {
        tagName: 'path',
        selector: 'icon',
        attrs: {
          d: 'M -3 -3 3 3 M -3 3 3 -3',
          fill: 'none',
          stroke: '#FFFFFF',
          'stroke-width': 2,
          'pointer-events': 'none',
        },
      },
    ],
    distance: 60,
    offset: 0,
    onClick(evt, view, btn) {
      btn.parent.remove()
      view.cell.remove({ ui: true, toolId: btn.cid })
    },
  })
}
