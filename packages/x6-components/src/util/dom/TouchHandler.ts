import { getJudgeFunction } from '../fn'
import { requestAnimationFrame } from './animationFrame'

export class TouchHandler {
  private deltaX: number
  private deltaY: number
  private lastTouchX: number
  private lastTouchY: number
  private velocityX: number
  private velocityY: number
  private accumulatedDeltaX: number
  private accumulatedDeltaY: number
  private lastFrameTimestamp: number
  private autoScrollTimestamp: number
  private trackerId: number | null
  private dragAnimationId: number | null
  private handleScrollX: (deltaX: number, deltaY: number) => boolean
  private handleScrollY: (deltaX: number, deltaY: number) => boolean
  private callback: (deltaX: number, deltaY: number) => void
  private stopPropagation: () => boolean

  constructor(options: TouchHandler.Options) {
    this.trackerId = null
    this.dragAnimationId = null

    this.deltaX = 0
    this.deltaY = 0

    this.lastTouchX = 0
    this.lastTouchY = 0

    this.velocityX = 0
    this.velocityY = 0

    this.accumulatedDeltaX = 0
    this.accumulatedDeltaY = 0

    this.lastFrameTimestamp = Date.now()
    this.autoScrollTimestamp = Date.now()

    this.callback = options.onTouchScroll
    this.handleScrollX = getJudgeFunction(options.shouldHandleScrollX)
    this.handleScrollY = getJudgeFunction(options.shouldHandleScrollY)
    this.stopPropagation = getJudgeFunction(options.stopPropagation)
  }

  onTouchStart(e: TouchEvent) {
    this.lastTouchX = e.touches[0].pageX
    this.lastTouchY = e.touches[0].pageY
    this.velocityX = 0
    this.velocityY = 0
    this.accumulatedDeltaX = 0
    this.accumulatedDeltaY = 0
    this.lastFrameTimestamp = Date.now()

    if (this.trackerId != null) {
      clearInterval(this.trackerId)
    }
    this.trackerId = window.setInterval(
      this.track,
      TouchHandler.TRACKER_TIMEOUT
    )

    if (this.stopPropagation()) {
      e.stopPropagation()
    }
  }

  onTouchEnd(e: TouchEvent) {
    this.onTouchCancel(e)
    requestAnimationFrame(this.startAutoScroll)
  }

  onTouchCancel(e: TouchEvent) {
    if (this.trackerId != null) {
      clearInterval(this.trackerId)
      this.trackerId = null
    }

    if (this.stopPropagation()) {
      e.stopPropagation()
    }
  }

  onTouchMove(e: TouchEvent) {
    const moveX = e.touches[0].pageX
    const moveY = e.touches[0].pageY

    // Compute delta scrolled since last drag
    // Mobile, scrolling is inverted
    this.deltaX = TouchHandler.MOVE_AMPLITUDE * (this.lastTouchX - moveX)
    this.deltaY = TouchHandler.MOVE_AMPLITUDE * (this.lastTouchY - moveY)

    const handleScrollX = this.handleScrollX(this.deltaX, this.deltaY)
    const handleScrollY = this.handleScrollY(this.deltaY, this.deltaX)
    if (!handleScrollX && !handleScrollY) {
      return
    }

    // If we can handle scroll update last touch for computing delta
    if (handleScrollX) {
      this.lastTouchX = moveX
    } else {
      this.deltaX = 0
    }

    if (handleScrollY) {
      this.lastTouchY = moveY
    } else {
      this.deltaY = 0
    }

    e.preventDefault()

    // ensure minimum delta magnitude is met to avoid jitter
    let changed = false
    if (Math.abs(this.deltaX) > 2 || Math.abs(this.deltaY) > 2) {
      if (this.stopPropagation()) {
        e.stopPropagation()
      }
      changed = true
    }

    // Request animation frame to trigger scroll of computed delta
    if (changed && this.dragAnimationId == null) {
      this.dragAnimationId = requestAnimationFrame(this.didTouchMove)
    }
  }

  didTouchMove = () => {
    // Fire scroll callback based on computed drag delta.
    // Also track accummulated delta so we can calculate velocity

    this.dragAnimationId = null

    this.callback(this.deltaX, this.deltaY)
    this.accumulatedDeltaX += this.deltaX
    this.accumulatedDeltaY += this.deltaY
    this.deltaX = 0
    this.deltaY = 0
  }

  track = () => {
    // Compute velocity based on a weighted average of drag over
    // last 100ms and previous velocity. Combining into a moving average
    // results in a smoother scroll.

    const now = Date.now()
    const elapsed = now - this.lastFrameTimestamp
    const oldVelocityX = this.velocityX
    const oldVelocityY = this.velocityY

    // We compute velocity using a weighted average of the current
    // velocity and the previous velocity. If the previous velocity
    // is 0, put the full weight on the last 100ms
    let weight = 0.8
    if (elapsed < TouchHandler.TRACKER_TIMEOUT) {
      weight *= elapsed / TouchHandler.TRACKER_TIMEOUT
    }

    if (oldVelocityX === 0 && oldVelocityY === 0) {
      weight = 1
    }

    // Formula for computing weighted average of velocity
    this.velocityX =
      weight *
      ((TouchHandler.TRACKER_TIMEOUT * this.accumulatedDeltaX) / (1 + elapsed))
    if (weight < 1) {
      this.velocityX += (1 - weight) * oldVelocityX
    }

    this.velocityY =
      weight *
      ((TouchHandler.TRACKER_TIMEOUT * this.accumulatedDeltaY) / (1 + elapsed))
    if (weight < 1) {
      this.velocityY += (1 - weight) * oldVelocityY
    }

    this.accumulatedDeltaX = 0
    this.accumulatedDeltaY = 0
    this.lastFrameTimestamp = now
  }

  startAutoScroll = () => {
    // To kick off deceleration / momentum scrolling, handle any
    // scrolling from a drag which was waiting for an animation
    // frame. Then update our velocity.
    // Finally start the momentum scrolling handler (autoScroll)

    this.autoScrollTimestamp = Date.now()
    if (this.deltaX > 0 || this.deltaY > 0) {
      this.didTouchMove()
    }
    this.track()
    this.autoScroll()
  }

  autoScroll = () => {
    // Compute a scroll delta with an exponential decay based on
    // time elapsed since drag was released. This is called
    // recursively on animation frames until the delta is below
    // a threshold (5 pixels)

    const elapsed = Date.now() - this.autoScrollTimestamp
    const factor =
      TouchHandler.DECELERATION_AMPLITUDE *
      Math.exp(-elapsed / TouchHandler.DECELERATION_FACTOR)
    let deltaX = factor * this.velocityX
    let deltaY = factor * this.velocityY

    if (Math.abs(deltaX) <= 5 || !this.handleScrollX(deltaX, deltaY)) {
      deltaX = 0
    }
    if (Math.abs(deltaY) <= 5 || !this.handleScrollY(deltaY, deltaX)) {
      deltaY = 0
    }

    if (deltaX !== 0 || deltaY !== 0) {
      this.callback(deltaX, deltaY)
      requestAnimationFrame(this.autoScroll)
    }
  }
}

export namespace TouchHandler {
  export const MOVE_AMPLITUDE = 1.6
  export const DECELERATION_AMPLITUDE = 1.6
  export const DECELERATION_FACTOR = 325
  export const TRACKER_TIMEOUT = 100

  export interface Options {
    onTouchScroll: (deltaX: number, deltaY: number) => void
    shouldHandleScrollX: boolean | ((deltaX: number, deltaY: number) => boolean)
    shouldHandleScrollY: boolean | ((deltaX: number, deltaY: number) => boolean)
    stopPropagation?: boolean | (() => boolean)
  }
}
