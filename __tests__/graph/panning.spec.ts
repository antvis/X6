import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as Common from '../../src/common'
import { PanningManager } from '../../src/graph/panning'

describe('PanningManager', () => {
  let panningManager: PanningManager
  let mockGraph: any
  let mockMouseWheelHandle: any
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')

    mockMouseWheelHandle = {
      enable: vi.fn(),
      disable: vi.fn(),
    }

    mockGraph = {
      container,
      options: {
        panning: {
          enabled: true,
          eventTypes: ['leftMouseDown', 'rightMouseDown', 'mouseWheel'],
        },
      },
      view: {
        container,
        normalizeEvent: (e: any) => e,
        prefixClassName: (name: string) => name,
      },
      on: vi.fn(),
      off: vi.fn(),
      getPlugin: vi
        .fn()
        .mockReturnValue({ allowRubberband: vi.fn().mockReturnValue(false) }),
      translateBy: vi.fn(),
      getGraphArea: vi
        .fn()
        .mockReturnValue({ left: 0, top: 0, right: 100, bottom: 100 }),
    }

    // Mock Dom.MouseWheelHandle
    vi.spyOn(Common.Dom, 'MouseWheelHandle').mockImplementation(
      () => mockMouseWheelHandle,
    )
    vi.spyOn(Common.Dom.Event, 'on').mockImplementation(vi.fn())
    vi.spyOn(Common.Dom.Event, 'off').mockImplementation(vi.fn())
    vi.spyOn(Common.Dom, 'addClass').mockImplementation(vi.fn())
    vi.spyOn(Common.Dom, 'removeClass').mockImplementation(vi.fn())

    panningManager = new PanningManager(mockGraph)
  })

  it('should enable and disable panning', () => {
    panningManager.disablePanning()
    expect(mockGraph.options.panning.enabled).toBe(false)

    panningManager.enablePanning()
    expect(mockGraph.options.panning.enabled).toBe(true)
  })

  it('should allow panning with modifiers', () => {
    const e = { clientX: 0, clientY: 0 }
    expect(panningManager['allowPanning'](e as any)).toBe(true)
  })

  it('should start and stop panning', () => {
    const evt = { clientX: 0, clientY: 0 }
    panningManager['startPanning'](evt as any)
    expect(panningManager['panning']).toBe(true)
    expect(panningManager['clientX']).toBe(0)
    expect(panningManager['clientY']).toBe(0)

    const moveEvt = { clientX: 10, clientY: 20 }
    panningManager['pan'](moveEvt as any)
    expect(mockGraph.translateBy).toHaveBeenCalledWith(10, 20)

    panningManager['stopPanning'](moveEvt as any)
    expect(panningManager['panning']).toBe(false)
  })

  it('should handle onMouseDown and onRightMouseDown', () => {
    const evt = { e: { button: 0, clientX: 0, clientY: 0 } }
    panningManager['onMouseDown'](evt)
    expect(panningManager['panning']).toBe(true)

    const rightEvt = { button: 2, clientX: 0, clientY: 0 }
    panningManager['onRightMouseDown'](rightEvt as any)
    expect(panningManager['panning']).toBe(true)
  })

  it('should translate graph on mouse wheel', () => {
    panningManager['onMouseWheel']({} as WheelEvent, 5, 5)
    expect(mockGraph.translateBy).toHaveBeenCalledWith(-5, -5)
  })

  it('should handle space key down and up', () => {
    panningManager['onKeyDown']({ which: 32 } as any)
    expect(panningManager['isSpaceKeyPressed']).toBe(true)

    panningManager['onKeyUp']({ which: 32 } as any)
    expect(panningManager['isSpaceKeyPressed']).toBe(false)
  })

  it('should auto pan when near graph edges', () => {
    panningManager.autoPanning(0, 0)
    expect(mockGraph.translateBy).toHaveBeenCalled()
    panningManager.autoPanning(200, 200)
    expect(mockGraph.translateBy).toHaveBeenCalled()
  })

  it('should dispose and stop listening', () => {
    panningManager.dispose()
    expect(mockMouseWheelHandle.disable).toHaveBeenCalled()
    expect(Common.Dom.Event.off).toHaveBeenCalled()
  })
})
