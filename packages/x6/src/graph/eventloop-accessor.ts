import { Cell } from '../core/cell'
import { IMouseHandler } from '../handler'
import { DomEvent, MouseEventEx, detector } from '../common'
import { hook } from './decorator'
import { BaseGraph } from './base-graph'

export class EventLoopAccessor extends BaseGraph {
  /**
   * Adds a listener to the graph event dispatch loop. The listener
   * must implement the mouseDown, mouseMove and mouseUp
   */
  addMouseListener(handler: IMouseHandler) {
    this.eventloopManager.addMouseListener(handler)
    return this
  }

  removeMouseListener(handler: IMouseHandler) {
    this.eventloopManager.removeMouseListener(handler)
    return this
  }

  getPointForEvent(e: MouseEvent, addOffset: boolean = true) {
    return this.eventloopManager.getPointForEvent(e, addOffset)
  }

  /**
   * Dispatches the given event to the graph event dispatch loop.
   */
  fireMouseEvent(eventName: string, e: MouseEventEx, sender: any = this) {
    this.eventloopManager.fireMouseEvent(eventName, e, sender)
    return this
  }

  fireGestureEvent(e: MouseEvent, cell?: Cell) {
    this.eventloopManager.fireGestureEvent(e, cell)
    return this
  }

  @hook()
  isCloneEvent(e: MouseEvent) {
    return DomEvent.isControlDown(e)
  }

  @hook()
  isToggleEvent(e: MouseEvent) {
    return detector.IS_MAC ? DomEvent.isMetaDown(e) : DomEvent.isControlDown(e)
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
