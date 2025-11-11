import type { Cell } from '../cell'
import type { Animation } from './animation'

/**
 * Web Animation API 的 AnimationPlaybackEvent 实现
 * 参考: https://developer.mozilla.org/en-US/docs/Web/API/KeyframeEffect
 */
export class AnimationPlaybackEvent {
  target: Animation
  type: string
  bubbles: boolean
  currentTarget: Animation
  defaultPrevented: boolean
  eventPhase: number
  timeStamp: number
  currentTime: number
  timelineTime: number
  cell: Cell

  constructor(
    target: Animation,
    type: string,
    currentTime: number | null,
    timelineTime: number | null,
  ) {
    this.target = target
    this.cell = this.target.effect.target
    this.type = type
    this.bubbles = false
    this.currentTarget = target
    this.defaultPrevented = false
    this.eventPhase = 0
    this.timeStamp = performance.now()
    this.currentTime = currentTime
    this.timelineTime = timelineTime
  }
}
