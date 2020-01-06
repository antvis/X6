import { DomUtil, DomEvent } from '../dom'
import { Graph } from '../graph'
import { MouseEventEx } from './mouse-event'
import { BaseHandler } from './base-handler'

export abstract class MouseHandler<EventArgs = any>
  extends BaseHandler<EventArgs>
  implements IMouseHandler {
  constructor(graph: Graph) {
    super(graph)
    this.graph.addHandler(this)
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
    return this.isEnabled() && this.graph.isEnabled() && !this.isConsumed(e)
  }

  isMultiTouchEvent(e: MouseEventEx) {
    return DomEvent.isMultiTouchEvent(e.getEvent())
  }

  isMouseDown() {
    return this.graph.eventloopManager.isMouseDown
  }

  isConsumed(e: MouseEventEx) {
    return e.isConsumed()
  }

  consume(e: MouseEventEx, eventName: string) {
    e.consume()
  }

  private mask: HTMLDivElement | null
  addMask(cursor?: string | null) {
    const mask = DomUtil.createElement('div') as HTMLDivElement
    mask.style.position = 'absolute'
    mask.style.zIndex = '9999'
    mask.style.left = '0'
    mask.style.top = '0'
    mask.style.right = '0'
    mask.style.bottom = '0'
    mask.style.border = '0'
    mask.style.background = 'rgba(255, 255, 255, 0)'
    this.mask = mask
    this.setMaskCursor(cursor)
    document.body.appendChild(mask)
  }

  removeMask() {
    DomUtil.remove(this.mask)
    this.mask = null
  }

  getMaskCursor() {
    return this.mask ? this.mask.style.cursor : null
  }

  setMaskCursor(cursor?: string | null) {
    if (this.mask) {
      this.mask.style.cursor = cursor == null ? '' : cursor
    }
  }

  private savedBodyCursor: string
  private savedContainerCursor: string
  setGlobalCursor(cursor?: string | null) {
    this.savedBodyCursor = document.body.style.cursor
    this.savedContainerCursor = this.graph.container.style.cursor
    document.body.style.cursor = cursor || ''
  }

  resetGlobalCursor() {
    document.body.style.cursor = this.savedBodyCursor
    this.graph.container.style.cursor = this.savedContainerCursor
    this.savedBodyCursor = ''
    this.savedContainerCursor = ''
  }

  mouseDown(e: MouseEventEx, sender?: any) {}

  mouseMove(e: MouseEventEx, sender?: any) {}

  mouseUp(e: MouseEventEx, sender?: any) {}
}

export interface IMouseHandler {
  mouseDown(e?: MouseEventEx, sender?: any): void
  mouseMove(e?: MouseEventEx, sender?: any): void
  mouseUp(e?: MouseEventEx, sender?: any): void
}
