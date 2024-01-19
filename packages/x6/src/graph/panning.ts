import { ModifierKey, Dom } from '@antv/x6-common'
import { Base } from './base'

export class PanningManager extends Base {
  private panning: boolean
  private clientX: number
  private clientY: number
  private mousewheelHandle: Dom.MouseWheelHandle
  private isSpaceKeyPressed: boolean

  protected get widgetOptions() {
    return this.options.panning
  }

  get pannable() {
    return this.widgetOptions && this.widgetOptions.enabled === true
  }

  protected init() {
    this.onRightMouseDown = this.onRightMouseDown.bind(this)
    this.onSpaceKeyDown = this.onSpaceKeyDown.bind(this)
    this.onSpaceKeyUp = this.onSpaceKeyUp.bind(this)
    this.startListening()
    this.updateClassName()
  }

  protected startListening() {
    this.graph.on('blank:mousedown', this.onMouseDown, this)
    this.graph.on('node:unhandled:mousedown', this.onMouseDown, this)
    this.graph.on('edge:unhandled:mousedown', this.onMouseDown, this)
    Dom.Event.on(this.graph.container, 'mousedown', this.onRightMouseDown)
    Dom.Event.on(document.body, {
      keydown: this.onSpaceKeyDown,
      keyup: this.onSpaceKeyUp,
    })
    this.mousewheelHandle = new Dom.MouseWheelHandle(
      this.graph.container,
      this.onMouseWheel.bind(this),
      this.allowMouseWheel.bind(this),
    )
    this.mousewheelHandle.enable()
  }

  protected stopListening() {
    this.graph.off('blank:mousedown', this.onMouseDown, this)
    this.graph.off('node:unhandled:mousedown', this.onMouseDown, this)
    this.graph.off('edge:unhandled:mousedown', this.onMouseDown, this)
    Dom.Event.off(this.graph.container, 'mousedown', this.onRightMouseDown)
    Dom.Event.off(document.body, {
      keydown: this.onSpaceKeyDown,
      keyup: this.onSpaceKeyUp,
    })
    if (this.mousewheelHandle) {
      this.mousewheelHandle.disable()
    }
  }

  allowPanning(e: Dom.MouseDownEvent, strict?: boolean) {
    ;(e as any).spaceKey = this.isSpaceKeyPressed
    return (
      this.pannable &&
      ModifierKey.isMatch(
        e,
        this.widgetOptions.modifiers as ModifierKey,
        strict,
      )
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
    this.graph.translateBy(dx, dy)
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

  protected onMouseDown({ e }: { e: Dom.MouseDownEvent }) {
    if (!this.allowBlankMouseDown(e)) {
      return
    }

    const selection = this.graph.getPlugin<any>('selection')
    const allowRubberband = selection && selection.allowRubberband(e, true)
    if (
      this.allowPanning(e, true) ||
      (this.allowPanning(e) && !allowRubberband)
    ) {
      this.startPanning(e)
    }
  }

  protected onRightMouseDown(e: Dom.MouseDownEvent) {
    const eventTypes = this.widgetOptions.eventTypes
    if (!(eventTypes?.includes('rightMouseDown') && e.button === 2)) {
      return
    }
    if (this.allowPanning(e, true)) {
      this.startPanning(e)
    }
  }

  protected onMouseWheel(e: WheelEvent, deltaX: number, deltaY: number) {
    this.graph.translateBy(-deltaX, -deltaY)
  }

  protected onSpaceKeyDown(e: Dom.KeyDownEvent) {
    if (e.which === 32) {
      this.isSpaceKeyPressed = true
    }
  }
  protected onSpaceKeyUp(e: Dom.KeyUpEvent) {
    if (e.which === 32) {
      this.isSpaceKeyPressed = false
    }
  }
  protected allowBlankMouseDown(e: Dom.MouseDownEvent) {
    const eventTypes = this.widgetOptions.eventTypes
    return (
      (eventTypes?.includes('leftMouseDown') && e.button === 0) ||
      (eventTypes?.includes('mouseWheelDown') && e.button === 1)
    )
  }

  protected allowMouseWheel(e: WheelEvent) {
    return (
      this.pannable &&
      !e.ctrlKey &&
      this.widgetOptions.eventTypes?.includes('mouseWheel')
    )
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
  type EventType =
    | 'leftMouseDown'
    | 'rightMouseDown'
    | 'mouseWheel'
    | 'mouseWheelDown'
  export interface Options {
    enabled?: boolean
    modifiers?: string | Array<ModifierKey | 'space'> | null
    eventTypes?: EventType[]
  }
}
