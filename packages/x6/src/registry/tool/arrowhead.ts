import { Attr } from '../attr'
import { Dom } from '../../util'
import { Point } from '../../geometry'
import { Edge } from '../../model/edge'
import { EdgeView } from '../../view/edge'
import { ToolsView } from '../../view/tool'

class Arrowhead extends ToolsView.ToolItem<EdgeView, Arrowhead.Options> {
  protected get type() {
    return this.options.type!
  }

  protected get ratio() {
    return this.options.ratio!
  }

  protected init() {
    if (this.options.attrs) {
      const { class: className, ...attrs } = this.options.attrs
      this.setAttrs(attrs, this.container)
      if (className) {
        Dom.addClass(this.container, className as string)
      }
    }
  }

  protected onRender() {
    Dom.addClass(
      this.container,
      this.prefixClassName(`edge-tool-${this.type}-arrowhead`),
    )
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

    if (edgeView.can('arrowheadMovable')) {
      edgeView.cell.startBatch('move-arrowhead', {
        ui: true,
        toolId: this.cid,
      })

      const coords = this.graph.snapToGrid(evt.clientX, evt.clientY)
      const data = edgeView.prepareArrowheadDragging(this.type, {
        x: coords.x,
        y: coords.y,
        options: {
          toolId: this.cid,
        },
      })
      this.cellView.setEventData(evt, data)
      this.delegateDocumentEvents(this.options.documentEvents!, evt.data)
      edgeView.graph.view.undelegateEvents()

      this.container.style.pointerEvents = 'none'
    }

    this.focus()
  }

  protected onMouseMove(evt: JQuery.MouseMoveEvent) {
    const e = this.normalizeEvent(evt)
    const coords = this.graph.snapToGrid(e.clientX, e.clientY)
    this.cellView.onMouseMove(e, coords.x, coords.y)
    this.update()
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
      toolId: this.cid,
    })
  }
}

namespace Arrowhead {
  export interface Options extends ToolsView.ToolItem.Options {
    attrs?: Attr.SimpleAttrs
    type?: Edge.TerminalType
    ratio?: number
  }
}

namespace Arrowhead {
  Arrowhead.config({
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

export const SourceArrowhead = Arrowhead.define<Arrowhead.Options>({
  name: 'source-arrowhead',
  type: 'source',
  ratio: 0,
  attrs: {
    d: 'M 10 -8 -10 0 10 8 Z',
    fill: '#333',
    stroke: '#fff',
    'stroke-width': 2,
    cursor: 'move',
  },
})

export const TargetArrowhead = Arrowhead.define<Arrowhead.Options>({
  name: 'target-arrowhead',
  type: 'target',
  ratio: 1,
  attrs: {
    d: 'M -10 -8 10 0 -10 8 Z',
    fill: '#333',
    stroke: '#fff',
    'stroke-width': 2,
    cursor: 'move',
  },
})
