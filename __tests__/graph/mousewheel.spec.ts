import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as Common from '../../src/common'
import { MouseWheel } from '../../src/graph/mousewheel'

describe('MouseWheel', () => {
  let mouseWheel: MouseWheel
  let mockGraph: any
  let mockMouseWheelHandle: any
  let transformMock: any

  beforeEach(() => {
    transformMock = {
      getScale: vi.fn().mockReturnValue({ sx: 1, sy: 1 }),
      clampScale: vi.fn((s: number) => s),
    }

    mockMouseWheelHandle = {
      enable: vi.fn(),
      disable: vi.fn(),
    }

    mockGraph = {
      container: document.createElement('div'),
      options: { mousewheel: { enabled: true, factor: 1.2 } },
      transform: transformMock,
      getPlugin: vi.fn(),
      clientToLocal: vi.fn((pos) => ({ clone: () => pos })),
      clientToGraph: vi.fn((pos) => ({ clone: () => pos })),
      zoom: vi.fn(),
    }

    // Mock Dom.MouseWheelHandle
    vi.spyOn(Common.Dom, 'MouseWheelHandle').mockImplementation(
      () => mockMouseWheelHandle,
    )

    mouseWheel = new MouseWheel(mockGraph)
  })

  it('should enable and disable properly', () => {
    mouseWheel.disable()
    expect(mockGraph.options.mousewheel.enabled).toBe(false)
    expect(mockMouseWheelHandle.disable).toHaveBeenCalled()

    mouseWheel.enable()
    expect(mockGraph.options.mousewheel.enabled).toBe(true)
    expect(mockMouseWheelHandle.enable).toHaveBeenCalled()
  })

  it('should respect disabled state', () => {
    mockGraph.options.mousewheel.enabled = false
    expect(mouseWheel.disabled).toBe(true)

    mockGraph.options.mousewheel.enabled = true
    expect(mouseWheel.disabled).toBe(false)
  })

  it('should allow mouse wheel only when guard and modifiers pass', () => {
    const guard = vi.fn().mockReturnValue(true)
    mouseWheel.widgetOptions.guard = guard
    mouseWheel.widgetOptions.modifiers = null

    const e = new WheelEvent('wheel')
    expect(mouseWheel['allowMouseWheel'](e)).toBe(true)
    expect(guard).toHaveBeenCalledWith(e)
  })

  it('should zoom in and out correctly', () => {
    const e = new WheelEvent('wheel', {
      deltaY: -100,
      clientX: 10,
      clientY: 20,
    })
    mouseWheel['onMouseWheel'](e)
    expect(mockGraph.zoom).toHaveBeenCalled()
  })

  it('should clamp scale to minScale and maxScale', () => {
    mouseWheel.widgetOptions.minScale = 0.5
    mouseWheel.widgetOptions.maxScale = 2
    transformMock.clampScale.mockImplementation((s) => s)

    const e = new WheelEvent('wheel', { deltaY: -100, clientX: 0, clientY: 0 })
    mouseWheel['onMouseWheel'](e)
    const calledScale = mockGraph.zoom.mock.calls[0][0]
    expect(calledScale).toBeGreaterThanOrEqual(0.5)
    expect(calledScale).toBeLessThanOrEqual(2)
  })

  it('should zoom at mouse position when option enabled', () => {
    mouseWheel.widgetOptions.zoomAtMousePosition = true
    const e = new WheelEvent('wheel', {
      deltaY: -100,
      clientX: 10,
      clientY: 20,
    })
    mouseWheel['onMouseWheel'](e)
    expect(mockGraph.clientToGraph).toHaveBeenCalled()
    expect(mockGraph.zoom).toHaveBeenCalled()
  })

  it('dispose should disable mousewheel', () => {
    mouseWheel.dispose()
    expect(mockGraph.options.mousewheel.enabled).toBe(false)
    expect(mockMouseWheelHandle.disable).toHaveBeenCalled()
  })

  describe('factorByDelta', () => {
    const targetScaleOf = (deltaY: number, accumulated?: number) => {
      mockGraph.zoom.mockClear()
      const e = new WheelEvent('wheel', { deltaY, clientX: 0, clientY: 0 })
      mouseWheel['onMouseWheel'](e, 0, accumulated)
      return mockGraph.zoom.mock.calls[0]?.[0] as number
    }

    beforeEach(() => {
      mouseWheel.widgetOptions.factorByDelta = true
      mouseWheel.widgetOptions.factor = 1.2
    })

    it('scales the zoom step proportionally to the wheel delta', () => {
      // currentScale = 1, factor = 1.2 → targetScale = 1.2 ** (-delta / 100)
      expect(targetScaleOf(-100)).toBeCloseTo(1.2, 5) // one full notch = one factor
      expect(targetScaleOf(-10)).toBeCloseTo(1.2 ** 0.1, 5) // a small delta = a small step
    })

    it('makes a large delta zoom more than a small delta', () => {
      const big = targetScaleOf(-100)
      const small = targetScaleOf(-10)
      expect(big).toBeGreaterThan(small)
      expect(small).toBeGreaterThan(1) // still zooms in
    })

    it('zooms out on positive delta', () => {
      expect(targetScaleOf(100)).toBeCloseTo(1.2 ** -1, 5)
    })

    it('prefers the accumulated deltaY batched by MouseWheelHandle', () => {
      // event carries -10 but the frame accumulated -100 → the accumulated wins
      expect(targetScaleOf(-10, -100)).toBeCloseTo(1.2, 5)
    })

    it('leaves the quantized path untouched when disabled', () => {
      mouseWheel.widgetOptions.factorByDelta = false
      // classic path: a single event zooms by the fixed >= 5% step, not delta-scaled
      expect(targetScaleOf(-10)).toBeCloseTo(1.2, 5)
    })

    it('does not zoom on a non-finite delta (never calls zoom(NaN))', () => {
      // a malformed event yields cumulatedFactor 1 → targetScale === currentScale → no zoom
      mockGraph.zoom.mockClear()
      const e = new WheelEvent('wheel', { clientX: 0, clientY: 0 })
      mouseWheel['onMouseWheel'](e, 0, Number.NaN)
      expect(mockGraph.zoom).not.toHaveBeenCalled()
    })

    it('falls back to the default factor when misconfigured negative', () => {
      mouseWheel.widgetOptions.factor = -2
      expect(targetScaleOf(-100)).toBeCloseTo(1.2, 5) // uses 1.2, not NaN
    })
  })
})
