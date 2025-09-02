import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { SizeSensor } from '@/common/size-sensor'

vi.mock('@/common/size-sensor/sensors/observer', () => {
  return {
    createSensor: (element: Element) => {
      let listeners: any[] = []
      return {
        element,
        bind: (cb: any) => {
          listeners.push(cb)
          cb(element)
        },
        unbind: (cb: any) => {
          listeners = listeners.filter((l) => l !== cb)
        },
        destroy: vi.fn(() => {
          listeners = []
        }),
        __trigger: () => {
          listeners.forEach((cb) => cb(element))
        },
      }
    },
  }
})

describe('SizeSensor', () => {
  let el: HTMLElement

  beforeEach(() => {
    el = document.createElement('div')
    document.body.appendChild(el)
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  it('bind should create sensor and call listener on resize', () => {
    const spy = vi.fn()
    SizeSensor.bind(el, spy)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(el)
  })

  it('bind should return unbind function', () => {
    const spy = vi.fn()
    const unbind = SizeSensor.bind(el, spy)

    expect(typeof unbind).toBe('function')

    unbind()
    spy.mockClear()

    const spy2 = vi.fn()
    SizeSensor.bind(el, spy2)
    expect(spy2).toHaveBeenCalledTimes(1)
  })

  it('multiple listeners should all be called', () => {
    const spy1 = vi.fn()
    const spy2 = vi.fn()
    SizeSensor.bind(el, spy1)
    SizeSensor.bind(el, spy2)

    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(1)
  })

  it('clear should destroy the sensor and remove listeners', () => {
    const spy = vi.fn()
    SizeSensor.bind(el, spy)

    SizeSensor.clear(el)

    const spy2 = vi.fn()
    SizeSensor.bind(el, spy2)
    expect(spy2).toHaveBeenCalledTimes(1)
  })
})
