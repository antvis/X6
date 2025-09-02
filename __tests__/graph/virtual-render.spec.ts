import { describe, it, expect, vi, beforeEach } from 'vitest'
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

describe('VirtualRenderManager', () => {
  let graph: any
  let manager: VirtualRenderManager

  beforeEach(() => {
    graph = {
      options: { virtual: false },
      renderer: { setRenderArea: vi.fn() },
      getGraphArea: vi.fn(() => ({ x: 1, y: 2, width: 100, height: 200 })),
      on: vi.fn(),
      off: vi.fn(),
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
    expect(graph.renderer.setRenderArea).toHaveBeenCalledWith({
      x: 1,
      y: 2,
      width: 100,
      height: 200,
    })
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
})
