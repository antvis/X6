import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as Common from '@/common'
import { MouseWheel } from '@/graph/mousewheel'

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
})
