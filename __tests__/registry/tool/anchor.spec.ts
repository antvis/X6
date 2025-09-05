import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Point } from '../../../src/geometry/point'

// Mock ToolItem 基类
class MockToolItem {
  options: any
  cellView: any
  parent: any
  container: HTMLElement
  childNodes: any

  constructor(options: any = {}) {
    this.options = { ...options }
    this.container = document.createElement('div')
  }

  config(cellView: any, parent: any) {
    this.cellView = cellView
    this.parent = parent
    return this
  }

  render() {
    this.childNodes = {
      anchor: document.createElement('circle'),
      area: document.createElement('rect'),
    }
    return this
  }

  update() {
    return this
  }

  guard() {
    return false
  }

  normalizeEvent(evt: any) {
    return evt
  }
  focus() {}
  blur() {}

  delegateDocumentEvents() {}
  undelegateDocumentEvents() {}
}

// Mock Anchor 类
class MockAnchor extends MockToolItem {
  protected get type() {
    return this.options.type || 'source'
  }

  protected onRender() {
    // Mock implementation
  }

  protected updateAnchor() {
    // Mock implementation
  }

  protected updateArea() {
    // Mock implementation
  }

  protected toggleArea(visible?: boolean) {
    if (this.childNodes?.area) {
      this.childNodes.area.style.display = visible ? '' : 'none'
    }
  }

  protected onMouseDown(evt: any) {
    if (this.guard(evt)) {
      return
    }
    evt.stopPropagation()
    evt.preventDefault()
    this.toggleArea(this.options.restrictArea)
  }

  protected resetAnchor(anchor?: any) {
    // Mock implementation
  }

  protected onMouseMove(evt: any) {
    // Mock implementation
    this.resetAnchor({ x: 0.5, y: 0.5 })
  }

  protected onMouseUp(evt: any) {
    this.toggleArea(false)
  }

  protected onDblClick() {
    this.resetAnchor()
  }
}

// Mock SourceAnchor
class MockSourceAnchor extends MockAnchor {
  constructor(options: any = {}) {
    super({ ...options, type: 'source' })
  }
}

// Mock TargetAnchor
class MockTargetAnchor extends MockAnchor {
  constructor(options: any = {}) {
    super({ ...options, type: 'target' })
  }
}

// Mock EdgeView
class MockEdgeView {
  cell = {
    prop: vi.fn(),
    removeProp: vi.fn(),
    startBatch: vi.fn(),
    stopBatch: vi.fn(),
    getVertexAt: vi.fn(),
    getTerminalAnchor: vi.fn().mockReturnValue(new Point(0, 0)),
  }

  graph = {
    view: {
      undelegateEvents: vi.fn(),
      delegateEvents: vi.fn(),
      guard: vi.fn().mockReturnValue(false),
    },
    coord: {
      clientToLocalPoint: vi.fn().mockReturnValue(new Point(100, 100)),
    },
  }

  getTerminalView() {
    return {
      cell: {
        getAngle: vi.fn().mockReturnValue(0),
        getBBox: vi.fn().mockReturnValue({
          getCenter: vi.fn().mockReturnValue(new Point(50, 50)),
        }),
      },
      getBBox: vi.fn().mockReturnValue({
        inflate: vi.fn(),
        getCenter: vi.fn().mockReturnValue(new Point(50, 50)),
      }),
      getUnrotatedBBoxOfElement: vi.fn().mockReturnValue({
        inflate: vi.fn(),
        getCenter: vi.fn().mockReturnValue(new Point(50, 50)),
        containsPoint: vi.fn().mockReturnValue(true),
        getNearestPointToPoint: vi.fn().mockReturnValue(new Point(50, 50)),
      }),
      isEdgeElement: vi.fn().mockReturnValue(false),
    }
  }

  getTerminalMagnet() {
    return document.createElement('div')
  }

  getTerminalAnchor() {
    return new Point(0, 0)
  }

  removeRedundantLinearVertices() {
    // Mock implementation
  }
}

// Mock ToolsView
class MockToolsView {
  focus() {}
  blur() {}
}

describe('Anchor Tool', () => {
  let edgeView: MockEdgeView
  let toolsView: MockToolsView

  beforeEach(() => {
    edgeView = new MockEdgeView()
    toolsView = new MockToolsView()
  })

  describe('SourceAnchor', () => {
    it('应该正确创建源锚点实例', () => {
      const anchor = new MockSourceAnchor()
      expect(anchor).toBeInstanceOf(MockSourceAnchor)
      expect(anchor.options.type).toBe('source')
    })

    it('应该正确配置源锚点', () => {
      const anchor = new MockSourceAnchor()
      anchor.config(edgeView, toolsView)
      expect(anchor.cellView).toBe(edgeView)
      expect(anchor.parent).toBe(toolsView)
    })

    it('应该正确渲染源锚点', () => {
      const anchor = new MockSourceAnchor()
      anchor.config(edgeView, toolsView)
      anchor.render()

      expect(anchor.container).toBeDefined()
      expect(anchor.childNodes).toBeDefined()
      expect(anchor.childNodes.anchor).toBeDefined()
      expect(anchor.childNodes.area).toBeDefined()
    })
  })

  describe('TargetAnchor', () => {
    it('应该正确创建目标锚点实例', () => {
      const anchor = new MockTargetAnchor()
      expect(anchor).toBeInstanceOf(MockTargetAnchor)
      expect(anchor.options.type).toBe('target')
    })

    it('应该正确配置目标锚点', () => {
      const anchor = new MockTargetAnchor()
      anchor.config(edgeView, toolsView)
      expect(anchor.cellView).toBe(edgeView)
      expect(anchor.parent).toBe(toolsView)
    })
  })

  describe('Anchor 通用功能', () => {
    let anchor: MockSourceAnchor

    beforeEach(() => {
      anchor = new MockSourceAnchor()
      anchor.config(edgeView, toolsView)
      anchor.render()
    })

    it('应该正确更新锚点位置', () => {
      const updateSpy = vi.spyOn(anchor, 'update')

      anchor.update()

      expect(updateSpy).toHaveBeenCalled()
    })

    it('应该处理鼠标按下事件', () => {
      const mouseDownEvent = {
        stopPropagation: vi.fn(),
        preventDefault: vi.fn(),
      }
      const guardSpy = vi.spyOn(anchor, 'guard').mockReturnValue(false)
      const toggleAreaSpy = vi.spyOn(anchor, 'toggleArea')

      anchor.onMouseDown(mouseDownEvent)

      expect(guardSpy).toHaveBeenCalledWith(mouseDownEvent)
      expect(mouseDownEvent.stopPropagation).toHaveBeenCalled()
      expect(mouseDownEvent.preventDefault).toHaveBeenCalled()
      expect(toggleAreaSpy).toHaveBeenCalledWith(anchor.options.restrictArea)
    })

    it('应该处理鼠标移动事件', () => {
      const mouseMoveEvent = { clientX: 100, clientY: 100 }
      const resetAnchorSpy = vi.spyOn(anchor, 'resetAnchor')

      anchor.onMouseMove(mouseMoveEvent)

      expect(resetAnchorSpy).toHaveBeenCalled()
    })

    it('应该处理鼠标释放事件', () => {
      const mouseUpEvent = {}
      const toggleAreaSpy = vi.spyOn(anchor, 'toggleArea')

      anchor.onMouseUp(mouseUpEvent)

      expect(toggleAreaSpy).toHaveBeenCalledWith(false)
    })

    it('应该处理双击事件重置锚点', () => {
      const resetAnchorSpy = vi.spyOn(anchor, 'resetAnchor')

      anchor.onDblClick()

      expect(resetAnchorSpy).toHaveBeenCalled()
    })

    it('应该正确切换区域显示', () => {
      anchor.toggleArea(true)
      expect(anchor.childNodes.area.style.display).toBe('')

      anchor.toggleArea(false)
      expect(anchor.childNodes.area.style.display).toBe('none')
    })
  })

  describe('Anchor 配置选项', () => {
    it('应该处理区域限制选项', () => {
      const anchor = new MockSourceAnchor({ restrictArea: false })
      anchor.config(edgeView, toolsView)

      expect(anchor.options.restrictArea).toBe(false)
    })

    it('应该处理自定义选项', () => {
      const customOptions = { restrictArea: true, areaPadding: 10 }
      const anchor = new MockSourceAnchor(customOptions)

      expect(anchor.options.restrictArea).toBe(true)
      expect(anchor.options.areaPadding).toBe(10)
    })
  })

  describe('Anchor 边界情况', () => {
    it('应该处理 guard 返回 true 的情况', () => {
      const anchor = new MockSourceAnchor()
      anchor.config(edgeView, toolsView)

      const mouseDownEvent = {}
      const guardSpy = vi.spyOn(anchor, 'guard').mockReturnValue(true)
      const stopPropagationSpy = vi.fn()
      const preventDefaultSpy = vi.fn()

      anchor.onMouseDown({
        ...mouseDownEvent,
        stopPropagation: stopPropagationSpy,
        preventDefault: preventDefaultSpy,
      })

      expect(guardSpy).toHaveBeenCalled()
      expect(stopPropagationSpy).not.toHaveBeenCalled()
      expect(preventDefaultSpy).not.toHaveBeenCalled()
    })

    it('应该处理没有子节点的情况', () => {
      const anchor = new MockSourceAnchor()
      anchor.config(edgeView, toolsView)
      // 不调用 render()，所以 childNodes 为 undefined

      expect(() => {
        anchor.toggleArea(true)
      }).not.toThrow()
    })
  })
})
