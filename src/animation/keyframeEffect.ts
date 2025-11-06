import { ArrayExt, ObjectExt } from '../common'
import type { Cell } from '../model/cell'
import { isNotReservedWord } from './utils'

/**
 * Web Animation API 的 KeyframeEffect 实现，功能完善实现中
 * 参考: https://developer.mozilla.org/en-US/docs/Web/API/KeyframeEffect
 */
export class KeyframeEffect {
  private _target: Cell | null
  private _keyframes: Keyframe[] | PropertyIndexedKeyframes | null
  private _computedKeyframes: ComputedKeyframe[] | null
  private _options: EffectTiming
  private _originProps?: Record<string, any> = {}

  constructor(
    target: Cell | null,
    keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
    options?: number | EffectTiming,
  ) {
    this._target = target
    this._keyframes = keyframes
    this._computedKeyframes = this.getKeyframes()

    if (typeof options === 'number') {
      this._options = { duration: options }
    } else {
      this._options = { ...options }
    }

    // 收集动画属性的原始值
    this._computedKeyframes.forEach((frame) => {
      Object.keys(frame).forEach((prop) => {
        if (isNotReservedWord(prop) && this._originProps[prop] == null) {
          this._originProps[prop] = this.target.getPropByPath(prop)
        }
      })
    })
  }

  get target(): Cell | null {
    return this._target
  }

  getKeyframes(): ComputedKeyframe[] {
    if (!this._keyframes || this._keyframes == null) return []

    // 标准化关键帧数据
    let normalizedFrames = []

    if (Array.isArray(this._keyframes)) {
      normalizedFrames = [...this._keyframes]
    }

    if (ObjectExt.isPlainObject(this._keyframes)) {
      Object.entries(this._keyframes).forEach(([prop, value]) => {
        if (isNotReservedWord(prop)) {
          ArrayExt.castArray(value).forEach((v) => {
            normalizedFrames.push({
              [prop]: v,
            })
          })
        }
      })
    }

    normalizedFrames = normalizedFrames.map((keyframe) => {
      const frame = keyframe ?? {}
      const normalized: Record<string, any> = {}

      normalized.offset = frame.offset
      // 确保每个关键帧都有 easing
      normalized.easing = frame.easing || 'linear'

      // 复制其他属性
      Object.keys(frame).forEach((prop) => {
        if (isNotReservedWord(prop)) {
          normalized[prop] = frame[prop]
        }
      })
      return normalized
    })

    // 计算 computedOffset
    normalizedFrames = normalizedFrames.map((frame, index) => {
      // 如果 offset 未定义或为 null，则自动计算
      if (frame.offset == null) {
        if (index === normalizedFrames.length - 1) {
          frame.computedOffset = 1
        } else if (index === 0) {
          frame.computedOffset = 0
        } else {
          // 均匀分布中间关键帧
          frame.computedOffset = index / (normalizedFrames.length - 1)
        }
      } else {
        frame.computedOffset = frame.offset
      }

      return frame
    })

    return normalizedFrames
  }

  setKeyframes(keyframes: Keyframe[] | PropertyIndexedKeyframes | null): void {
    this._keyframes = keyframes
    this._computedKeyframes = this.getKeyframes()
  }

  getTiming(): EffectTiming {
    return ObjectExt.defaults(this._options, defaultTiming)
  }

  getComputedTiming(): EffectTiming {
    return this.getTiming()
  }

  apply(currentTime: number | null): void {
    if (!this._target || !this._computedKeyframes.length) return

    // 参数为null则回到初始状态
    if (currentTime == null) {
      Object.entries(this._originProps).forEach(([prop, value]) => {
        this.target.setPropByPath(prop, value)
      })
      return
    }

    const timing = this.getComputedTiming()
    const duration = timing.duration as number
    if (duration <= 0) return

    // 计算进度 (0-1)
    const progress = Math.min(currentTime / duration, 1)

    // 找到当前进度对应的关键帧
    const frames = this._computedKeyframes
    if (frames.length === 0) return

    let startFrame = {} as ComputedKeyframe
    let endFrame = {} as ComputedKeyframe

    for (const frame of frames) {
      if (frame.computedOffset <= progress) {
        startFrame = frame
      }
      if (frame.computedOffset > progress) {
        endFrame = frame
        break
      }
    }

    // 计算两个关键帧之间的插值
    const startOffset = startFrame.computedOffset ?? 0
    const endOffset = endFrame.computedOffset ?? 1
    const frameProgress = (progress - startOffset) / (endOffset - startOffset)

    // 应用插值后的样式
    for (const prop in endFrame) {
      if (
        isNotReservedWord(prop) &&
        (startFrame[prop] != null || endFrame[prop] != null)
      ) {
        const startValue = startFrame[prop] ?? this._originProps[prop]
        const endValue = endFrame[prop] ?? this._originProps[prop]

        if (typeof startValue === 'number' && typeof endValue === 'number') {
          const value = startValue + (endValue - startValue) * frameProgress
          this.target.setPropByPath(prop, value)
        }
      }
    }
  }
}

export interface EffectTiming {
  delay?: number
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
  duration?: number
  easing?: string
  fill?: 'none' | 'forwards' | 'backwards' | 'both'
  iterations?: number
}

const defaultTiming: EffectTiming = {
  delay: 0,
  direction: 'normal',
  duration: 0,
  easing: 'linear',
  fill: 'none',
  iterations: 1,
}
