import { getJudgeFunction } from '../fn'
import { normalizeWheel } from './normalizeWheel'
import { requestAnimationFrame } from './animationFrame'

export class WheelHandler {
  private deltaX: number

  private deltaY: number

  private callback: (deltaX: number, deltaY: number) => void

  private shouldHandleScrollX: (deltaX: number, deltaY: number) => boolean

  private shouldHandleScrollY: (deltaX: number, deltaY: number) => boolean

  private stopPropagation: () => boolean

  private animationFrameID: number | null

  constructor(options: WheelHandler.Options) {
    this.callback = options.onWheel
    this.stopPropagation = getJudgeFunction(options.stopPropagation)
    this.shouldHandleScrollX = getJudgeFunction(options.shouldHandleScrollX)
    this.shouldHandleScrollY = getJudgeFunction(options.shouldHandleScrollY)
    this.deltaX = 0
    this.deltaY = 0
  }

  onWheel = (e: React.WheelEvent) => {
    const normalizedEvent = normalizeWheel(e)
    const { pixelX, pixelY } = normalizedEvent
    const deltaX = this.deltaX + pixelX
    const deltaY = this.deltaY + pixelY
    const handleScrollX = this.shouldHandleScrollX(deltaX, deltaY)
    const handleScrollY = this.shouldHandleScrollY(deltaY, deltaX)

    if (!handleScrollX && !handleScrollY) {
      return
    }

    this.deltaX += handleScrollX ? pixelX : 0
    this.deltaY += handleScrollY ? pixelY : 0

    let changed
    if (this.deltaX !== 0 || this.deltaY !== 0) {
      if (this.stopPropagation()) {
        e.stopPropagation()
      }
      changed = true
    }

    if (changed === true && this.animationFrameID == null) {
      this.animationFrameID = requestAnimationFrame(this.didWheel)
    }
  }

  private didWheel = () => {
    this.animationFrameID = null
    if (this.callback) {
      this.callback(this.deltaX, this.deltaY)
    }
    this.deltaX = 0
    this.deltaY = 0
  }
}

export namespace WheelHandler {
  export interface Options {
    onWheel: (deltaX: number, deltaY: number) => void
    shouldHandleScrollX: boolean | ((deltaX: number, deltaY: number) => boolean)
    shouldHandleScrollY: boolean | ((deltaX: number, deltaY: number) => boolean)
    stopPropagation?: boolean | (() => boolean)
  }
}
