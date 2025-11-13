import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Animation, KeyframeEffect } from '../../src/model/animation'

type AnyFn = (...args: any[]) => any

class MockCell {
  public values: Record<string, any> = {}
  public startValues: Record<string, any> = {}
  public notifySpy = vi.fn() as AnyFn
  public setSpy = vi.fn() as AnyFn
  public getSpy = vi.fn() as AnyFn

  constructor(startValues: Record<string, any> = {}) {
    this.startValues = startValues
  }

  getPropByPath(path: string | string[]) {
    this.getSpy(path)
    const key = Array.isArray(path) ? path.join('/') : path
    return this.startValues[key]
  }

  setPropByPath(path: string | string[], value: any) {
    this.setSpy(path, value)
    const key = Array.isArray(path) ? path.join('/') : path
    this.values[key] = value
  }

  notify(event: string, args?: any) {
    this.notifySpy(event, args)
  }
}

describe('Animation', () => {
  let realRAF: any
  let realCancelRAF: any
  let currentTime = 0
  let cell: MockCell
  let effect: KeyframeEffect
  let keyFrames: Keyframe[] | PropertyIndexedKeyframes | null
  let animation: Animation

  const mockTimeline = {
    get currentTime() {
      return currentTime
    },
  }
  Object.defineProperty(document, 'timeline', {
    writable: false,
    configurable: true,
    value: mockTimeline,
  })

  beforeEach(() => {
    vi.useFakeTimers()
    currentTime = 0

    realRAF = global.requestAnimationFrame
    realCancelRAF = global.cancelAnimationFrame

    global.requestAnimationFrame = (cb: FrameRequestCallback) => {
      return setTimeout(cb, 16) as any
    }
    global.cancelAnimationFrame = (id: number) => {
      clearTimeout(id)
    }

    cell = new MockCell({
      'position/x': 0,
      'position/y': 0,
    })

    keyFrames = [
      { 'position/x': 0, offset: 0 },
      { 'position/x': 100, offset: 1 },
    ]

    effect = new KeyframeEffect(cell as any, keyFrames, { duration: 100 })
    animation = new Animation(effect)
  })

  afterEach(() => {
    vi.useRealTimers()
    global.requestAnimationFrame = realRAF
    global.cancelAnimationFrame = realCancelRAF
    vi.restoreAllMocks()
  })

  function tick(ms: number) {
    currentTime += ms
    vi.advanceTimersByTime(ms)
  }

  it('should initialize with effect and default properties', () => {
    expect(animation.effect).toBe(effect)
    expect(animation.currentTime).toBeNull()
    expect(animation.playbackRate).toBe(1)
    expect(animation.playState).toBe('idle')
  })

  it('should play animation', () => {
    const onfinishSpy = vi.fn()
    animation.onfinish = onfinishSpy

    animation.play()
    expect(animation.playState).toBe('running')

    tick(50)
    expect(animation.currentTime).toBe(50)
    expect(cell.values['position/x']).toBe(50)

    tick(50)
    expect(cell.values['position/x']).toBe(0)
    expect(animation.playState).toBe('finished')
    expect(onfinishSpy).toHaveBeenCalled()
  })

  it('should pause and resume animation', () => {
    animation.play()
    tick(30)

    animation.pause()
    expect(animation.playState).toBe('paused')
    expect(animation.currentTime).toBe(30)

    animation.play()
    expect(animation.playState).toBe('running')
    tick(20)
    expect(animation.currentTime).toBe(50)
  })

  it('should cancel animation', () => {
    const oncancelSpy = vi.fn()
    animation.oncancel = oncancelSpy

    animation.play()
    tick(30)
    animation.cancel()

    expect(animation.playState).toBe('idle')
    expect(animation.currentTime).toBeNull()
    expect(cell.values['position/x']).toBe(0)
    expect(oncancelSpy).toHaveBeenCalled()
  })

  it('should finish animation', () => {
    const onfinishSpy = vi.fn()
    animation.onfinish = onfinishSpy

    animation.play()
    tick(30)
    animation.finish()

    expect(animation.playState).toBe('finished')
    expect(animation.currentTime).toBe(100)
    expect(cell.values['position/x']).toBe(0)
    expect(onfinishSpy).toHaveBeenCalled()
  })

  it('should finish animation with duration 0', () => {
    effect = new KeyframeEffect(cell as any, keyFrames, {
      duration: 0,
    })
    animation = new Animation(effect)
    const onfinishSpy = vi.fn()
    animation.onfinish = onfinishSpy
    animation.play()
    expect(animation.playState).toBe('finished')
    expect(cell.values['position/x']).toBe(0)
    expect(onfinishSpy).toHaveBeenCalled()
  })

  it('should finish animation with forwards fill', () => {
    effect = new KeyframeEffect(cell as any, keyFrames, {
      duration: 100,
      fill: 'forwards',
    })
    animation = new Animation(effect)

    animation.play()
    tick(100)

    expect(animation.playState).toBe('finished')
    expect(animation.currentTime).toBe(100)
    expect(cell.values['position/x']).toBe(100)
  })

  it('should update playback rate', () => {
    animation.updatePlaybackRate(2)
    expect(animation.playbackRate).toBe(2)

    animation.play()
    tick(25) // 实际时间25ms，由于2倍速，动画时间应为50ms
    expect(animation.currentTime).toBe(50)
  })

  it('should update playback rate in running state', () => {
    animation.play()
    tick(25)
    animation.updatePlaybackRate(2)
    expect(animation.playbackRate).toBe(2)
    // 中途变更速率后时间和实际值应保持不变
    expect(animation.currentTime).toBe(25)
    expect(cell.values['position/x']).toBe(25)

    tick(25)
    expect(animation.currentTime).toBe(25 + 50) // 时间应为原本的 1*25 + 2*25
    expect(cell.values['position/x']).toBe(75)
  })

  it('should update playback rate and currentTime with reverse', () => {
    animation.play()
    tick(50)

    // 第一次反转速率
    animation.reverse()
    tick(20)
    expect(animation.playbackRate).toBe(-1)
    expect(animation.currentTime).toBe(30)
    expect(cell.values['position/x']).toBe(30)

    tick(29)
    expect(animation.currentTime).toBe(1)

    // 第二次反转速率
    animation.reverse()
    expect(animation.playbackRate).toBe(1)
    tick(49)
    expect(animation.currentTime).toBe(50)
    expect(cell.values['position/x']).toBe(50)
  })

  it('should update currentTime with setter', () => {
    animation.play()
    tick(25)
    expect(animation.currentTime).toBe(25)
    expect(cell.values['position/x']).toBe(25)

    // 跳转到 50ms
    animation.currentTime = 50
    vi.advanceTimersByTime(25)
    expect(animation.currentTime).toBe(50)
    expect(cell.values['position/x']).toBe(50)

    // 跳转到动画结束
    animation.currentTime = 100
    vi.advanceTimersByTime(50)
    expect(animation.currentTime).toBe(100)
    expect(animation.playState).toBe('finished')
  })

  it('should not play without effect', () => {
    const emptyAnimation = new Animation(null)
    emptyAnimation.play()
    expect(emptyAnimation.playState).toBe('idle')
  })

  it('should handle timeline currentTime null', () => {
    const timeline = { currentTime: null }
    const anim = new Animation(effect, timeline)
    anim.play()
    expect(anim.playState).toBe('idle')
  })

  describe('direction handling', () => {
    it('should play in reverse direction', () => {
      effect = new KeyframeEffect(cell as any, keyFrames, {
        duration: 100,
        direction: 'reverse',
      })
      animation = new Animation(effect)

      animation.play()
      tick(50)
      expect(animation.currentTime).toBe(50)
      expect(cell.values['position/x']).toBe(50) // 反向播放，从100开始

      tick(50)
      expect(animation.playState).toBe('finished')
      expect(cell.values['position/x']).toBe(0)
    })

    it('should alternate direction with iterations', () => {
      effect = new KeyframeEffect(cell as any, keyFrames, {
        duration: 100,
        direction: 'alternate',
        iterations: 2,
      })
      animation = new Animation(effect)

      animation.play()
      // 第一次迭代 - 正向
      tick(100)
      expect(animation.currentTime).toBe(100)
      expect(cell.values['position/x']).toBe(100)

      // 第二次迭代 - 反向
      tick(100)
      expect(cell.values['position/x']).toBe(0)
      expect(animation.playState).toBe('finished')
    })

    it('should alternate-reverse direction with iterations', () => {
      effect = new KeyframeEffect(cell as any, keyFrames, {
        duration: 100,
        direction: 'alternate-reverse',
        iterations: 2,
      })
      animation = new Animation(effect)

      animation.play()
      // 第一次迭代 - 反向
      tick(90)
      expect(animation.currentTime).toBe(90)
      expect(cell.values['position/x']).toBe(10)

      // 第二次迭代 - 正向
      tick(100)
      expect(animation.currentTime).toBe(190)
      expect(cell.values['position/x']).toBe(90)
    })

    it('should finish with correct value for different directions and fills', () => {
      const expectValueMap = {
        'normal/forwards/1': 100,
        'normal/backwards/1': 0,
        'normal/both/1': 100,
        'normal/none/1': 0,
        'reverse/forwards/1': 0,
        'reverse/backwards/1': 0,
        'reverse/both/1': 0,
        'reverse/none/1': 0,
        'alternate/forwards/1': 100,
        'alternate/forwards/2': 0,
        'alternate/backwards/1': 0,
        'alternate/backwards/2': 0,
        'alternate/both/1': 100,
        'alternate/both/2': 0,
        'alternate/none/1': 0,
        'alternate-reverse/forwards/1': 0,
        'alternate-reverse/forwards/2': 100,
        'alternate-reverse/backwards/1': 0,
        'alternate-reverse/backwards/2': 0,
        'alternate-reverse/both/1': 0,
        'alternate-reverse/both/2': 100,
        'alternate-reverse/none/1': 0,
      }

      Object.entries(expectValueMap).forEach(([key, expectedValue]) => {
        const [direction, fill, iterations] = key.split('/')

        effect = new KeyframeEffect(cell as any, keyFrames, {
          duration: 100,
          direction: direction as any,
          fill: fill as any,
          iterations: parseInt(iterations, 10),
        })
        animation = new Animation(effect)

        animation.play()
        // 播放足够长的时间确保动画完成
        Array.from({ length: parseInt(iterations) }).forEach(() => {
          tick(100)
        })

        expect(cell.values['position/x']).toBe(expectedValue)
      })
    })
  })
})

describe('KeyframeEffect', () => {
  let cell: MockCell

  beforeEach(() => {
    cell = new MockCell({
      'position/x': 0,
      'position/y': 0,
      'size/width': 100,
      'size/height': 100,
      opacity: 1,
    })
  })

  it('should initialize with keyframes array', () => {
    const keyframes = [
      { 'position/x': 0, 'position/y': 0, offset: 0 },
      { 'position/x': 100, 'position/y': 100, offset: 1 },
    ]
    const effect = new KeyframeEffect(cell as any, keyframes, { duration: 100 })

    expect(effect.target).toBe(cell)
    expect(effect.getKeyframes()).toEqual([
      expect.objectContaining({
        'position/x': 0,
        'position/y': 0,
        easing: 'linear',
        offset: 0,
        computedOffset: 0,
      }),
      expect.objectContaining({
        'position/x': 100,
        'position/y': 100,
        easing: 'linear',
        offset: 1,
        computedOffset: 1,
      }),
    ])
  })

  it('should initialize with property indexed keyframes', () => {
    const keyframes = {
      'position/x': 100,
      'position/y': 200,
    }
    const effect = new KeyframeEffect(cell as any, keyframes, { duration: 100 })

    const frames = effect.getKeyframes()
    expect(frames).toHaveLength(1)
    expect(frames[0]).toEqual(
      expect.objectContaining({
        'position/x': 100,
        'position/y': 200,
        computedOffset: 1,
      }),
    )
  })

  it('should initialize with property indexed array keyframes', () => {
    const keyframes = {
      'position/x': [50, 100],
      'position/y': [50, 200],
    }
    const effect = new KeyframeEffect(cell as any, keyframes, { duration: 100 })

    const frames = effect.getKeyframes()
    expect(frames).toHaveLength(2)
    expect(frames[0]).toEqual(
      expect.objectContaining({
        'position/x': 50,
        'position/y': 50,
        computedOffset: 0,
      }),
    )
    expect(frames[1]).toEqual(
      expect.objectContaining({
        'position/x': 100,
        'position/y': 200,
        computedOffset: 1,
      }),
    )
  })

  it('should apply animation at different progress', () => {
    const keyframes = [
      { 'position/x': 0, offset: 0 },
      { 'position/x': 100, offset: 1 },
    ]
    const effect = new KeyframeEffect(cell as any, keyframes, { duration: 100 })

    // Start
    effect.apply(0)
    expect(cell.values['position/x']).toBe(0)

    // Middle
    effect.apply(50)
    expect(cell.values['position/x']).toBe(50)

    // End
    effect.apply(100)
    expect(cell.values['position/x']).toBe(100)
  })

  it('should handle color interpolation', () => {
    const keyframes = [
      { fill: '#ff0000', offset: 0 },
      { fill: '#0000ff', offset: 1 },
    ]
    const effect = new KeyframeEffect(cell as any, keyframes, { duration: 100 })

    effect.apply(50)
    expect(cell.values['fill']).toMatch(/^#[\da-f]{6}$/i)
    expect(cell.values['fill']).not.toBe('#ff0000')
    expect(cell.values['fill']).not.toBe('#0000ff')
  })

  it('should restore original values when currentTime is null', () => {
    const keyframes = [{ 'position/x': 100, 'position/y': 100 }]
    const effect = new KeyframeEffect(cell as any, keyframes, 100)

    // Apply animation
    effect.apply(100)
    expect(cell.values['position/x']).toBe(100)
    expect(cell.values['position/y']).toBe(100)

    // Restore
    effect.apply(null)
    expect(cell.values['position/x']).toBe(0)
    expect(cell.values['position/y']).toBe(0)
  })

  it('should handle easing functions', () => {
    const keyframes = [{ 'position/x': 100, easing: 'quad' }]
    const effect = new KeyframeEffect(cell as any, keyframes, { duration: 100 })

    effect.apply(25)
    const earlyValue = cell.values['position/x']

    effect.apply(75)
    const lateValue = cell.values['position/x']

    // Ease-in should start slow, ease-out should end slow
    expect(earlyValue).toBeLessThan(25)
    expect(lateValue).toBeLessThan(75)
  })

  it('should update keyframes with setKeyframes', () => {
    const initialKeyframes = [{ 'position/x': 0 }]
    const effect = new KeyframeEffect(cell as any, initialKeyframes, {
      duration: 100,
    })

    const newKeyframes = [
      { 'position/x': 0, offset: 0 },
      {
        'position/x': 100,
        'position/y': 150,
        offset: 1,
      },
    ]
    effect.setKeyframes(newKeyframes)

    const frames = effect.getKeyframes()
    expect(frames).toHaveLength(2)
    expect(frames[0]).toEqual(
      expect.objectContaining({
        'position/x': 0,
        computedOffset: 0,
      }),
    )
    expect(frames[1]).toEqual(
      expect.objectContaining({
        'position/x': 100,
        'position/y': 150,
        computedOffset: 1,
      }),
    )

    // 回到初始状态
    effect.apply(null)
    expect(cell.values['position/x']).toBe(0)
    expect(cell.values['position/y']).toBe(0)
  })

  it('should return timing options with getTiming', () => {
    const options = {
      duration: 200,
      delay: 50,
      easing: 'ease-in-out',
      iterations: 2,
    }
    const effect = new KeyframeEffect(cell as any, [], options)

    const timing = effect.getTiming()
    expect(timing).toEqual(
      expect.objectContaining({
        duration: 200,
        delay: 50,
        easing: 'ease-in-out',
        iterations: 2,
      }),
    )
  })

  it('should return computed timing with getComputedTiming', () => {
    const options = {
      duration: 200,
      delay: 50,
      easing: 'ease-in-out',
    }
    const effect = new KeyframeEffect(cell as any, [], options)

    const computedTiming = effect.getComputedTiming()
    expect(computedTiming).toEqual(
      expect.objectContaining({
        duration: 200,
        delay: 50,
        easing: 'ease-in-out',
        fill: 'none', // 默认值
        direction: 'normal', // 默认值
        iterations: 1, // 默认值
      }),
    )
  })

  it('should merge default timing options', () => {
    const effect = new KeyframeEffect(cell as any, [], { duration: 100 })

    const timing = effect.getTiming()
    expect(timing).toEqual(
      expect.objectContaining({
        duration: 100,
        delay: 0, // 默认值
        easing: 'linear', // 默认值
        fill: 'none', // 默认值
        direction: 'normal', // 默认值
        iterations: 1, // 默认值
      }),
    )
  })
})
