import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Util } from '../../src/common'
import { Dom } from '../../src/common/dom'
import { Rectangle } from '../../src/geometry'
import { Graph } from '../../src/graph'
import type { Cell } from '../../src/model'
import { Scroller } from '../../src/plugin/scroller'
import {
  ScrollerImpl,
  ScrollerImplBackground,
  transitionClassName,
  transitionEventName,
} from '../../src/plugin/scroller/scroller'

class MockCell {
  getBBox() {
    return {
      getCenter: () => ({ x: 50, y: 50 }),
      getTopCenter: () => ({ x: 50, y: 0 }),
      getTopRight: () => ({ x: 100, y: 0 }),
      getRightMiddle: () => ({ x: 100, y: 50 }),
      getBottomRight: () => ({ x: 100, y: 100 }),
      getBottomCenter: () => ({ x: 50, y: 100 }),
      getBottomLeft: () => ({ x: 0, y: 100 }),
      getLeftMiddle: () => ({ x: 0, y: 50 }),
    }
  }
}

function createMockGraph() {
  const handlers: Record<string, Function[]> = {}
  const container = document.createElement('div')
  container.style.width = '800px'
  container.style.height = '600px'

  return {
    options: { width: 800, height: 600, background: null },
    container,
    view: { grid: document.createElement('div'), background: null },
    grid: { update: vi.fn(), draw: vi.fn(), clear: vi.fn() }, // ✅ mock grid
    panning: {
      pannable: true,
      disablePanning: vi.fn(),
      enablePanning: vi.fn(),
    },
    transform: {
      getScale: () => ({ sx: 1, sy: 1 }),
      resize: vi.fn(),
      clampScale: (s: number) => s,
      getTranslation: () => ({ tx: 0, ty: 0 }),
      getMatrix: () => ({ a: 1, d: 1, e: 0, f: 0 }),
      scale: vi.fn(),
    },
    model: { on: vi.fn(), off: vi.fn() },
    on: vi.fn((event: string, cb: Function) => {
      handlers[event] = handlers[event] || []
      handlers[event].push(cb)
    }),
    off: vi.fn((event: string, cb: Function) => {
      handlers[event] = (handlers[event] || []).filter((fn) => fn !== cb)
    }),
    trigger: vi.fn((event: string, ...args: any[]) => {
      ;(handlers[event] || []).forEach((fn) => {
        fn(...args)
      })
    }),
    once: vi.fn(),
    matrix: () => ({
      a: 1,
      d: 1,
      e: 0,
      f: 0,
      inverse: () => ({ a: 1, d: 1, e: 0, f: 0 }),
    }),
    getContentArea: () => ({ getCenter: () => ({ x: 100, y: 50 }) }),
    fitToContent: vi.fn(),
    translate: vi.fn(),
    getPlugin: vi.fn(),
    scale: vi.fn(),
  }
}

describe('Scroller Plugin', () => {
  let scroller: Scroller
  let graph: any

  beforeEach(() => {
    graph = createMockGraph()
    scroller = new Scroller({ pannable: true })
    scroller.init(graph as any)
  })

  afterEach(() => {
    vi.clearAllMocks()
    scroller.dispose()
  })

  it('should init correctly', () => {
    expect(scroller.container).toBeInstanceOf(HTMLDivElement)
    expect(graph.on).toHaveBeenCalled()
  })

  it('should get pannable state', () => {
    expect(scroller.isPannable()).toBe(true)
    scroller.disablePanning()
    expect(scroller.isPannable()).toBe(false)
    scroller.enablePanning()
    expect(scroller.isPannable()).toBe(true)
  })

  it('should toggle pannable state', () => {
    scroller.togglePanning(false)
    expect(scroller.isPannable()).toBe(false)
    scroller.togglePanning(true)
    expect(scroller.isPannable()).toBe(true)
    scroller.togglePanning()
    expect(typeof scroller.isPannable()).toBe('boolean')
  })

  it('should call zoom API', () => {
    const spy = vi.spyOn((scroller as any).scrollerImpl, 'zoom')
    scroller.zoom(2)
    expect(spy).toHaveBeenCalledWith(2, undefined)
    scroller.zoomTo(1.5)
    expect(spy).toHaveBeenCalledWith(
      1.5,
      expect.objectContaining({ absolute: true }),
    )
  })

  it('should call center and position APIs', () => {
    const spy = vi.spyOn((scroller as any).scrollerImpl, 'centerPoint')
    scroller.center()
    scroller.centerPoint(10, 20)
    expect(spy).toHaveBeenCalled()
  })

  it('should position cell and rect', () => {
    const cell = new MockCell() as any
    const spy1 = vi.spyOn((scroller as any).scrollerImpl, 'positionCell')
    const spy2 = vi.spyOn((scroller as any).scrollerImpl, 'positionRect')
    scroller.centerCell(cell)
    scroller.positionCell(cell, 'center')
    scroller.positionRect({ x: 0, y: 0, width: 10, height: 10 }, 'top')
    expect(spy1).toHaveBeenCalled()
    scroller.positionPoint({ x: 0, y: 0 }, 1, 2)
    scroller.positionRect({ x: 0, y: 0, width: 10, height: 10 }, 'center')
    scroller.positionRect(new Rectangle(0, 0, 10, 10), 'top-right')
    scroller.positionRect(new Rectangle(0, 0, 10, 10), 'right')
    scroller.positionRect(new Rectangle(0, 0, 10, 10), 'bottom-right')
    scroller.positionRect(new Rectangle(0, 0, 10, 10), 'bottom')
    scroller.positionRect(new Rectangle(0, 0, 10, 10), 'bottom-left')
    scroller.positionRect(new Rectangle(0, 0, 10, 10), 'left')
    scroller.positionRect(new Rectangle(0, 0, 10, 10), 'top-left')
    expect(spy2).toBeCalledTimes(11)
  })

  it('should handle background methods', () => {
    const bgSpy = vi.spyOn(
      (scroller as any).scrollerImpl.backgroundManager,
      'draw',
    )
    const clrSpy = vi.spyOn(
      (scroller as any).scrollerImpl.backgroundManager,
      'clear',
    )
    scroller.drawBackground()
    scroller.clearBackground()
    expect(bgSpy).toHaveBeenCalled()
    expect(clrSpy).toHaveBeenCalled()
  })

  it('should handle scrollbar position', () => {
    const spy = vi.spyOn((scroller as any).scrollerImpl, 'scrollbarPosition')
    scroller.getScrollbarPosition()
    scroller.setScrollbarPosition(10, 20)
    expect(spy).toHaveBeenCalledWith(10, 20)
  })

  it('should scroll and transition', () => {
    const spy1 = vi.spyOn((scroller as any).scrollerImpl, 'scrollToPoint')
    const spy2 = vi.spyOn((scroller as any).scrollerImpl, 'scrollToContent')
    const spy3 = vi.spyOn((scroller as any).scrollerImpl, 'scrollToCell')
    const spy4 = vi.spyOn((scroller as any).scrollerImpl, 'transitionToPoint')
    scroller.scrollToPoint(10, 20)
    scroller.scrollToContent()
    scroller.scrollToCell(new MockCell() as any)
    scroller.transitionToPoint(10, 20)
    expect(spy1).toHaveBeenCalled()
    expect(spy2).toHaveBeenCalled()
    expect(spy3).toHaveBeenCalled()
    expect(spy4).toHaveBeenCalled()
    scroller.transitionToPoint(10, 20, { scale: 1 })
    expect(spy4).toHaveBeenCalledTimes(2)
    scroller.transitionToRect(
      { x: 0, y: 0, width: 10, height: 10 },
      { scaleGrid: 1, onTransitionEnd: vi.fn() },
    )
    expect(spy4).toHaveBeenCalledTimes(3)
  })

  it('should lock/unlock/update scroller', () => {
    const lockSpy = vi.spyOn((scroller as any).scrollerImpl, 'lock')
    const unlockSpy = vi.spyOn((scroller as any).scrollerImpl, 'unlock')
    const updateSpy = vi.spyOn((scroller as any).scrollerImpl, 'update')
    scroller.lockScroller()
    scroller.unlockScroller()
    scroller.updateScroller()
    expect(lockSpy).toHaveBeenCalled()
    expect(unlockSpy).toHaveBeenCalled()
    expect(updateSpy).toHaveBeenCalled()
  })

  it('should support autoResize', () => {
    const spy1 = vi.spyOn((scroller as any).scrollerImpl, 'enableAutoResize')
    const spy2 = vi.spyOn((scroller as any).scrollerImpl, 'disableAutoResize')
    scroller.enableAutoResize()
    scroller.disableAutoResize()
    expect(spy1).toHaveBeenCalled()
    expect(spy2).toHaveBeenCalled()
  })

  it('should dispose correctly', () => {
    const spy = vi.spyOn((scroller as any).scrollerImpl, 'dispose')
    scroller.dispose()
    expect(spy).toHaveBeenCalled()
  })
  it('should handle togglePanning without args', () => {
    const initial = scroller.isPannable()
    scroller.togglePanning()
    expect(scroller.isPannable()).toBe(!initial)
  })

  it('should safely call dispose twice', () => {
    scroller.dispose()
    expect(() => scroller.dispose()).not.toThrow()
  })

  it('should call preparePanning on mousedown', () => {
    scroller['allowPanning'] = vi.fn(() => true)
    const spy = vi.spyOn(scroller as any, 'preparePanning')
    const evt = new MouseEvent('mousedown', { clientX: 10, clientY: 20 })
    const eventObj = { e: evt }
    ;(scroller as any).preparePanning(eventObj)

    expect(spy).toHaveBeenCalled()
    expect(scroller['allowPanning']).toHaveBeenCalled()
  })

  it('should respect pageVisible/pageBreak options', () => {
    const s2 = new Scroller({ pageVisible: true, pageBreak: true })
    expect(() => s2.init(graph)).not.toThrow()
  })
})

describe('Graph API extensions for Scroller', () => {
  let graph: Graph
  let scrollerMock: Partial<Scroller>

  beforeEach(() => {
    graph = new Graph({
      container: document.createElement('div'),
    })
    scrollerMock = {
      lockScroller: vi.fn(),
      unlockScroller: vi.fn(),
      updateScroller: vi.fn(),
      getScrollbarPosition: vi.fn(() => ({ left: 10, top: 20 })),
      setScrollbarPosition: vi.fn(),
    }

    vi.spyOn(graph, 'getPlugin').mockImplementation((name: string) => {
      if (name === 'scroller') {
        return scrollerMock
      }
      return null
    })
  })

  it('should call scroller.lockScroller', () => {
    graph.lockScroller()
    expect(scrollerMock.lockScroller).toHaveBeenCalled()
  })

  it('should call scroller.unlockScroller', () => {
    graph.unlockScroller()
    expect(scrollerMock.unlockScroller).toHaveBeenCalled()
  })

  it('should call scroller.updateScroller', () => {
    graph.updateScroller()
    expect(scrollerMock.updateScroller).toHaveBeenCalled()
  })

  it('should return scroller scrollbar position', () => {
    const pos = graph.getScrollbarPosition()
    expect(pos).toEqual({ left: 10, top: 20 })
    expect(scrollerMock.getScrollbarPosition).toHaveBeenCalled()
  })

  it('should call scroller.setScrollbarPosition with parameters', () => {
    graph.setScrollbarPosition(100, 200)
    expect(scrollerMock.setScrollbarPosition).toHaveBeenCalledWith(100, 200)
  })

  it('should return default values when scroller plugin is not present', () => {
    vi.spyOn(graph, 'getPlugin').mockReturnValue(null)

    expect(graph.lockScroller()).toBe(graph)
    expect(graph.unlockScroller()).toBe(graph)
    expect(graph.updateScroller()).toBe(graph)
    expect(graph.getScrollbarPosition()).toEqual({ left: 0, top: 0 })
    expect(graph.setScrollbarPosition(1, 2)).toBe(graph)
  })
})

describe('Scroller (index.ts)', () => {
  let scroller: Scroller
  let graphMock: Partial<Graph>
  let scrollerImplMock: any

  beforeEach(() => {
    scrollerImplMock = {
      container: { dataset: {}, scrollLeft: 0, scrollTop: 0 } as any,
      resize: vi.fn(),
      updatePageSize: vi.fn(),
      zoom: vi.fn(),
      zoomToRect: vi.fn(),
      zoomToFit: vi.fn(),
      centerPoint: vi.fn(),
      centerContent: vi.fn(),
      centerCell: vi.fn(),
      positionPoint: vi.fn(),
      positionCell: vi.fn(),
      positionContent: vi.fn(),
      drawBackground: vi.fn(),
      clearBackground: vi.fn(),
      lock: vi.fn(),
      unlock: vi.fn(),
      update: vi.fn(),
      scrollbarPosition: vi.fn(() => ({ left: 5, top: 10 })),
      scrollToPoint: vi.fn(),
      scrollToContent: vi.fn(),
      scrollToCell: vi.fn(),
      transitionToPoint: vi.fn(),
      transitionToRect: vi.fn(),
      enableAutoResize: vi.fn(),
      disableAutoResize: vi.fn(),
      autoScroll: vi.fn((x, y) => ({ scrollerX: x, scrollerY: y })),
      clientToLocalPoint: vi.fn((x, y) => ({ x, y })),
      once: vi.fn(),
      startPanning: vi.fn(),
      dispose: vi.fn(),
      on: vi.fn(),
      backgroundManager: {
        draw: vi.fn(),
        clear: vi.fn(),
      },
    }

    graphMock = {
      on: vi.fn(),
      off: vi.fn(),
      getPlugin: vi
        .fn()
        .mockReturnValue({ allowRubberband: vi.fn(() => true) }),
      options: {},
    }

    scroller = new Scroller()
    // @ts-expect-error
    scroller.scrollerImpl = scrollerImplMock as ScrollerImpl
    // @ts-expect-error
    scroller.graph = graphMock as Graph
  })

  it('should call resize and resizePage', () => {
    scroller.resize(100, 200)
    scroller.resizePage(300, 400)
    expect(scrollerImplMock.resize).toHaveBeenCalledWith(100, 200)
    expect(scrollerImplMock.updatePageSize).toHaveBeenCalledWith(300, 400)
  })

  it('should call zoom methods', () => {
    scroller.zoom(2)
    scroller.zoomTo(3)
    scroller.zoomToRect({ x: 0, y: 0, width: 10, height: 10 })
    scroller.zoomToFit()
    expect(scrollerImplMock.zoom).toHaveBeenCalledWith(2, undefined)
    expect(scrollerImplMock.zoom).toHaveBeenCalledWith(3, { absolute: true })
    expect(scrollerImplMock.zoomToRect).toHaveBeenCalled()
    expect(scrollerImplMock.zoomToFit).toHaveBeenCalled()
  })

  it('should call center methods', () => {
    scroller.centerPoint(1, 2)
    scroller.centerContent()
    scroller.centerCell({} as Cell)
    expect(scrollerImplMock.centerPoint).toHaveBeenCalledWith(1, 2, undefined)
    expect(scrollerImplMock.centerContent).toHaveBeenCalled()
    expect(scrollerImplMock.centerCell).toHaveBeenCalled()
  })

  it('should call background methods', () => {
    const drawSpy = vi.spyOn(scrollerImplMock.backgroundManager, 'draw')
    const clearSpy = vi.spyOn(scrollerImplMock.backgroundManager, 'clear')

    scroller.drawBackground({}, false)
    scroller.clearBackground(false)

    expect(drawSpy).toHaveBeenCalled()
    expect(clearSpy).toHaveBeenCalled()
  })

  it('should call lock, unlock, update, and scrollbar methods', () => {
    scroller.lockScroller()
    scroller.unlockScroller()
    scroller.updateScroller()
    scroller.setScrollbarPosition(1, 2)
    const pos = scroller.getScrollbarPosition()
    expect(scrollerImplMock.lock).toHaveBeenCalled()
    expect(scrollerImplMock.unlock).toHaveBeenCalled()
    expect(scrollerImplMock.update).toHaveBeenCalled()
    expect(scrollerImplMock.scrollbarPosition).toHaveBeenCalledWith(1, 2)
    expect(pos).toEqual({ left: 5, top: 10 })
  })

  it('should call scroll and transition methods', () => {
    scroller.scrollToPoint(10, 20)
    scroller.scrollToContent()
    scroller.scrollToCell({} as Cell)
    scroller.transitionToPoint(1, 2)
    scroller.transitionToRect(
      { x: 0, y: 0, width: 10, height: 10 },
      { scaleGrid: 1 },
    )
    expect(scrollerImplMock.scrollToPoint).toHaveBeenCalledWith(10, 20)
    expect(scrollerImplMock.scrollToContent).toHaveBeenCalled()
    expect(scrollerImplMock.scrollToCell).toHaveBeenCalled()
    expect(scrollerImplMock.transitionToPoint).toHaveBeenCalledWith(
      1,
      2,
      undefined,
    )
    expect(scrollerImplMock.transitionToRect).toHaveBeenCalled()
  })

  it('should call autoResize and autoScroll', () => {
    scroller.enableAutoResize()
    scroller.disableAutoResize()
    const result = scroller.autoScroll(5, 10)
    expect(scrollerImplMock.enableAutoResize).toHaveBeenCalled()
    expect(scrollerImplMock.disableAutoResize).toHaveBeenCalled()
    expect(result).toEqual({ scrollerX: 5, scrollerY: 10 })
  })

  it('should call clientToLocalPoint', () => {
    const pt = scroller.clientToLocalPoint(1, 2)
    expect(scrollerImplMock.clientToLocalPoint).toHaveBeenCalledWith(1, 2)
    expect(pt).toEqual({ x: 1, y: 2 })
  })

  it('should dispose', () => {
    scroller.dispose()
    expect(scrollerImplMock.dispose).toHaveBeenCalled()
  })
})

describe('ScrollerImpl', () => {
  let graph: Graph
  let scroller: ScrollerImpl

  beforeEach(() => {
    graph = createMockGraph()
    scroller = new ScrollerImpl({ graph })

    Object.defineProperty(scroller.container, 'getBoundingClientRect', {
      value: () => ({
        left: 100,
        top: 100,
        right: 300,
        bottom: 300,
        width: 200,
        height: 200,
      }),
    })
  })

  it('should initialize container, content, background, and backgroundManager', () => {
    expect(scroller.container).toBeInstanceOf(HTMLDivElement)
    expect(scroller.background).toBeInstanceOf(HTMLDivElement)
    expect(scroller.backgroundManager).toBeInstanceOf(ScrollerImplBackground)
  })

  it('should scroll to point correctly', () => {
    scroller.scrollToPoint(100, 200)
    expect(scroller.container.scrollLeft).toBeGreaterThan(0)
    expect(scroller.container.scrollTop).toBeGreaterThan(0)
  })

  it('should scroll to content', () => {
    const spy = vi.spyOn(scroller, 'scrollToPoint')
    scroller.scrollToContent()
    expect(spy).toHaveBeenCalled()
  })

  it('should handle panning flow', () => {
    const startSpy = vi.fn()
    const panningSpy = vi.fn()
    const stopSpy = vi.fn()

    scroller.on('pan:start', startSpy)
    scroller.on('panning', panningSpy)
    scroller.on('pan:stop', stopSpy)

    // startPanning
    const mouseDown = new MouseEvent('mousedown', { clientX: 10, clientY: 20 })
    scroller.startPanning(mouseDown as any)
    expect(scroller.clientX).toBe(10)
    expect(scroller.clientY).toBe(20)
    expect(startSpy).toHaveBeenCalled()

    // pan
    const scrollTopBefore = scroller.container.scrollTop
    const scrollLeftBefore = scroller.container.scrollLeft

    const mouseMove = new MouseEvent('mousemove', { clientX: 30, clientY: 50 })
    scroller.pan(mouseMove as any)
    expect(scroller.container.scrollLeft).toBe(scrollLeftBefore - (30 - 10))
    expect(scroller.container.scrollTop).toBe(scrollTopBefore - (50 - 20))
    expect(scroller.clientX).toBe(30)
    expect(scroller.clientY).toBe(50)
    expect(panningSpy).toHaveBeenCalled()

    // stopPanning
    const mouseUp = new MouseEvent('mouseup')
    scroller.stopPanning(mouseUp as any)
    expect(stopSpy).toHaveBeenCalledWith({ e: mouseUp })
  })

  it('should convert client to local point', () => {
    const matrix = { a: 2, d: 2, e: 4, f: 6 }
    scroller.graph.matrix = vi.fn(() => matrix)
    scroller.container.scrollLeft = 10
    scroller.container.scrollTop = 20
    scroller.padding = { left: 5, top: 5 }

    const point = scroller.clientToLocalPoint({ x: 14, y: 26 })
    // 计算：x = (14 + 10 - 5 - 4) / 2 = 7.5, y = (26 + 20 - 5 - 6) / 2 = 17.5
    expect(point.x).toBe(7.5)
    expect(point.y).toBe(17.5)
  })

  it('should autoScroll when near edges', () => {
    const rect = scroller.container.getBoundingClientRect()
    const result = scroller.autoScroll(rect.left - 5, rect.top - 5)
    expect(result.scrollerX).toBeLessThan(0)
    expect(result.scrollerY).toBeLessThan(0)
  })

  it('should zoom and return scale', () => {
    const oldScale = scroller.zoom()
    const result = scroller.zoom(2, {
      absolute: true,
      minScale: 0.5,
      maxScale: 4,
      scaleGrid: 1,
    })
    expect(result).toBeInstanceOf(ScrollerImpl)
    expect(oldScale).toBe(1)
  })

  it('should call updatePageBreak when updating page size', () => {
    const spy = vi.spyOn(scroller as any, 'updatePageBreak')
    scroller.updatePageSize(400, 300)
    expect(spy).toHaveBeenCalled()
  })

  it('should lock and unlock container', () => {
    scroller.lock()
    expect(scroller.container.style.overflow).toBe('hidden')
    scroller.unlock()
    expect(scroller.container.style.overflow).toBe('scroll')
  })

  it('should dispose correctly', () => {
    const removeSpy = vi.spyOn(scroller, 'remove')
    scroller.dispose()
    expect(removeSpy).toHaveBeenCalled()
  })
  it('should autoScroll when near edges', () => {
    const rect = scroller.container.getBoundingClientRect()

    // 模拟靠左上角
    const result1 = scroller.autoScroll(rect.left - 5, rect.top - 5)
    expect(result1.scrollerX).toBeLessThan(0)
    expect(result1.scrollerY).toBeLessThan(0)

    // 模拟靠右下角
    const result2 = scroller.autoScroll(rect.right + 5, rect.bottom + 5)
    expect(result2.scrollerX).toBeGreaterThan(0)
    expect(result2.scrollerY).toBeGreaterThan(0)
  })

  it('should call before/after manipulation hooks', () => {
    const beforeSpy = vi.spyOn(scroller, 'beforeManipulation')
    const afterSpy = vi.spyOn(scroller, 'afterManipulation')
    scroller.zoom(2, { absolute: true })
    expect(beforeSpy).toHaveBeenCalled()
    expect(afterSpy).toHaveBeenCalled()
  })
  it('syncTransition should call hooks, scale, center and removeTransition', () => {
    const beforeSpy = vi.spyOn(scroller, 'beforeManipulation')
    const afterSpy = vi.spyOn(scroller, 'afterManipulation')
    const centerSpy = vi.spyOn(scroller, 'centerPoint')
    const removeSpy = vi.spyOn(scroller, 'removeTransition')

    const point = { x: 100, y: 200 }
    const ret = (scroller as any).syncTransition(2, point)

    expect(beforeSpy).toHaveBeenCalled()
    expect(scroller.graph.scale).toHaveBeenCalledWith(2)
    expect(removeSpy).toHaveBeenCalled()
    expect(centerSpy).toHaveBeenCalledWith(point.x, point.y)
    expect(afterSpy).toHaveBeenCalled()
    expect(ret).toBe(scroller)
  })

  it('removeTransition should clear classes, events and styles', () => {
    const addClassSpy = vi.spyOn(Dom, 'removeClass')
    const offSpy = vi.spyOn(Dom.Event, 'off')
    const cssSpy = vi.spyOn(Dom, 'css')

    const ret = (scroller as any).removeTransition()

    expect(addClassSpy).toHaveBeenCalledWith(
      scroller.container,
      transitionClassName,
    )
    expect(offSpy).toHaveBeenCalledWith(scroller.content, transitionEventName)
    expect(cssSpy).toHaveBeenCalledWith(scroller.content, {
      transform: '',
      transformOrigin: '',
      transition: '',
      transitionDuration: '',
      transitionDelay: '',
      transitionTimingFunction: '',
    })
    expect(ret).toBe(scroller)
  })
})

describe('Scroller padding & visibility', () => {
  let graph: Graph
  let scroller: ScrollerImpl
  beforeEach(() => {
    graph = createMockGraph()
    scroller = new ScrollerImpl({ graph })
    scroller.graph.options.width = 100
    scroller.graph.options.height = 50
    scroller.container.style.left = '0px'
    scroller.container.style.top = '0px'
    scroller.content.style.width = '0px'
    scroller.content.style.height = '0px'
    scroller.padding = { left: 0, right: 0, top: 0, bottom: 0 }
  })

  it('should add padding and adjust content & container', () => {
    scroller.addPadding(5, 10, 15, 20)

    expect(scroller.padding).toEqual({
      left: 5,
      top: 15,
      right: 10,
      bottom: 20,
    })
    expect(scroller.content.style.width).toBe(`${5 + 100 + 10}px`)
    expect(scroller.content.style.height).toBe(`${15 + 50 + 20}px`)
    expect(scroller.graph.container.style.left).toBe('5px')
    expect(scroller.graph.container.style.top).toBe('15px')
  })

  it('should get padding from number', () => {
    scroller.options.padding = { left: 1, right: 2, top: 3, bottom: 4 }
    const padding = scroller.getPadding()
    expect(padding).toEqual({ left: 1, right: 2, top: 3, bottom: 4 })
  })

  it('should get padding from function', () => {
    scroller.options.padding = vi.fn(() => ({
      left: 2,
      right: 3,
      top: 4,
      bottom: 5,
    }))
    const padding = scroller.getPadding()
    expect(scroller.options.padding).toHaveBeenCalled()
    expect(padding).toEqual({ left: 2, right: 3, top: 4, bottom: 5 })
  })

  it('should compute visible area correctly', () => {
    vi.spyOn(Util, 'transformRectangle').mockImplementation((box) => box)
    scroller.container.scrollLeft = 10
    scroller.container.scrollTop = 20
    scroller.padding = { left: 5, top: 10, right: 0, bottom: 0 }
    scroller.sx = 2
    scroller.sy = 2
    scroller.getClientSize = vi.fn(() => ({ width: 100, height: 50 }))

    const area = scroller.getVisibleArea()
    expect(area.width).toBe(100)
    expect(area.height).toBe(50)
  })

  it('should detect cell visibility', () => {
    const mockCell = {
      getBBox: vi.fn(() => ({ x: 0, y: 0, width: 10, height: 10 })),
    } as any
    scroller.getVisibleArea = vi.fn(
      () =>
        ({
          containsRect: vi.fn(() => true),
          isIntersectWithRect: vi.fn(() => false),
        }) as any,
    )

    expect(scroller.isCellVisible(mockCell, { strict: true })).toBe(true)
    expect(scroller.isCellVisible(mockCell, { strict: false })).toBe(false)
  })

  it('should detect point visibility', () => {
    const point = { x: 5, y: 5 }
    scroller.getVisibleArea = vi.fn(
      () =>
        ({
          containsPoint: vi.fn(() => true),
        }) as any,
    )
    expect(scroller.isPointVisible(point)).toBe(true)
  })
})
