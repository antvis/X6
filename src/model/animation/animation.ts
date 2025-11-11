import { AnimationPlaybackEvent } from './animationEvent'
import type { KeyframeEffect } from './keyframeEffect'
import { isReverseDirection } from './utils'

/**
 * Web Animation API 的 Animation 实现，功能完善实现中
 * 参考: https://developer.mozilla.org/en-US/docs/Web/API/Animation
 */
export class Animation {
  private _effect: KeyframeEffect | null = null
  private _currentTime: number | null = null
  private _playbackRate = 1
  private _playState: AnimationPlayState = 'idle'
  private _rafId: number | null = null
  private _startTime: number | null = null
  private _pausedTime: number | null = null
  private _timeline: AnimationTimeline = null
  public id = ''
  public onfinish: ((e: AnimationPlaybackEvent) => void) | null = null
  public oncancel: ((e: AnimationPlaybackEvent) => void) | null = null

  constructor(
    effect: KeyframeEffect | null,
    timeline?: AnimationTimeline | null,
  ) {
    this._effect = effect
    this._timeline = timeline ?? document.timeline
  }

  get effect(): KeyframeEffect | null {
    return this._effect
  }

  get currentTime(): number | null {
    return this._currentTime
  }

  set currentTime(value: number | null) {
    const now = this._timeline.currentTime as number
    this._startTime = now - value
    this._currentTime = value
  }

  get playbackRate(): number {
    return this._playbackRate
  }

  set playbackRate(value: number) {
    this._playbackRate = value
  }

  get playState(): AnimationPlayState {
    return this._playState
  }

  get timeline(): AnimationTimeline | null {
    return this._timeline
  }

  play(): void {
    if (this._playState === 'running' || !this._effect) return

    const now = this._timeline.currentTime as number

    if (now == null) return

    if (this._playState === 'paused') {
      // 从暂停状态恢复
      this._startTime = now - this._pausedTime / this._playbackRate
      this._pausedTime = null
    } else {
      // 新开始播放
      this._currentTime = 0
      this._startTime = now
    }

    this._playState = 'running'
    this._tick()
  }

  pause(): void {
    if (this._playState !== 'running') return

    if (this._rafId) {
      cancelAnimationFrame(this._rafId)
      this._rafId = null
    }

    this._pausedTime = this._currentTime
    this._playState = 'paused'
  }

  finish(): void {
    if (!this._effect) return

    const timing = this._effect.getComputedTiming()
    const { duration, delay, activeDuration, direction, fill, iterations } =
      timing

    // 根据 fill 模式设置最终状态
    if (fill === 'forwards' || fill === 'both') {
      const reverseDirection = isReverseDirection(direction, iterations - 1)
      this._effect.apply(reverseDirection ? 0 : duration)
    }
    // 清除所有动画效果
    else if (fill === 'none' || fill === 'backwards') {
      this._effect.apply(null)
    }

    this._currentTime = activeDuration + delay
    this._playState = 'finished'

    if (this._rafId) {
      cancelAnimationFrame(this._rafId)
      this._rafId = null
    }

    const event = new AnimationPlaybackEvent(
      this,
      'finish',
      this._currentTime,
      this._timeline.currentTime as number,
    )

    this.onfinish?.(event)
    this._effect.target.notify('animation:finish', event)
  }

  cancel(): void {
    if (!this._effect) return

    if (this._rafId) {
      cancelAnimationFrame(this._rafId)
      this._rafId = null
    }
    this._playState = 'idle'
    this._currentTime = null
    this._startTime = null
    this._pausedTime = null
    this._effect.apply(null)
    const event = new AnimationPlaybackEvent(
      this,
      'cancel',
      this._currentTime,
      this._timeline.currentTime as number,
    )
    this.oncancel?.(event)
    this._effect.target.notify('animation:cancel', event)
  }

  updatePlaybackRate(playbackRate: number): void {
    this._playbackRate = playbackRate
  }

  private _tick(): void {
    if (this._playState !== 'running' || !this._effect) return

    const now = this._timeline.currentTime as number
    const currentTIme = (now - this._startTime) * this._playbackRate
    const timing = this._effect.getComputedTiming()
    const { duration, delay, iterations } = timing

    if (currentTIme >= delay && duration > 0) {
      const elapsed = currentTIme - delay
      const timing = this._effect.getComputedTiming()

      // 处理迭代和方向
      let currentIteration = Math.floor(elapsed / duration)
      if (currentIteration >= iterations && iterations !== Infinity) {
        this.finish()
        return
      }

      // 计算当前迭代的进度
      let iterationTime = elapsed % duration
      currentIteration = Math.min(currentIteration, iterations - 1)

      // 处理播放方向
      if (isReverseDirection(timing.direction, currentIteration)) {
        iterationTime = duration - iterationTime
      }

      // 应用动画效果
      this._effect.apply(iterationTime)
    }

    this._currentTime = currentTIme
    this._rafId = requestAnimationFrame(() => this._tick())
  }
}
