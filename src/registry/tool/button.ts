import { Dom, FunctionExt, NumberExt } from '../../common'
import { Point, type PointLike } from '../../geometry'
import type { Cell } from '../../model'
import type { CellView } from '../../view/cell'
import type { EdgeView } from '../../view/edge'
import type { NodeView } from '../../view/node'
import { ToolItem, type ToolItemOptions } from '../../view/tool'
import { getViewBBox } from './util'

export class Button extends ToolItem<EdgeView | NodeView, Options> {
  public static defaults: Options = {
    ...ToolItem.getDefaults(),
    name: 'button',
    useCellGeometry: true,
    events: {
      mousedown: 'onMouseDown',
      touchstart: 'onMouseDown',
    },
  }

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
    const { offset, useCellGeometry, rotate } = options

    let bbox = getViewBBox(view, useCellGeometry)
    const angle = view.cell.getAngle()
    if (!rotate) {
      bbox = bbox.bbox(angle)
    }

    let offsetX = 0
    let offsetY = 0
    if (typeof offset === 'number') {
      offsetX = offset
      offsetY = offset
    } else if (typeof offset === 'object') {
      offsetX = offset.x
      offsetY = offset.y
    }

    x = NumberExt.normalizePercentage(x, bbox.width)
    y = NumberExt.normalizePercentage(y, bbox.height)

    let matrix = Dom.createSVGMatrix()

    if (this.parent.options.local) {
      matrix = matrix.translate(bbox.width / 2, bbox.height / 2)
    } else {
      matrix = matrix.translate(
        bbox.x + bbox.width / 2,
        bbox.y + bbox.height / 2,
      )
    }

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

    const d = NumberExt.normalizePercentage(distance, 1)

    const tangent =
      d >= 0 && d <= 1 ? view.getTangentAtRatio(d) : view.getTangentAtLength(d)
    const position = tangent ? tangent.start : view.getConnection()!.start!
    const angle = tangent
      ? tangent.vector().vectorAngle(new Point(1, 0)) || 0
      : 0

    let matrix = Dom.createSVGMatrix()
      .translate(position.x, position.y)
      .rotate(angle)

    if (typeof offset === 'object') {
      matrix = matrix.translate(offset.x || 0, offset.y || 0)
    } else {
      matrix = matrix.translate(0, offset)
    }

    if (!rotate) {
      matrix = matrix.rotate(-angle)
    }

    return matrix
  }

  protected onMouseDown(e: Dom.MouseDownEvent) {
    if (this.guard(e)) {
      return
    }

    e.stopPropagation()
    e.preventDefault()

    const onClick = this.options.onClick
    if (typeof onClick === 'function') {
      FunctionExt.call(onClick, this.cellView, {
        e,
        view: this.cellView,
        cell: this.cellView.cell,
        btn: this,
      })
    }
  }
}

interface Options extends ToolItemOptions {
  x?: number | string
  y?: number | string
  distance?: number | string
  offset?: number | PointLike
  rotate?: boolean
  useCellGeometry?: boolean
  onClick?: (
    this: CellView,
    args: {
      e: Dom.MouseDownEvent
      cell: Cell
      view: CellView
      btn: Button
    },
  ) => any
}

export class Remove extends Button {
  public static defaults: Options = {
    ...Button.getDefaults(),
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
    useCellGeometry: true,
    onClick({ view, btn }) {
      btn.parent.remove()
      view.cell.remove({ ui: true, toolId: btn.cid })
    },
  }
}
