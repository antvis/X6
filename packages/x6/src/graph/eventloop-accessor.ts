import { Platform } from '../util'
import { DomEvent } from '../dom'
import { hook } from './decorator'
import { IMouseHandler, MouseEventEx } from '../handler'
import { BaseGraph } from './base-graph'

export class EventLoopAccessor extends BaseGraph {
  /**
   * Adds a listener to the graph event dispatch loop. The listener
   * must implement the mouseDown, mouseMove and mouseUp
   */
  addHandler(handler: IMouseHandler) {
    this.eventloopManager.addHandler(handler)
    return this
  }

  removeHandler(handler: IMouseHandler) {
    this.eventloopManager.removeHandler(handler)
    return this
  }

  /**
   * Dispatches the given event to the graph event dispatch loop.
   */
  dispatchMouseEvent(
    eventName: 'mouseDown' | 'mouseMove' | 'mouseUp',
    e: MouseEventEx,
    sender: any = this,
  ) {
    this.eventloopManager.dispatchMouseEvent(eventName, e, sender)
    return this
  }

  @hook()
  isCloneEvent(e: MouseEvent) {
    return DomEvent.isControlDown(e)
  }

  @hook()
  isToggleEvent(e: MouseEvent) {
    return Platform.IS_MAC ? DomEvent.isMetaDown(e) : DomEvent.isControlDown(e)
  }

  @hook()
  isConstrainedEvent(e: MouseEvent) {
    return DomEvent.isShiftDown(e)
  }

  @hook()
  isGridEnabledForEvent(e: MouseEvent) {
    return e != null && !DomEvent.isAltDown(e)
  }

  @hook()
  isConnectionIgnored(e: MouseEvent) {
    return false
  }

  @hook()
  isTransparentClickEvent(e: MouseEvent) {
    return false
  }
}
