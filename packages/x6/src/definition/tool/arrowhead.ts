import { Attr } from '../attr'
import { Dom } from '../../util'
import { Point } from '../../geometry'
import { Edge } from '../../model/edge'
import { EdgeView } from '../../view/edge'
import { ToolView } from '../../view/tool'

class ArrowHead extends ToolView.Item<EdgeView, ArrowHead.Options> {
  protected get type() {
    return this.options.type!
  }

  protected get ratio() {
    return this.options.ratio!
  }

  protected init() {
    this.setAttrs(this.options.attrs, this.container)
  }

  protected onRender() {
    this.update()
  }

  update() {
    const ratio = this.ratio
    const edgeView = this.cellView as EdgeView
    const tangent = edgeView.getTangentAtRatio(ratio)
    const position = tangent ? tangent.start : edgeView.getPointAtRatio(ratio)
    const angle =
      (tangent && tangent.vector().vectorAngle(new Point(1, 0))) || 0

    if (!position) {
      return this
    }

    const matrix = Dom.createSVGMatrix()
      .translate(position.x, position.y)
      .rotate(angle)

    Dom.transform(this.container as SVGElement, matrix, { absolute: true })

    return this
  }

  protected onMouseDown(evt: JQuery.MouseDownEvent) {
    if (this.guard(evt)) {
      return
    }

    evt.stopPropagation()
    evt.preventDefault()

    const edgeView = this.cellView as EdgeView
    edgeView.cell.startBatch('move-arrowhead', {
      ui: true,
      tool: this.cid,
    })

    if (edgeView.can('arrowheadMove')) {
      edgeView.prepareArrowheadDragging(this.type)
      this.delegateDocumentEvents(this.options.documentEvents!)
      edgeView.graph.view.undelegateEvents()
    }

    this.focus()
    this.container.style.pointerEvents = 'none'
  }

  protected onMouseMove(evt: JQuery.MouseMoveEvent) {
    const e = this.normalizeEvent(evt)
    const coords = this.graph.snapToGrid(e.clientX, e.clientY)
    this.cellView.onMouseMove(e, coords.x, coords.y)
  }

  protected onMouseUp(evt: JQuery.MouseUpEvent) {
    this.undelegateDocumentEvents()
    const e = this.normalizeEvent(evt)
    const edgeView = this.cellView
    const coords = this.graph.snapToGrid(e.clientX, e.clientY)
    edgeView.onMouseUp(e, coords.x, coords.y)
    this.graph.view.delegateEvents()
    this.blur()
    this.container.style.pointerEvents = ''
    edgeView.cell.stopBatch('move-arrowhead', {
      ui: true,
      tool: this.cid,
    })
  }
}

namespace ArrowHead {
  export interface Options extends ToolView.Item.Options {
    attrs?: Attr.SimpleAttrs
    type?: Edge.TerminalType
    ratio?: number
  }
}

namespace ArrowHead {
  ArrowHead.config({
    tagName: 'path',
    isSVGElement: true,
    events: {
      mousedown: 'onMouseDown',
      touchstart: 'onMouseDown',
    },
    documentEvents: {
      mousemove: 'onMouseMove',
      touchmove: 'onMouseMove',
      mouseup: 'onMouseUp',
      touchend: 'onMouseUp',
      touchcancel: 'onMouseUp',
    },
  })
}

export class SourceArrowhead extends ArrowHead {}

export class TargetArrowhead extends ArrowHead {}

SourceArrowhead.config<ArrowHead.Options>({
  type: 'source',
  ratio: 0,
  name: 'target-arrowhead',
  attrs: {
    d: 'M -10 -8 10 0 -10 8 Z',
    fill: '#33334F',
    stroke: '#FFFFFF',
    'stroke-width': 2,
    cursor: 'move',
    class: 'target-arrowhead',
  },
})

TargetArrowhead.config<ArrowHead.Options>({
  type: 'target',
  ratio: 1,
  name: 'source-arrowhead',
  attrs: {
    d: 'M 10 -8 -10 0 10 8 Z',
    fill: '#33334F',
    stroke: '#FFFFFF',
    'stroke-width': 2,
    cursor: 'move',
    class: 'source-arrowhead',
  },
})
