import { Graph } from '../core'
import { CustomMouseEvent } from '../common'
import { BaseHandler } from './handler-base'

export class MouseHandler extends BaseHandler implements IMouseHandler {
  constructor(graph: Graph) {
    super(graph)
  }

  getState(e: CustomMouseEvent) {
    return e.getState()
  }

  getCell(e: CustomMouseEvent) {
    return e.getCell()
  }

  consume(e: CustomMouseEvent, eventName: string) {
    e.consume()
  }

  mouseDown(e?: CustomMouseEvent, sender?: any) {
    throw new Error('Method not implemented.')
  }

  mouseMove(e?: CustomMouseEvent, sender?: any) {
    throw new Error('Method not implemented.')
  }

  mouseUp(e?: CustomMouseEvent, sender?: any) {
    throw new Error('Method not implemented.')
  }
}

export interface IMouseHandler {
  mouseDown(e?: CustomMouseEvent, sender?: any): void
  mouseMove(e?: CustomMouseEvent, sender?: any): void
  mouseUp(e?: CustomMouseEvent, sender?: any): void
}
