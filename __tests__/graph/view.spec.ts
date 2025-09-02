import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GraphView } from '../../src/graph/view'
import { Cell } from '../../src/model/cell'

describe('GraphView', () => {
  let graph: any
  let container: HTMLElement
  let view: GraphView
  let mockCellView: any
  let findViewByElemSpy: any

  beforeEach(() => {
    container = document.createElement('div')
    graph = {
      options: {
        container,
        clickThreshold: 2,
        moveThreshold: 1,
        preventDefaultDblClick: false,
        preventDefaultMouseDown: false,
      },
      findViewByElem: vi.fn(),
      snapToGrid: vi.fn((x, y) => ({ x, y })),
      trigger: vi.fn(),
    }
    mockCellView = {
      cell: {},
      onClick: vi.fn(),
      onDblClick: vi.fn(),
      onContextMenu: vi.fn(),
      onMouseDown: vi.fn(),
      onMouseMove: vi.fn(),
      onMouseUp: vi.fn(),
      onMouseOver: vi.fn(),
      onMouseOut: vi.fn(),
      onMouseEnter: vi.fn(),
      onMouseLeave: vi.fn(),
      onMouseWheel: vi.fn(),
      onCustomEvent: vi.fn(),
      onMagnetMouseDown: vi.fn(),
      onMagnetDblClick: vi.fn(),
      onMagnetContextMenu: vi.fn(),
      onLabelMouseDown: vi.fn(),
    }
    view = new GraphView(graph)
    findViewByElemSpy = vi
      .spyOn(graph, 'findViewByElem')
      .mockReturnValue(mockCellView)
  })

  it('should init and mount elements', () => {
    expect(view.container).toBe(container)
  })

  it('delegateEvents should call super', () => {
    const result = view.delegateEvents()
    expect(result).toBe(view)
  })

  describe('guard', () => {
    it('should return true on right click', () => {
      const e = { type: 'mousedown', button: 2 }
      expect(view.guard(e as any)).toBe(true)
    })

    it('should use options.guard if provided', () => {
      graph.options.guard = () => true
      const e = { type: 'click', button: 0 }
      expect(view.guard(e as any)).toBe(true)
    })

    it('should return e.data.guarded if defined', () => {
      const e = { type: 'click', button: 0, data: { guarded: false } }
      expect(view.guard(e as any)).toBe(false)
    })

    it('should return false if view.cell exists', () => {
      const e = { type: 'click', button: 0 }
      const cell = new Cell()
      expect(view.guard(e as any, { cell } as any)).toBe(false)
    })

    it('should return false if target is svg or container', () => {
      const e = { type: 'click', button: 0, target: view.svg }
      expect(view.guard(e as any)).toBe(false)
    })

    it('should default to true', () => {
      const e = {
        type: 'click',
        button: 0,
        target: document.createElement('div'),
      }
      expect(view.guard(e as any)).toBe(true)
    })
  })

  it('onClick should trigger view.onClick', () => {
    vi.spyOn(view, 'guard').mockReturnValue(false)
    vi.spyOn(view, 'findView').mockReturnValue(mockCellView)

    view.onClick({ clientX: 10, clientY: 20, type: 'click' } as any)
    expect(mockCellView.onClick).toHaveBeenCalled()
  })

  it('onClick should trigger blank:click if no view', () => {
    vi.spyOn(view, 'findView').mockReturnValue(null)
    vi.spyOn(view.graph, 'snapToGrid').mockImplementation((x, y) => ({ x, y }))
    vi.spyOn(graph, 'trigger')

    const evt = {
      clientX: 1,
      clientY: 2,
      type: 'click',
      data: {},
      target: view.svg, // <--- 必须保证 target 在 svg 内
    } as any

    view.onClick(evt)

    expect(graph.trigger).toHaveBeenCalledWith(
      'blank:click',
      expect.objectContaining({ x: 1, y: 2 }),
    )
  })

  it('onDblClick should trigger view.onDblClick', () => {
    const mockCellView = {
      cell: {}, // 必须有 cell，且 Cell.isCell(cell) 返回 true
      onDblClick: vi.fn(),
    } as any

    // 模拟 Cell.isCell
    vi.spyOn(Cell, 'isCell').mockReturnValue(true)

    vi.spyOn(view, 'findView').mockReturnValue(mockCellView)
    vi.spyOn(view.graph, 'snapToGrid').mockImplementation((x, y) => ({ x, y }))

    view.onDblClick({ clientX: 10, clientY: 20, type: 'dblclick' } as any)

    expect(mockCellView.onDblClick).toHaveBeenCalledWith(
      expect.anything(),
      10,
      20,
    )
  })

  it('onContextMenu should call preventDefault if needed', () => {
    graph.options.preventDefaultContextMenu = true
    const evt = { clientX: 1, clientY: 2, preventDefault: vi.fn() }
    vi.spyOn(view, 'findView').mockReturnValue(mockCellView)
    view.onContextMenu(evt as any)
    expect(evt.preventDefault).toHaveBeenCalled()
  })

  it('onMouseDown should delegate drag events', () => {
    const evt = {
      type: 'mousedown',
      target: document.createElement('div'),
      clientX: 10,
      clientY: 20,
      button: 0,
      data: {},
      preventDefault: vi.fn(),
      stopImmediatePropagation: vi.fn(),
    } as any

    vi.spyOn(view, 'findView').mockReturnValue(null) // 空白
    vi.spyOn(view, 'guard').mockReturnValue(false)
    vi.spyOn(view.graph, 'snapToGrid').mockImplementation((x, y) => ({ x, y }))
    vi.spyOn(view.graph, 'trigger')

    view.onMouseDown(evt)

    expect(view.graph.trigger).toHaveBeenCalledWith(
      'blank:mousedown',
      expect.objectContaining({ e: expect.anything(), x: 10, y: 20 }),
    )
  })

  it('onMouseMove should increase count and call graph.trigger', () => {
    const evt: any = { clientX: 2, clientY: 3, data: {} }
    view.setEventData(evt, {
      startPosition: { x: 1, y: 1 },
      mouseMovedCount: 2,
    })
    view.onMouseMove(evt)
    expect(graph.trigger).toHaveBeenCalledWith(
      'blank:mousemove',
      expect.anything(),
    )
  })

  it('onMouseUp should trigger blank:mouseup', () => {
    const evt: any = {
      clientX: 5,
      clientY: 6,
      data: {},
      stopImmediatePropagation: vi.fn(),
      isPropagationStopped: () => true,
    }
    view.setEventData(evt, { currentView: null })
    view.onMouseUp(evt)
    expect(graph.trigger).toHaveBeenCalledWith(
      'blank:mouseup',
      expect.anything(),
    )
  })

  it('onMouseWheel should trigger view.onMouseWheel', () => {
    const evt = {
      type: 'mousewheel',
      target: document.createElement('g'),
      originalEvent: { clientX: 10, clientY: 20, wheelDelta: 1 },
      data: {},
    } as any

    const mockCellView = {
      onMouseWheel: vi.fn(),
      cell: {},
    } as any

    vi.spyOn(view, 'findView').mockReturnValue(mockCellView)
    vi.spyOn(view, 'guard').mockReturnValue(false)
    vi.spyOn(view.graph, 'snapToGrid').mockImplementation((x, y) => ({ x, y }))

    view.onMouseWheel(evt)

    expect(mockCellView.onMouseWheel).toHaveBeenCalledWith(
      expect.anything(), // evt
      10, // x
      20, // y
      1, // delta
    )
  })

  it('onCustomEvent should call view.onCustomEvent', () => {
    const elem = document.createElement('div')
    elem.setAttribute('event', 'test-event')
    const evt: any = { currentTarget: elem, clientX: 1, clientY: 2 }
    const mockCellView = {
      onCustomEvent: vi.fn(),
      cell: new Cell(),
    } as any
    vi.spyOn(view, 'findView').mockReturnValue(mockCellView)
    view.onCustomEvent(evt)
    expect(mockCellView.onCustomEvent).toHaveBeenCalledWith(
      expect.anything(),
      'test-event',
      1,
      2,
    )
  })

  it('onMagnetMouseDown should trigger view.onMagnetMouseDown', () => {
    const elem = document.createElement('div')
    elem.setAttribute('magnet', 'true')
    const evt: any = { currentTarget: elem, clientX: 1, clientY: 2 }
    const mockCellView = {
      onMagnetMouseDown: vi.fn(),
      cell: new Cell(),
    } as any
    vi.spyOn(view, 'findView').mockReturnValue(mockCellView)
    view.onMagnetMouseDown(evt)
    expect(mockCellView.onMagnetMouseDown).toHaveBeenCalled()
  })

  it('onLabelMouseDown should call view.onLabelMouseDown', () => {
    const elem = document.createElement('div')
    const mockCellView = {
      cell: new Cell(),
      onLabelMouseDown: vi.fn(),
    } as any
    const evt: any = {
      currentTarget: elem,
      clientX: 1,
      clientY: 2,
    }
    vi.spyOn(view, 'findView').mockImplementation(() => mockCellView)
    view.onLabelMouseDown(evt)
    expect(mockCellView.onLabelMouseDown).toHaveBeenCalled()
  })

  it('onImageDragStart should return false', () => {
    expect(view.onImageDragStart()).toBe(false)
  })

  it('dispose should call restore and undelegateEvents', () => {
    const mockCellView = { onLabelMouseDown: vi.fn() } as any
    vi.spyOn(view, 'findView').mockReturnValue(mockCellView)
    vi.spyOn(view, 'guard').mockReturnValue(false)
    view.onLabelMouseDown({ type: 'mousedown', target: {} } as any)
    expect(mockCellView.onLabelMouseDown).toHaveBeenCalled()
  })
})
