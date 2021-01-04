import { Widget } from '../common'
import { KeyValue } from '../../types'
import { Cell } from '../../model/cell'
import { Node } from '../../model/node'
import { Edge } from '../../model/edge'
import { NodeView } from '../../view/node'
import { EdgeView } from '../../view/edge'
import { Graph } from '../../graph/graph'
import { Dom } from '../../util'

export class Knob extends Widget<Knob.Options> {
  public container: HTMLDivElement

  protected get node() {
    return this.cell as Node
  }

  protected get metadata() {
    return this.cell.prop('knob') as Knob.Metadata
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
    this.model.on('reseted', this.remove, this)
    this.node.on('removed', this.remove, this)
    this.view.on('node:resize', this.onTransform, this)
    this.view.on('node:rotate', this.onTransform, this)
    this.view.on('node:resized', this.onTransformed, this)
    this.view.on('node:rotated', this.onTransformed, this)

    this.graph.on('scale', this.update, this)
    this.graph.on('translate', this.update, this)

    super.startListening()
  }

  protected stopListening() {
    this.undelegateEvents()

    this.model.off('*', this.update, this)
    this.model.off('reseted', this.remove, this)
    this.node.off('removed', this.remove, this)
    this.view.off('node:resize', this.onTransform, this)
    this.view.off('node:rotate', this.onTransform, this)
    this.view.off('node:resized', this.onTransformed, this)
    this.view.off('node:rotated', this.onTransformed, this)

    this.graph.off('scale', this.update, this)
    this.graph.off('translate', this.update, this)

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
    if (this.metadata && this.metadata.update) {
      this.metadata.update.call(this.graph, {
        knob: this,
        cell: this.cell,
        node: this.node,
      })
    }
  }

  protected onTransform() {
    this.container.style.display = 'none'
  }

  protected onTransformed() {
    this.container.style.display = ''
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
      })

      if (this.cell.isNode()) {
        this.view.notify(`node:${name}`, {
          e,
          view: this.view as NodeView,
          node: this.node,
          cell: this.cell,
          x: localPoint.x,
          y: localPoint.y,
        })
      } else if (this.cell.isEdge()) {
        this.view.notify(`edge:${name}`, {
          e,
          view: this.view as EdgeView,
          edge: this.cell as Edge,
          cell: this.cell,
          x: localPoint.x,
          y: localPoint.y,
        })
      }
    }
  }

  protected onMouseDown(e: JQuery.MouseDownEvent) {
    e.stopPropagation()

    this.setEventData<EventData.Knob>(e, {
      knobbing: false,
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
    this.notify('knob', e)
  }

  protected onMouseMove(e: JQuery.MouseMoveEvent) {
    const data = this.getEventData<EventData.Knob>(e)
    const view = this.graph.findViewByCell(this.node) as NodeView

    if (!data.knobbing) {
      data.knobbing = true
      if (view) {
        view.addClass(Private.KNOBBING)
      }
      this.model.startBatch('knob', { cid: this.cid })
    }

    if (this.metadata && this.metadata.onMouseMove) {
      this.metadata.onMouseMove.call(this.graph, {
        e,
        data,
        knob: this,
        cell: this.cell,
        node: this.node,
      })
    }
    this.notify('knobbing', e)
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
  }
}

export namespace Knob {
  export interface Options extends Widget.Options {
    className?: string
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
    onMouseDown?: (
      this: Graph,
      args: HandlerArgs<JQuery.MouseDownEvent>,
    ) => void
    onMouseMove?: (
      this: Graph,
      args: HandlerArgs<JQuery.MouseMoveEvent>,
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
  }
}
