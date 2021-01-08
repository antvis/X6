import { Widget } from '../common'
import { KeyValue } from '../../types'
import { Cell } from '../../model/cell'
import { Node } from '../../model/node'
import { Edge } from '../../model/edge'
import { NodeView } from '../../view/node'
import { EdgeView } from '../../view/edge'
import { Graph } from '../../graph/graph'
import { Dom } from '../../util'
import { Angle, Point } from '../../geometry'

export class Knob extends Widget<Knob.Options> {
  public container: HTMLDivElement

  protected get node() {
    return this.cell as Node
  }

  protected get metadata() {
    const meta = this.cell.prop('knob')
    if (Array.isArray(meta)) {
      if (this.options.index != null) {
        return meta[this.options.index]
      }
      return null
    }
    return meta as Knob.Metadata
  }

  protected init(options: Knob.Options) {
    this.options = { ...options }
    this.render()
    this.startListening()
  }

  protected startListening() {
    this.delegateEvents({
      mousedown: 'onMouseDown',
      touchstart: 'onMouseDown',
    })

    this.model.on('*', this.update, this)
    this.graph.on('scale', this.update, this)
    this.graph.on('translate', this.update, this)

    this.model.on('reseted', this.remove, this)
    this.node.on('removed', this.remove, this)

    this.view.on('node:resize:mousedown', this.onTransform, this)
    this.view.on('node:rotate:mousedown', this.onTransform, this)
    this.view.on('node:resize:mouseup', this.onTransformed, this)
    this.view.on('node:rotate:mouseup', this.onTransformed, this)
    this.view.on('cell:knob:mousedown', this.onKnobMouseDown, this)
    this.view.on('cell:knob:mouseup', this.onKnobMouseUp, this)

    super.startListening()
  }

  protected stopListening() {
    this.undelegateEvents()

    this.model.off('*', this.update, this)
    this.graph.off('scale', this.update, this)
    this.graph.off('translate', this.update, this)

    this.model.off('reseted', this.remove, this)
    this.node.off('removed', this.remove, this)

    this.view.off('node:resize:mousedown', this.onTransform, this)
    this.view.off('node:rotate:mousedown', this.onTransform, this)
    this.view.off('node:resize:mouseup', this.onTransformed, this)
    this.view.off('node:rotate:mouseup', this.onTransformed, this)
    this.view.off('cell:knob:mousedown', this.onKnobMouseDown, this)
    this.view.off('cell:knob:mouseup', this.onKnobMouseUp, this)

    super.stopListening()
  }

  render() {
    this.container = document.createElement('div')
    Dom.addClass(this.container, this.prefixClassName('widget-knob'))
    if (this.options.className) {
      Dom.addClass(this.container, this.options.className)
    }

    this.view.addClass(Private.KNOB)
    this.graph.container.appendChild(this.container)
    this.update()

    return this
  }

  remove() {
    this.view.removeClass(Private.KNOB)
    return super.remove()
  }

  protected update() {
    if (this.metadata) {
      const { update, position } = this.metadata
      const args = {
        knob: this,
        cell: this.cell,
        node: this.node,
      }

      if (position) {
        const pos = position.call(this.graph, { ...args })
        if (pos) {
          const ctm = this.graph.matrix()
          const bbox = this.node.getBBox()
          const angle = Angle.normalize(this.node.getAngle())
          const local = Point.create(pos)
          if (angle !== 0) {
            local.rotate(-angle, { x: bbox.width / 2, y: bbox.height / 2 })
          }
          local.translate(bbox).scale(ctm.a, ctm.d).translate(ctm.e, ctm.f)
          this.container.style.left = `${local.x}px`
          this.container.style.top = `${local.y}px`
        }
      }

      if (update) {
        update.call(this.graph, { ...args })
      }
    }
  }

  protected hide() {
    this.container.style.display = 'none'
  }

  protected show() {
    this.container.style.display = ''
  }

  protected onTransform() {
    this.hide()
  }

  protected onTransformed() {
    this.show()
  }

  protected onKnobMouseDown({ knob }: { knob: Knob }) {
    if (this.cid !== knob.cid) {
      this.hide()
    }
  }

  protected onKnobMouseUp() {
    this.show()
  }

  protected notify(name: string, evt: JQuery.TriggeredEvent) {
    if (this.view) {
      const e = this.view.normalizeEvent(evt) as JQuery.MouseDownEvent
      const localPoint = this.graph.snapToGrid(e.clientX, e.clientY)
      this.view.notify(`cell:${name}`, {
        e,
        view: this.view,
        node: this.node,
        cell: this.cell,
        x: localPoint.x,
        y: localPoint.y,
        knob: this,
      })

      if (this.cell.isNode()) {
        this.view.notify(`node:${name}`, {
          e,
          view: this.view as NodeView,
          node: this.node,
          cell: this.cell,
          x: localPoint.x,
          y: localPoint.y,
          knob: this,
        })
      } else if (this.cell.isEdge()) {
        this.view.notify(`edge:${name}`, {
          e,
          view: this.view as EdgeView,
          edge: this.cell as Edge,
          cell: this.cell,
          x: localPoint.x,
          y: localPoint.y,
          knob: this,
        })
      }
    }
  }

  protected onMouseDown(e: JQuery.MouseDownEvent) {
    e.stopPropagation()

    this.setEventData<EventData.Knob>(e, {
      knobbing: false,
      originX: e.clientX,
      originY: e.clientY,
      clientX: e.clientX,
      clientY: e.clientY,
    })

    this.graph.view.undelegateEvents()
    this.delegateDocumentEvents(Private.documentEvents, e.data)
    if (this.metadata && this.metadata.onMouseDown) {
      this.metadata.onMouseDown.call(this.graph, {
        e,
        data: this.getEventData<EventData.Knob>(e),
        knob: this,
        cell: this.cell,
        node: this.node,
      })
    }
    this.notify('knob:mousedown', e)
  }

  protected onMouseMove(e: JQuery.MouseMoveEvent) {
    const data = this.getEventData<EventData.Knob>(e)
    const view = this.graph.findViewByCell(this.node) as NodeView

    if (!data.knobbing) {
      data.knobbing = true
      if (view) {
        view.addClass(Private.KNOBBING)
        this.notify('knob', e)
      }
      this.model.startBatch('knob', { cid: this.cid })
    }

    data.clientX = e.clientX
    data.clientY = e.clientY

    if (this.metadata && this.metadata.onMouseMove) {
      const ctm = this.graph.matrix()
      const dx = (e.clientX - data.originX) / ctm.a
      const dy = (e.clientY - data.originY) / ctm.d
      const angle = this.node.getAngle()
      const delta = new Point(dx, dy).rotate(angle)
      this.metadata.onMouseMove.call(this.graph, {
        e,
        data,
        deltaX: delta.x,
        deltaY: delta.y,
        knob: this,
        cell: this.cell,
        node: this.node,
      })
    }

    this.notify('knobbing', e)
    this.notify('knob:mousemove', e)
  }

  protected onMouseUp(e: JQuery.MouseUpEvent) {
    this.undelegateDocumentEvents()
    this.graph.view.delegateEvents()
    const data = this.getEventData<EventData.Knob>(e)
    const view = this.graph.findViewByCell(this.node) as NodeView
    if (data.knobbing) {
      if (view) {
        view.removeClass(Private.KNOBBING)
      }

      if (this.metadata && this.metadata.onMouseUp) {
        this.metadata.onMouseUp.call(this.graph, {
          e,
          data,
          knob: this,
          cell: this.cell,
          node: this.node,
        })
      }

      this.model.stopBatch('knob', { cid: this.cid })
      this.notify('knobbed', e)
    }
    this.notify('knob:mouseup', e)
  }
}

export namespace Knob {
  export interface Options extends Widget.Options {
    className?: string
    index?: number
  }

  interface UpdateArgs {
    cell: Cell
    node: Node
    knob: Knob
  }

  interface HandlerArgs<T> extends UpdateArgs {
    e: T
    data: EventData.Knob
  }

  export interface Metadata {
    enabled?: boolean | ((this: Graph, node: Node) => boolean)
    update?: (this: Graph, args: UpdateArgs) => void
    position?: (this: Graph, args: UpdateArgs) => Point.PointLike
    onMouseDown?: (
      this: Graph,
      args: HandlerArgs<JQuery.MouseDownEvent>,
    ) => void
    onMouseMove?: (
      this: Graph,
      args: HandlerArgs<JQuery.MouseMoveEvent> & {
        deltaX: number
        deltaY: number
      },
    ) => void
    onMouseUp?: (this: Graph, args: HandlerArgs<JQuery.MouseUpEvent>) => void
  }
}

namespace Private {
  export const KNOB = 'has-widget-knob'
  export const KNOBBING = 'node-knobbing'

  export const documentEvents = {
    mousemove: 'onMouseMove',
    touchmove: 'onMouseMove',
    mouseup: 'onMouseUp',
    touchend: 'onMouseUp',
  }
}

namespace EventData {
  export interface Knob extends KeyValue {
    knobbing: boolean
    originX: number
    originY: number
    clientX: number
    clientY: number
  }
}
