import { isEventSupported } from '../platform'
import type { OnWheelCallback, OnWheelGuard } from '../../types'
export class MouseWheelHandle {
  private target: HTMLElement | Document
  private onWheelCallback: OnWheelCallback
  private onWheelGuard?: OnWheelGuard
  private animationFrameId = 0
  private deltaX = 0
  private deltaY = 0
  private eventName = isEventSupported('wheel') ? 'wheel' : 'mousewheel'

  constructor(
    target: HTMLElement | Document,
    onWheelCallback: OnWheelCallback,
    onWheelGuard?: OnWheelGuard,
  ) {
    this.target = target
    this.onWheelCallback = onWheelCallback
    this.onWheelGuard = onWheelGuard
    this.onWheel = this.onWheel.bind(this)
    this.didWheel = this.didWheel.bind(this)
  }

  public enable() {
    this.target.addEventListener(this.eventName, this.onWheel, {
      passive: false,
    })
  }

  public disable() {
    this.target.removeEventListener(this.eventName, this.onWheel)
  }

  private onWheel(e: WheelEvent) {
    if (this.onWheelGuard != null && !this.onWheelGuard(e)) {
      return
    }

    this.deltaX += e.deltaX
    this.deltaY += e.deltaY
    e.preventDefault()

    let changed
    if (this.deltaX !== 0 || this.deltaY !== 0) {
      e.stopPropagation()
      changed = true
    }

    if (changed === true && this.animationFrameId === 0) {
      this.animationFrameId = requestAnimationFrame(() => {
        this.didWheel(e)
      })
    }
  }

  private didWheel(e: WheelEvent) {
    this.animationFrameId = 0
    this.onWheelCallback(e, this.deltaX, this.deltaY)
    this.deltaX = 0
    this.deltaY = 0
  }
}
