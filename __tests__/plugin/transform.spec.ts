import { beforeEach, describe, expect, it, vi } from 'vitest'
import '../../src/plugin/transform/api'
import { Graph } from '../../src/graph'
import { Transform } from '../../src/plugin/transform'
import { TransformImpl } from '../../src/plugin/transform/transform'

function createMockGraph() {
  const nodes: any[] = []
  const graph = {
    container: document.createElement('div'),
    on: vi.fn(),
    off: vi.fn(),
    trigger: vi.fn(),
    getPlugin: vi.fn(),
    snapToGrid: (x: number, y: number) => ({ x, y }),
    getGridSize: () => 1,
    findViewByCell: (node: any) => ({
      cell: node,
      graph,
      addClass: vi.fn(),
      removeClass: vi.fn(),
    }),
    matrix: () => ({ a: 1, d: 1, e: 0, f: 0 }),
    model: {
      on: vi.fn(),
      off: vi.fn(),
      startBatch: vi.fn(),
      stopBatch: vi.fn(),
    },
    nodes,
    getCellById: (id: string) => nodes.find((n) => n.id === id) || null,
    renderer: {
      findViewByCell: (node: any) => ({
        cell: node,
        graph,
        addClass: vi.fn(),
        removeClass: vi.fn(),
        on: vi.fn(),
        off: vi.fn(),
      }),
    },
    view: {
      delegateEvents: vi.fn(),
      undelegateEvents: vi.fn(),
      normalizeEvent: (e: any) => e,
      removeClass: vi.fn(),
    },
  }

  return graph
}

function createMockNode() {
  return {
    id: 'node1',
    getBBox: () => ({
      x: 0,
      y: 0,
      width: 100,
      height: 50,
      getCenter: () => ({ x: 50, y: 25 }),
    }),
    getAngle: () => 0,
    rotate: vi.fn(),
    resize: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  }
}

describe('Transform Plugin', () => {
  let graph: ReturnType<typeof createMockGraph>
  let node: ReturnType<typeof createMockNode>
  let plugin: Transform

  beforeEach(() => {
    graph = createMockGraph()
    node = createMockNode()
    plugin = new Transform({
      resizing: true,
      rotating: true,
    })
    plugin.init(graph as any)
  })

  it('should enable / disable plugin', () => {
    expect(plugin.isEnabled()).toBe(true)
    plugin.disable()
    expect(plugin.isEnabled()).toBe(false)
    plugin.enable()
    expect(plugin.isEnabled()).toBe(true)
  })

  it('should create widget for node', () => {
    plugin.createWidget(node as any)
    const widget = plugin['widgets'].get(node)
    expect(widget).toBeInstanceOf(TransformImpl)
    expect(plugin['widgets'].size).toBe(1)
  })

  it('should clear widgets on blank click', () => {
    plugin.createWidget(node as any)
    expect(plugin['widgets'].size).toBe(1)
    plugin['onBlankMouseDown']()
    expect(plugin['widgets'].size).toBe(0)
  })

  it('should trigger widget events', () => {
    const spy = vi.spyOn(plugin, 'trigger')
    plugin.createWidget(node as any)
    const widget = plugin['widgets'].get(node)!
    widget.trigger('node:resize', {})
    expect(spy).toHaveBeenCalledWith('node:resize', {})
  })
  it('should handle createTransform returning null', () => {
    plugin.options.resizing = false
    plugin.options.rotating = false
    const result = (plugin as any).createTransform(node)
    expect(result).toBeNull()
  })

  it('should parse resizing/rotating as function', () => {
    plugin.options.resizing = { enabled: () => true }
    plugin.options.rotating = { enabled: () => false }
    const opts = (plugin as any).getTransformOptions(node)
    expect(opts.resizable).toBe(true)
    expect(opts.rotatable).toBe(false)
  })

  it('should clearWidgets when getCellById returns null', () => {
    plugin.createWidget(node as any)
    expect(plugin['widgets'].size).toBe(1)
    plugin.clearWidgets()
    expect(plugin['widgets'].size).toBe(0)
  })
  it('should return null if neither resizable nor rotatable', () => {
    const plugin = new Transform({ resizing: false, rotating: false })
    plugin.init(graph as any)
    const node = createMockNode()
    const result = (plugin as any).createTransform(node as any)
    expect(result).toBeNull()
  })
  it('should parse transform options correctly', () => {
    const plugin = new Transform({
      resizing: true,
      rotating: { enabled: false },
    })
    plugin.init(graph as any)
    const node = createMockNode()
    const options = (plugin as any).getTransformOptions(node)
    expect(options.resizable).toBe(true)
    expect(options.rotatable).toBe(false)
  })
  it('should not call dispose if node removed in clearWidgets', () => {
    const plugin = new Transform({ resizing: true, rotating: true })
    plugin.init(graph as any)
    const node = createMockNode()
    const widget = new TransformImpl(
      { resizable: true, rotatable: true },
      node as any,
      graph as any,
    )
    ;(plugin as any).widgets.set(node, widget)

    vi.spyOn(widget, 'dispose')
    vi.spyOn(graph, 'getCellById').mockReturnValue(null)
    ;(plugin as any).clearWidgets()
    expect(widget.dispose).not.toHaveBeenCalled()
  })
})

describe('TransformImpl', () => {
  let graph: ReturnType<typeof createMockGraph>
  let node: ReturnType<typeof createMockNode>
  let transform: TransformImpl

  beforeEach(() => {
    graph = createMockGraph()
    node = createMockNode()
    transform = new TransformImpl(
      {
        resizable: true,
        rotatable: true,
        preserveAspectRatio: true,
        allowReverse: true,
      },
      node as any,
      graph as any,
    )
  })

  it('should render container', () => {
    expect(transform.container).toBeInstanceOf(HTMLElement)
    expect(transform.container.classList.contains('x6-widget-transform')).toBe(
      true,
    )
  })

  it('should update container on update call', () => {
    transform.update()
    const style = transform.container.style
    expect(style.width).toBe('100px')
    expect(style.height).toBe('50px')
  })

  it('should handle start/stop handle', () => {
    transform['startHandle']()
    expect(
      transform.container.classList.contains('x6-widget-transform-active'),
    ).toBe(true)
    transform['stopHandle']()
    expect(
      transform.container.classList.contains('x6-widget-transform-active'),
    ).toBe(false)
  })

  it('should update on node change', () => {
    const spy = vi.spyOn(transform, 'update')
    transform.update()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('should prepare resizing event', () => {
    const evt: any = {
      target: transform.container.querySelector(
        `.${transform['resizeClassName']}`,
      ),
      data: {},
    }
    transform['prepareResizing'](evt, 'top-left')
    const data = transform['getEventData'](evt)
    expect(data.action).toBe('resizing')
  })

  it('should dispose correctly', () => {
    transform.dispose()
    expect(transform['container']).toBeDefined()
  })

  it('should handle startResizing with reverse logic', () => {
    const evt: any = {
      target: transform.container.querySelector(
        `.${transform['resizeClassName']}`,
      ),
      stopPropagation: vi.fn(),
      data: {},
    }
    // 模拟 resize 触发需要反转
    const data = {
      relativeDirection: 'top-left',
      action: 'resizing',
      resizeX: -1,
      resizeY: -1,
    }
    ;(transform as any).setEventData(evt, data)
    ;(transform as any).onMouseMove(evt)
    expect(node.resize).toHaveBeenCalled()
  })

  it('should handle startRotating and onMouseMove', () => {
    const evt: any = {
      clientX: 100,
      clientY: 100,
      stopPropagation: vi.fn(),
      data: {},
    }
    const center = { x: 0, y: 0 }
    const spy = vi.spyOn(node, 'rotate')

    transform['startRotating'](evt)

    // 获取事件数据
    const data = transform['getEventData'](evt)
    data.angle = 0 // 初始角度
    data.start = -90 // 模拟鼠标移动产生旋转
    data.center = center

    // 模拟移动
    transform['onMouseMove'](evt)

    expect(spy).toHaveBeenCalled()
  })

  it('should handle stopAction for resizing and rotating', () => {
    const evt: any = {
      data: { action: 'resizing', resized: true },
      clientX: 0,
      clientY: 0,
    }
    ;(transform as any).stopAction(evt)
    const evt2: any = {
      data: { action: 'rotating', rotated: true },
      clientX: 0,
      clientY: 0,
    }
    ;(transform as any).stopAction(evt2)
  })
  it('should handle allowReverse resizing', () => {
    const evt: any = {
      target: transform.container.querySelector(
        `.${transform['resizeClassName']}`,
      ),
      stopPropagation: vi.fn(),
      clientX: 0,
      clientY: 0,
      data: {},
    }

    const data = {
      action: 'resizing',
      selector: 'bottomLeft',
      direction: 'top-left',
      trueDirection: 'top-left',
      relativeDirection: 'top-left',
      resizeX: 1,
      resizeY: 1,
      angle: 0,
    }
    transform['setEventData'](evt, data)
    transform['onMouseMove'](evt)
  })

  it('should stop batch on mouseup', () => {
    const evt: any = { data: {} }
    const spy = vi.spyOn(transform['model'], 'stopBatch')
    vi.spyOn(transform as any, 'getEventData').mockReturnValue({
      action: 'resizing',
    })

    transform['onMouseUp'](evt)
    expect(spy).toHaveBeenCalledWith('resize', { cid: transform['cid'] })

    vi.spyOn(transform as any, 'getEventData').mockReturnValue({
      action: 'rotating',
    })
    transform['onMouseUp'](evt)
    expect(spy).toHaveBeenCalledWith('rotate', { cid: transform['cid'] })
  })

  it('should calculate true and valid directions', () => {
    const positions = [
      'top-left',
      'top',
      'top-right',
      'right',
      'bottom-right',
      'bottom',
      'bottom-left',
      'left',
    ]
    const dir = transform['getTrueDirection']('top-left')
    expect(positions).toContain(dir)

    expect(transform['toValidResizeDirection']('top')).toBe('top-left')
    expect(transform['toValidResizeDirection']('unknown')).toBe('unknown')
  })
})

describe('Graph API: Transform extensions', () => {
  let graph: any
  let node: Node

  beforeEach(() => {
    graph = new Graph({
      container: document.createElement('div'),
      width: 500,
      height: 500,
      grid: false,
      mousewheel: {},
      panning: {},
    })
    node = {} as Node
  })

  it('should call createWidget on transform plugin via createTransformWidget', () => {
    const transformMock = { createWidget: vi.fn() } as unknown as Transform
    vi.spyOn(graph, 'getPlugin').mockReturnValue(transformMock)

    const result = graph.createTransformWidget(node)
    expect(transformMock.createWidget).toHaveBeenCalledWith(node)
    expect(result).toBe(graph)
  })

  it('should call clearWidgets on transform plugin via clearTransformWidgets', () => {
    const transformMock = { clearWidgets: vi.fn() } as unknown as Transform
    vi.spyOn(graph, 'getPlugin').mockReturnValue(transformMock)

    const result = graph.clearTransformWidgets()
    expect(transformMock.clearWidgets).toHaveBeenCalled()
    expect(result).toBe(graph)
  })

  it('should do nothing if transform plugin not found', () => {
    vi.spyOn(graph, 'getPlugin').mockReturnValue(undefined)

    const result1 = graph.createTransformWidget(node)
    const result2 = graph.clearTransformWidgets()
    expect(result1).toBe(graph)
    expect(result2).toBe(graph)
  })
})

describe('TransformImpl.stopHandle', () => {
  let instance: TransformImpl
  let container: HTMLElement
  let handle: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    handle = document.createElement('div')

    instance = Object.create(TransformImpl.prototype) as TransformImpl

    // 给 instance 挂上 container
    Object.defineProperty(instance, 'container', {
      value: container,
      writable: true,
    })

    // mock containerClassName 的 getter
    vi.spyOn(instance as any, 'containerClassName', 'get').mockReturnValue(
      'x6-transform',
    )

    // 确保 handle 初始为空
    ;(instance as any).handle = null
  })

  it('should remove only active class if no handle', () => {
    container.classList.add('x6-transform-active')
    instance.stopHandle()

    expect(container.classList.contains('x6-transform-active')).toBe(false)
    expect((instance as any).handle).toBeNull()
  })

  it('should remove active and handle classes with valid data-position', () => {
    container.classList.add('x6-transform-active', 'x6-transform-cursor-n')
    handle.classList.add('x6-transform-active-handle')
    handle.setAttribute('data-position', 'top')
    ;(instance as any).handle = handle

    instance.stopHandle()

    expect(container.classList.contains('x6-transform-active')).toBe(false)
    expect(handle.classList.contains('x6-transform-active-handle')).toBe(false)
    expect([...container.classList].some((c) => c.includes('cursor-'))).toBe(
      false,
    )
    expect((instance as any).handle).toBeNull()
  })

  it('should clear handle even if data-position is invalid', () => {
    container.classList.add('x6-transform-active')
    handle.classList.add('x6-transform-active-handle')
    handle.setAttribute('data-position', 'invalid-pos')
    ;(instance as any).handle = handle

    instance.stopHandle()

    expect(container.classList.contains('x6-transform-active')).toBe(false)
    expect(handle.classList.contains('x6-transform-active-handle')).toBe(false)
    expect([...container.classList].some((c) => c.includes('cursor-'))).toBe(
      false,
    )
    expect((instance as any).handle).toBeNull()
  })
})
