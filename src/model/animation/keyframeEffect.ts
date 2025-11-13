import {
  ArrayExt,
  Interp,
  NumberExt,
  ObjectExt,
  StringExt,
  Timing,
} from '../../common'
import type { CamelToKebabCase } from '../../types'
import type { Cell } from '../cell'
import { isNotReservedWord } from './utils'

/**
 * Web Animation API 的 KeyframeEffect 实现，功能完善实现中
 * 参考: https://developer.mozilla.org/en-US/docs/Web/API/KeyframeEffect
 */
export class KeyframeEffect {
  private _target: Cell
  private _keyframes: Keyframe[] | PropertyIndexedKeyframes | null
  private _computedKeyframes: ComputedKeyframe[]
  private _options: KeyframeAnimationOptions
  // biome-ignore lint/suspicious/noExplicitAny: <属性类型存在多种可能>
  private _originProps?: Record<string, any> = {}

  constructor(
    target: Cell,
    keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
    options?: number | KeyframeAnimationOptions,
  ) {
    this._target = target
    this._options = NumberExt.isNumber(options)
      ? { duration: options }
      : { ...options }
    this.setKeyframes(keyframes)
  }

  get target(): Cell | null {
    return this._target
  }

  getKeyframes(): ComputedKeyframe[] {
    if (!this._keyframes || this._keyframes.length === 0) return []

    // 标准化关键帧数据
    let normalizedFrames = []

    if (Array.isArray(this._keyframes)) {
      normalizedFrames = [...this._keyframes]
    }

    // 处理对象形式的关键帧,eg: {'position/x': [0, 100],'position/y': 100 }
    if (ObjectExt.isPlainObject(this._keyframes)) {
      const frameValues = Object.values(this._keyframes)
      const frameValuesArr = frameValues.map(
        (subArr) => ArrayExt.castArray(subArr).length,
      )
      const maxFramesLength = Math.max(...frameValuesArr)

      for (let i = 0; i < maxFramesLength; i++) {
        const frame = {} as ComputedKeyframe
        Object.entries(this._keyframes).forEach(([prop, value]) => {
          const v = ArrayExt.castArray(value)[i]
          if (isNotReservedWord(prop) && v != null) {
            frame[prop] = v
          }
        })
        normalizedFrames.push(frame)
      }
    }

    normalizedFrames = normalizedFrames.map((keyframe, index, arr) => {
      const frame = keyframe ?? {}
      // biome-ignore lint/suspicious/noExplicitAny: <属性类型存在多种可能>
      const normalized: Record<string, any> = {}

      normalized.offset = frame.offset
      // 确保每个关键帧都有 easing
      normalized.easing =
        frame.easing ??
        arr[index - 1]?.easing ??
        this.getComputedTiming().easing

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
    // 收集动画属性的原始值
    this._computedKeyframes.forEach((frame) => {
      Object.keys(frame).forEach((prop) => {
        if (isNotReservedWord(prop) && this._originProps[prop] == null) {
          this._originProps[prop] = this.target.getPropByPath(prop)
        }
      })
    })
  }

  getTiming(): EffectTiming {
    return ObjectExt.defaults(this._options, defaultTiming)
  }

  getComputedTiming(): ComputedEffectTiming {
    const timing = this.getTiming()
    const activeDuration = timing.duration * timing.iterations

    return {
      ...timing,
      activeDuration,
      endTime: activeDuration + timing.delay,
    }
  }

  apply(iterationTime: number | null): void {
    if (!this._target || !this._computedKeyframes.length) return

    // 参数为null则回到初始状态
    if (iterationTime == null) {
      Object.entries(this._originProps).forEach(([prop, value]) => {
        this.target.setPropByPath(prop, value)
      })
      return
    }

    const timing = this.getComputedTiming()
    const duration = timing.duration
    if (duration < 0) return

    // 计算进度 (0-1)
    const progress = Math.min(iterationTime / duration, 1)

    // 找到当前进度对应的关键帧
    const frames = this._computedKeyframes
    if (frames.length === 0) return

    let startFrame = { computedOffset: 0 } as ComputedKeyframe
    let endFrame = { computedOffset: 1 } as ComputedKeyframe

    for (const frame of frames) {
      if (progress === 0 && frame.computedOffset === 0) {
        startFrame = frame
      }
      if (progress === 1 && frame.computedOffset === 1) {
        endFrame = frame
      }
      if (frame.computedOffset < progress) {
        startFrame = frame
      }
      if (frame.computedOffset > progress) {
        endFrame = frame
        break
      }
    }

    // 计算两个关键帧之间的插值
    const startOffset = startFrame.computedOffset
    const endOffset = endFrame.computedOffset
    const frameProgress = (progress - startOffset) / (endOffset - startOffset)
    const kebabEasingName = startFrame.easing ?? endFrame.easing
    const easingName = StringExt.camelCase(kebabEasingName)
    const easingFn = Timing[easingName] ?? Timing.linear

    // 应用插值后的样式
    for (const prop in { ...startFrame, ...endFrame }) {
      if (
        isNotReservedWord(prop) &&
        (startFrame[prop] != null || endFrame[prop] != null)
      ) {
        const startValue = startFrame[prop] ?? this._originProps[prop]
        const endValue = endFrame[prop] ?? this._originProps[prop]

        // TODO: 确认是否全部自动参考标准自动识别，还是放开标准，先简单处理颜色
        const interpolation: Interp.Definition<number | string> = String(
          startValue,
        ).startsWith('#')
          ? Interp.color
          : Interp.number

        const interpolationFn = interpolation(startValue, endValue)

        const value = interpolationFn(easingFn(frameProgress))

        this.target.setPropByPath(prop, value)
      }
    }
  }
}

export interface EffectTiming {
  delay?: number
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
  duration?: number
  easing?: CamelToKebabCase<Timing.Names>
  // TODO: backwards 和 both 的初始应用效果待实现
  fill?: 'none' | 'forwards' | 'backwards' | 'both'
  iterations?: number
}

interface ComputedEffectTiming extends EffectTiming {
  activeDuration?: number
  endTime?: number
}

export interface KeyframeEffectOptions extends EffectTiming {
  /** TODO: 待实现 */
  composite?: CompositeOperation
  /** TODO: 待实现 */
  iterationComposite?: IterationCompositeOperation
}

const defaultTiming: EffectTiming = {
  delay: 0,
  direction: 'normal',
  duration: 0,
  easing: 'linear',
  fill: 'none',
  iterations: 1,
}
