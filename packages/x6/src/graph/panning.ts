import { ModifierKey, Dom } from '@antv/x6-common'
import { Base } from './base'

export class PanningManager extends Base {
  private panning: boolean
  private clientX: number
  private clientY: number
  private mousewheelHandle: Dom.MouseWheelHandle

  protected get widgetOptions() {
    return this.options.panning
  }

  get pannable() {
    return this.widgetOptions && this.widgetOptions.enabled === true
  }

  protected init() {
    this.startListening()
    this.updateClassName()
  }

  protected startListening() {
    const eventTypes = this.widgetOptions.eventTypes
    if (!eventTypes) {
      return
    }
    if (eventTypes.includes('leftMouseDown')) {
      this.graph.on('blank:mousedown', this.preparePanning, this)
      this.graph.on('node:unhandled:mousedown', this.preparePanning, this)
      this.graph.on('edge:unhandled:mousedown', this.preparePanning, this)
    }
    if (eventTypes.includes('rightMouseDown')) {
      this.onRightMouseDown = this.onRightMouseDown.bind(this)
      Dom.Event.on(this.graph.container, 'mousedown', this.onRightMouseDown)
    }
    if (eventTypes.includes('mouseWheel')) {
      this.mousewheelHandle = new Dom.MouseWheelHandle(
        this.graph.container,
        this.onMouseWheel.bind(this),
        this.allowMouseWheel.bind(this),
      )
      this.mousewheelHandle.enable()
    }
  }

  protected stopListening() {
    const eventTypes = this.widgetOptions.eventTypes
    if (!eventTypes) {
      return
    }
    if (eventTypes.includes('leftMouseDown')) {
      this.graph.off('blank:mousedown', this.preparePanning, this)
      this.graph.off('node:unhandled:mousedown', this.preparePanning, this)
      this.graph.off('edge:unhandled:mousedown', this.preparePanning, this)
    }
    if (eventTypes.includes('rightMouseDown')) {
      Dom.Event.off(this.graph.container, 'mousedown', this.onRightMouseDown)
    }
    if (eventTypes.includes('mouseWheel')) {
      if (this.mousewheelHandle) {
        this.mousewheelHandle.disable()
      }
    }
  }

  protected preparePanning({ e }: { e: Dom.MouseDownEvent }) {
    const selection = this.graph.getPlugin<any>('selection')
    const allowRubberband = selection && selection.allowRubberband(e, true)
    if (
      this.allowPanning(e, true) ||
      (this.allowPanning(e) && !allowRubberband)
    ) {
      this.startPanning(e)
    }
  }

  allowPanning(e: Dom.MouseDownEvent, strict?: boolean) {
    return (
      this.pannable &&
      ModifierKey.isMatch(e, this.widgetOptions.modifiers, strict)
    )
  }

  protected startPanning(evt: Dom.MouseDownEvent) {
    const e = this.view.normalizeEvent(evt)
    this.clientX = e.clientX
    this.clientY = e.clientY
    this.panning = true
    this.updateClassName()
    Dom.Event.on(document.body, {
      'mousemove.panning touchmove.panning': this.pan.bind(this),
      'mouseup.panning touchend.panning': this.stopPanning.bind(this),
      'mouseleave.panning': this.stopPanning.bind(this),
    })
    Dom.Event.on(window as any, 'mouseup.panning', this.stopPanning.bind(this))
  }

  protected pan(evt: Dom.MouseMoveEvent) {
    const e = this.view.normalizeEvent(evt)
    const dx = e.clientX - this.clientX
    const dy = e.clientY - this.clientY
    this.clientX = e.clientX
    this.clientY = e.clientY
    const ts = this.graph.transform.getTranslation()
    const tx = ts.tx + dx
    const ty = ts.ty + dy
    this.graph.transform.translate(tx, ty, { ui: true })
  }

  // eslint-disable-next-line
  protected stopPanning(e: Dom.MouseUpEvent) {
    this.panning = false
    this.updateClassName()
    Dom.Event.off(document.body, '.panning')
    Dom.Event.off(window as any, '.panning')
  }

  protected updateClassName() {
    const container = this.view.container
    const panning = this.view.prefixClassName('graph-panning')
    const pannable = this.view.prefixClassName('graph-pannable')
    if (this.pannable) {
      if (this.panning) {
        Dom.addClass(container, panning)
        Dom.removeClass(container, pannable)
      } else {
        Dom.removeClass(container, panning)
        Dom.addClass(container, pannable)
      }
    } else {
      Dom.removeClass(container, panning)
      Dom.removeClass(container, pannable)
    }
  }

  protected onRightMouseDown(e: Dom.MouseDownEvent) {
    if (e.button === 2 && this.allowPanning(e, true)) {
      this.startPanning(e)
    }
  }

  protected allowMouseWheel(e: WheelEvent) {
    return this.pannable && !e.ctrlKey
  }

  protected onMouseWheel(e: WheelEvent, deltaX: number, deltaY: number) {
    if (!e.ctrlKey) {
      this.graph.translateBy(-deltaX, -deltaY)
    }
  }

  autoPanning(x: number, y: number) {
    const buffer = 10
    const graphArea = this.graph.getGraphArea()

    let dx = 0
    let dy = 0
    if (x <= graphArea.left + buffer) {
      dx = -buffer
    }

    if (y <= graphArea.top + buffer) {
      dy = -buffer
    }

    if (x >= graphArea.right - buffer) {
      dx = buffer
    }

    if (y >= graphArea.bottom - buffer) {
      dy = buffer
    }

    if (dx !== 0 || dy !== 0) {
      this.graph.translateBy(-dx, -dy)
    }
  }

  enablePanning() {
    if (!this.pannable) {
      this.widgetOptions.enabled = true
      this.updateClassName()
    }
  }

  disablePanning() {
    if (this.pannable) {
      this.widgetOptions.enabled = false
      this.updateClassName()
    }
  }

  @Base.dispose()
  dispose() {
    this.stopListening()
  }
}

export namespace PanningManager {
  type EventType = 'leftMouseDown' | 'rightMouseDown' | 'mouseWheel'
  export interface Options {
    enabled?: boolean
    modifiers?: string | ModifierKey[] | null
    eventTypes?: EventType[]
  }
}
