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
      !e.isConsumed()
    )
  }

  isMultiTouchEvent(e: MouseEventEx) {
    return DomEvent.isMultiTouchEvent(e.getEvent())
  }

  consume(e: MouseEventEx, eventName: string) {
    e.consume()
  }

  mouseDown(e?: MouseEventEx, sender?: any) {
    throw new Error('Method not implemented.')
  }

  mouseMove(e?: MouseEventEx, sender?: any) {
    throw new Error('Method not implemented.')
  }

  mouseUp(e?: MouseEventEx, sender?: any) {
    throw new Error('Method not implemented.')
  }
}

export interface IMouseHandler {
  mouseDown(e?: MouseEventEx, sender?: any): void
  mouseMove(e?: MouseEventEx, sender?: any): void
  mouseUp(e?: MouseEventEx, sender?: any): void
}
