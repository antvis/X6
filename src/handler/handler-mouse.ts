import { Graph } from '../core'
import { DomEvent, MouseEventEx } from '../common'
import { BaseHandler } from './handler-base'

export class MouseHandler extends BaseHandler implements IMouseHandler {
  constructor(graph: Graph) {
    super(graph)
  }

  getState(e: MouseEventEx) {
    return e.getState()
  }

  getCell(e: MouseEventEx) {
    return e.getCell()
  }

  isOnCell(e: MouseEventEx) {
    return this.getState(e) != null
  }

  isValid(e: MouseEventEx) {
    return (
      this.isEnabled() &&
      this.graph.isEnabled() &&
      !this.isConsumed(e)
    )
  }

  isMultiTouchEvent(e: MouseEventEx) {
    return DomEvent.isMultiTouchEvent(e.getEvent())
  }

  isMouseDown() {
    return this.graph.eventloop.isMouseDown
  }

  isConsumed(e: MouseEventEx) {
    return e.isConsumed()
  }

  consume(e: MouseEventEx, eventName: string) {
    e.consume()
  }

  mouseDown(e: MouseEventEx, sender?: any) { }

  mouseMove(e: MouseEventEx, sender?: any) { }

  mouseUp(e: MouseEventEx, sender?: any) { }
}

export interface IMouseHandler {
  mouseDown(e?: MouseEventEx, sender?: any): void
  mouseMove(e?: MouseEventEx, sender?: any): void
  mouseUp(e?: MouseEventEx, sender?: any): void
}
