import addEventListener from 'rc-util/lib/Dom/addEventListener'
import { requestAnimationFrame, cancelAnimationFrame } from './animationFrame'
import { safeDocument } from './executionEnvironment'

export class MouseMoveTracker {
  private elem: HTMLElement | undefined

  private clientX: number

  private clientY: number

  private deltaX: number

  private deltaY: number

  private dragging: boolean

  private captured: boolean

  private animationFrameID: number | null

  private removeMouseMoveEvent: (() => void) | null

  private removeMouseUpEvent: (() => void) | null

  private onMouseMoveCallback: (
    deltaX: number,
    deltaY: number,
    pos?: MouseMoveTracker.ClientPosition,
  ) => void

  private onMouseMoveEndCallback: (cancel: boolean) => void

  constructor(options: MouseMoveTracker.Options) {
    this.elem =
      options.elem || safeDocument((document) => document.documentElement)
    this.onMouseMoveCallback = options.onMouseMove
    this.onMouseMoveEndCallback = options.onMouseMoveEnd
    this.animationFrameID = null
  }

  capture(e: React.MouseEvent) {
    if (!this.captured) {
      this.removeMouseMoveEvent = addEventListener(
        this.elem,
        'mousemove',
        this.onMouseMove,
      ).remove
      this.removeMouseUpEvent = addEventListener(
        this.elem,
        'mouseup',
        this.onMouseUp,
      ).remove
    }

    this.captured = true

    if (!this.dragging) {
      this.clientX = e.clientX
      this.clientY = e.clientY
      this.deltaX = 0
      this.deltaY = 0
      this.dragging = true
    }

    e.preventDefault()
  }

  release() {
    if (this.captured) {
      if (this.removeMouseMoveEvent != null) {
        this.removeMouseMoveEvent()
        this.removeMouseMoveEvent = null
      }

      if (this.removeMouseUpEvent != null) {
        this.removeMouseUpEvent()
        this.removeMouseUpEvent = null
      }
    }

    this.captured = false

    if (this.dragging) {
      this.dragging = false
      this.clientX = 0
      this.clientY = 0
      this.deltaX = 0
      this.deltaY = 0
    }
  }

  isDragging() {
    return this.dragging
  }

  onMouseMove = (e: MouseEvent) => {
    const x = e.clientX
    const y = e.clientY

    this.deltaX += x - this.clientX
    this.deltaY += y - this.clientY

    if (this.animationFrameID == null) {
      this.animationFrameID = requestAnimationFrame(
        this.triggerOnMouseMoveCallback,
      )
    }

    this.clientX = x
    this.clientY = y

    e.preventDefault()
  }

  onMouseUp = () => {
    if (this.animationFrameID) {
      cancelAnimationFrame(this.animationFrameID)
      this.triggerOnMouseMoveCallback()
    }

    this.triggerOnMouseMoveEndCallback(false)
  }

  triggerOnMouseMoveCallback = () => {
    this.animationFrameID = null
    this.onMouseMoveCallback(this.deltaX, this.deltaY, {
      clientX: this.clientX,
      clientY: this.clientY,
    })
    this.deltaX = 0
    this.deltaY = 0
  }

  triggerOnMouseMoveEndCallback = (cancel: boolean) => {
    this.onMouseMoveEndCallback(cancel)
  }
}

export namespace MouseMoveTracker {
  export interface ClientPosition {
    clientX: number
    clientY: number
  }
  export interface Options {
    elem?: HTMLElement
    onMouseMove: (deltaX: number, deltaY: number, pos?: ClientPosition) => void
    onMouseMoveEnd: (cancel: boolean) => void
  }
}
