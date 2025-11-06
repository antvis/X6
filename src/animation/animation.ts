import type { KeyframeEffect } from './keyframeEffect'

/**
 * Web Animation API 的 Animation 实现，功能完善实现中
 * 参考: https://developer.mozilla.org/en-US/docs/Web/API/Animation
 */
export class Animation {
  private _effect: KeyframeEffect | null
  private _currentTime: number | null = null
  private _playbackRate = 1
  private _playState: AnimationPlayState = 'idle'
  private _rafId: number | null = null
  private _startTime: number | null = null
  private _pausedTime: number | null = null
  public onfinish: (() => void) | null = null
  public oncancel: (() => void) | null = null

  constructor(effect?: KeyframeEffect | null) {
    this._effect = effect || null
  }

  get effect(): KeyframeEffect | null {
    return this._effect
  }

  get currentTime(): number | null {
    return this._currentTime
  }

  set currentTime(value: number | null) {
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

  play(): void {
    if (this._playState === 'running') return
    const timing = this.effect.getComputedTiming()

    if (this._playState === 'paused') {
      // 从暂停状态恢复
      this._pausedTime = null
      this._playState = 'running'
      setTimeout(() => {
        this._startTime = performance.now() - this._pausedTime
        this._tick()
      }, timing.delay - this._pausedTime)
    } else {
      // 新开始播放
      this._currentTime = 0
      this._playState = 'running'
      setTimeout(() => {
        this._startTime = performance.now()
        this._tick()
      }, timing.delay)
    }
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
    if (this._effect) {
      const timing = this._effect.getComputedTiming()
      // 根据 fill 模式设置最终状态
      if (timing.fill === 'forwards' || timing.fill === 'both') {
        const duration = timing.duration
        this._currentTime = timing.direction === 'reverse' ? 0 : duration
        this._effect.apply(this._currentTime)
      } else if (timing.fill === 'none' || timing.fill === 'backwards') {
        // 清除所有动画效果
        this._effect.apply(null)
        this._currentTime = null
      } else {
        this._currentTime = null
      }
    }

    this._playState = 'finished'

    if (this._rafId) {
      cancelAnimationFrame(this._rafId)
      this._rafId = null
    }

    // TODO: 确定参数
    this.onfinish?.()
    this.effect.target.notify('animation:finish', {})
  }

  cancel(): void {
    if (this._rafId) {
      cancelAnimationFrame(this._rafId)
      this._rafId = null
    }
    this._playState = 'idle'
    this._currentTime = null
    this._startTime = null
    this._pausedTime = null
    // TODO: 确定参数
    this.oncancel?.()
    this.effect.target.notify('animation:cancel', {})
  }

  reverse(): void {
    this._playbackRate *= -1
    if (this._playState === 'running') {
      this.play()
    }
  }

  updatePlaybackRate(playbackRate: number): void {
    this._playbackRate = playbackRate
  }

  private _tick(): void {
    if (this._playState !== 'running') return

    const now = performance.now()
    const elapsed = (now - (this._startTime || 0)) * this._playbackRate

    if (this._effect) {
      const timing = this._effect.getComputedTiming()
      const duration = timing.duration as number
      const iterations = timing.iterations || 1

      // 处理backwards fill模式
      if (
        elapsed < 0 &&
        (timing.fill === 'backwards' || timing.fill === 'both')
      ) {
        this._effect.apply(0) // 应用第一帧
        this._rafId = requestAnimationFrame(() => this._tick())
        return
      }

      if (duration > 0) {
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
        if (
          timing.direction === 'reverse' ||
          (timing.direction === 'alternate' && currentIteration % 2 === 1) ||
          (timing.direction === 'alternate-reverse' &&
            currentIteration % 2 === 0)
        ) {
          iterationTime = duration - iterationTime
        }

        this._currentTime = iterationTime
      }
    }

    // 应用动画效果
    if (this._effect) {
      this._effect.apply(this._currentTime)
    }

    this._rafId = requestAnimationFrame(() => this._tick())
  }
}
