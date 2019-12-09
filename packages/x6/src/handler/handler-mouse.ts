import * as util from '../util'
import { Graph } from '../graph'
import { DomEvent, MouseEventEx } from '../common'
import { BaseHandler } from './handler-base'

export abstract class MouseHandler extends BaseHandler
  implements IMouseHandler {
  constructor(graph: Graph) {
    super(graph)
    this.graph.addMouseListener(this)
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

  private overlay: HTMLDivElement | null
  addOverlay(cursor?: string | null) {
    const overlay = util.createElement('div') as HTMLDivElement
    overlay.style.position = 'absolute'
    overlay.style.zIndex = '99999'
    overlay.style.left = '0'
    overlay.style.top = '0'
    overlay.style.right = '0'
    overlay.style.bottom = '0'
    overlay.style.border = '0'
    overlay.style.background = 'rgba(255, 255, 255, 0)'
    this.overlay = overlay
    this.setOverlayCursor(cursor)
    document.body.appendChild(overlay)
  }

  removeOverlay() {
    util.removeElement(this.overlay)
    this.overlay = null
  }

  getOverlayCursor() {
    return this.overlay ? this.overlay.style.cursor : null
  }

  setOverlayCursor(cursor?: string | null) {
    if (this.overlay) {
      this.overlay.style.cursor = cursor == null ? '' : cursor
    }
  }

  private savedBodyCursor: string
  private savedContainerCursor: string
  setGlobalCursor(cursor: string | null | undefined) {
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
