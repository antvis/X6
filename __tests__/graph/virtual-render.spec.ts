import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Dom } from '../../src/common'
import { VirtualRenderManager } from '../../src/graph/virtual-render'

vi.mock('../../src/common', async () => {
  const actual: any = await vi.importActual('../../src/common')
  return {
    ...actual,
    FunctionExt: {
      ...actual.FunctionExt,
      throttle: vi.fn((fn) => fn),
    },
    disposable: () => () => {},
  }
})

const createRect = (x: number, y: number, width: number, height: number) => ({
  x,
  y,
  width,
  height,
  clone() {
    const eff: any = {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    }
    eff.inflate = (dx: number, dy: number) => {
      eff.x -= dx
      eff.y -= dy
      eff.width += dx * 2
      eff.height += dy * 2
    }
    return eff
  },
})

describe('VirtualRenderManager', () => {
  let graph: any
  let manager: VirtualRenderManager

  beforeEach(() => {
    graph = {
      options: { virtual: false },
      renderer: { setRenderArea: vi.fn() },
      getGraphArea: vi.fn(() => createRect(1, 2, 100, 200)),
      on: vi.fn(),
      off: vi.fn(),
      getPlugin: vi.fn(() => undefined),
    }
    manager = new VirtualRenderManager(graph as any)
  })

  it('should throttle resetRenderArea on init', () => {
    expect(manager.resetRenderArea).toBeTypeOf('function')
    // 确认 startListening 被调用过
    expect(graph.on).toHaveBeenCalledWith(
      'translate',
      expect.any(Function),
      manager,
    )
    expect(graph.on).toHaveBeenCalledWith(
      'scale',
      expect.any(Function),
      manager,
    )
    expect(graph.on).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
      manager,
    )
  })

  it('enableVirtualRender should set options.virtual = true and call resetRenderArea', () => {
    const spy = vi.spyOn(manager, 'resetRenderArea')
    manager.enableVirtualRender()
    expect(graph.options.virtual).toBe(true)
    expect(spy).toHaveBeenCalled()
  })

  it('disableVirtualRender should set options.virtual = false and reset render area to undefined', () => {
    graph.options.virtual = true
    manager.disableVirtualRender()
    expect(graph.options.virtual).toBe(false)
    expect(graph.renderer.setRenderArea).toHaveBeenCalledWith(undefined)
  })

  it('resetRenderArea should call setRenderArea only when virtual = true', () => {
    // virtual = false 时不触发
    manager.resetRenderArea()
    expect(graph.renderer.setRenderArea).not.toHaveBeenCalled()

    // virtual = true 时触发
    graph.options.virtual = true
    manager.resetRenderArea()
    expect(graph.getGraphArea).toHaveBeenCalled()
    expect(graph.renderer.setRenderArea).toHaveBeenCalledWith(
      expect.objectContaining({
        x: -119,
        y: -118,
        width: 340,
        height: 440,
      }),
    )
  })

  it('dispose should stop listening', () => {
    manager.dispose()
    expect(graph.off).toHaveBeenCalledWith(
      'translate',
      expect.any(Function),
      manager,
    )
    expect(graph.off).toHaveBeenCalledWith(
      'scale',
      expect.any(Function),
      manager,
    )
    expect(graph.off).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
      manager,
    )
  })

  it('should bind to scroller events and scroll handler when scroller present', () => {
    const container = document.createElement('div')
    const scrollerMock = {
      on: vi.fn(),
      off: vi.fn(),
      container,
    }
    const graph2: any = {
      options: { virtual: false },
      renderer: { setRenderArea: vi.fn() },
      getGraphArea: vi.fn(() => createRect(0, 0, 10, 10)),
      on: vi.fn(),
      off: vi.fn(),
      getPlugin: vi.fn(() => scrollerMock),
    }

    const onSpy = vi.spyOn(Dom.Event, 'on')
    const mgr = new VirtualRenderManager(graph2)

    expect(scrollerMock.on).toHaveBeenCalledWith(
      'pan:start',
      expect.any(Function),
      mgr,
    )
    expect(scrollerMock.on).toHaveBeenCalledWith(
      'panning',
      expect.any(Function),
      mgr,
    )
    expect(scrollerMock.on).toHaveBeenCalledWith(
      'pan:stop',
      expect.any(Function),
      mgr,
    )
    expect(onSpy).toHaveBeenCalledWith(
      container,
      'scroll',
      expect.any(Function),
    )
  })

  it('onScrollerReady should rebind and reset render area', () => {
    const containerA = document.createElement('div')
    const scrollerA = { on: vi.fn(), off: vi.fn(), container: containerA }
    graph.getPlugin.mockReturnValue(scrollerA)
    const mgr = new VirtualRenderManager(graph)

    const containerB = document.createElement('div')
    const scrollerB = { on: vi.fn(), off: vi.fn(), container: containerB }
    const offSpy = vi.spyOn(scrollerA, 'off')
    const onSpy = vi.spyOn(scrollerB, 'on')
    const resetSpy = vi.spyOn(mgr, 'resetRenderArea')

    mgr.onScrollerReady(scrollerB as any)

    expect(offSpy).toHaveBeenCalledWith('pan:start', expect.any(Function), mgr)
    expect(offSpy).toHaveBeenCalledWith('panning', expect.any(Function), mgr)
    expect(offSpy).toHaveBeenCalledWith('pan:stop', expect.any(Function), mgr)
    expect(onSpy).toHaveBeenCalledWith('pan:start', expect.any(Function), mgr)
    expect(onSpy).toHaveBeenCalledWith('panning', expect.any(Function), mgr)
    expect(onSpy).toHaveBeenCalledWith('pan:stop', expect.any(Function), mgr)
    expect(resetSpy).toHaveBeenCalled()
  })
})
