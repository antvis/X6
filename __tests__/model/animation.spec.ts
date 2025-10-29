import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Animation } from '../../src/model/animation'

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

  beforeEach(() => {
    vi.useFakeTimers()
    currentTime = 0
    vi.setSystemTime(currentTime)

    realRAF = global.requestAnimationFrame
    realCancelRAF = global.cancelAnimationFrame

    global.requestAnimationFrame = (cb: FrameRequestCallback) => {
      return setTimeout(cb, 16) as any
    }
    global.cancelAnimationFrame = (id: number) => {
      clearTimeout(id)
    }
  })

  afterEach(() => {
    vi.useRealTimers()
    global.requestAnimationFrame = realRAF
    global.cancelAnimationFrame = realCancelRAF
    vi.restoreAllMocks()
  })

  function tick(ms: number) {
    currentTime += ms
    vi.setSystemTime(currentTime)
    vi.advanceTimersByTime(ms)
  }

  it('should run numeric animation, call callbacks and notify on complete', () => {
    const startValue = 0
    const targetValue = 100
    const cell = new MockCell({ a: startValue })
    const anim = new Animation(cell as any)

    const startCb = vi.fn()
    const progressCb = vi.fn()
    const completeCb = vi.fn()
    const finishCb = vi.fn()

    anim.start('a', targetValue, {
      delay: 0,
      duration: 100,
      timing: 'linear',
      fill: 'forwards',
      start: startCb,
      progress: progressCb,
      complete: completeCb,
      finish: finishCb,
    })

    tick(0)

    const keys = anim.get()
    expect(keys).toContain('a')
    expect(cell.notifySpy).toHaveBeenCalledWith(
      'transition:start',
      expect.objectContaining({
        path: 'a',
        startValue,
        targetValue,
        cell,
      }),
    )
    expect(startCb).toHaveBeenCalledWith(
      expect.objectContaining({
        path: 'a',
        startValue,
        targetValue,
        cell,
      }),
    )

    tick(16)

    expect(progressCb).toHaveBeenCalled()
    const firstProgressArg = progressCb.mock.calls[0][0]
    expect(firstProgressArg).toHaveProperty('progress')
    expect(firstProgressArg).toHaveProperty('currentValue')
    expect(cell.setSpy).toHaveBeenCalled()

    tick(100)

    expect(cell.values['a']).toBe(targetValue)

    expect(completeCb).toHaveBeenCalledWith(
      expect.objectContaining({
        path: 'a',
        startValue,
        targetValue,
        cell,
      }),
    )
    expect(finishCb).toHaveBeenCalledWith(
      expect.objectContaining({
        path: 'a',
        startValue,
        targetValue,
        cell,
      }),
    )

    expect(cell.notifySpy).toHaveBeenCalledWith(
      'transition:complete',
      expect.objectContaining({
        path: 'a',
        startValue,
        targetValue,
        cell,
      }),
    )

    expect(cell.notifySpy).toHaveBeenCalledWith(
      'transition:finish',
      expect.objectContaining({
        path: 'a',
        startValue,
        targetValue,
        cell,
      }),
    )

    expect(anim.get()).not.toContain('a')
  })

  it('stop with jumpedToEnd should set final value and call complete/finish notifications', () => {
    const cell = new MockCell({ a: 10 })
    const anim = new Animation(cell as any)

    const stopCompleteCb = vi.fn()
    const stopCb = vi.fn()
    const finishCb = vi.fn()

    anim.start('a', 50, { delay: 0, duration: 100 })
    tick(0)

    anim.stop('a', {
      jumpedToEnd: true,
      complete: stopCompleteCb,
      stop: stopCb,
      finish: finishCb,
    })

    expect(cell.values['a']).toBe(50)

    expect(cell.notifySpy).toHaveBeenCalledWith(
      'transition:end',
      expect.objectContaining({
        path: 'a',
        startValue: 10,
        targetValue: 50,
        cell,
      }),
    )
    expect(cell.notifySpy).toHaveBeenCalledWith(
      'transition:complete',
      expect.objectContaining({
        path: 'a',
        startValue: 10,
        targetValue: 50,
        cell,
      }),
    )

    expect(stopCompleteCb).toHaveBeenCalledWith(
      expect.objectContaining({
        path: 'a',
        startValue: 10,
        targetValue: 50,
        cell,
      }),
    )
    expect(stopCb).toHaveBeenCalledWith(
      expect.objectContaining({
        path: 'a',
        startValue: 10,
        targetValue: 50,
        jumpedToEnd: true,
        cell,
      }),
    )
    expect(finishCb).toHaveBeenCalledWith(
      expect.objectContaining({
        path: 'a',
        startValue: 10,
        targetValue: 50,
        cell,
      }),
    )

    expect(anim.get()).not.toContain('a')
  })

  it('stop by prefix should stop multiple animations under the same prefix', () => {
    const cell = new MockCell({ 'g/x': 0, 'g/y': 0 })
    const anim = new Animation(cell as any)

    anim.start(['g', 'x'], 10, { delay: 0, duration: 100 })
    anim.start(['g', 'y'], 20, { delay: 0, duration: 100 })
    tick(0)

    const keysBefore = anim.get().sort()
    expect(keysBefore).toContain('g/x')
    expect(keysBefore).toContain('g/y')

    anim.stop('g')

    const keysAfter = anim.get()
    expect(keysAfter).not.toContain('g/x')
    expect(keysAfter).not.toContain('g/y')
  })

  it('should use provided interp function when given', () => {
    const cell = new MockCell({ v: 'start' })
    const anim = new Animation(cell as any)

    const interpFactory = vi.fn((s: any, t: any) => {
      return (p: number) => {
        return `interp:${String(s)}->${String(t)}@${Math.round(p * 100)}`
      }
    })

    const progressCb = vi.fn()

    anim.start('v', 'end', {
      delay: 0,
      duration: 50,
      fill: 'forwards',
      interp: interpFactory,
      progress: progressCb,
    })

    tick(0)

    tick(16)

    expect(progressCb).toHaveBeenCalled()
    const anySetCallWithInterp = cell.setSpy.mock.calls.some((c: any[]) => {
      const value = c[1]
      return typeof value === 'string' && value.startsWith('interp:')
    })
    expect(anySetCallWithInterp).toBeTruthy()

    tick(50)

    const finalVal = cell.values['v']
    expect(finalVal).toMatch(/^interp:start->end@100/)
  })
})
