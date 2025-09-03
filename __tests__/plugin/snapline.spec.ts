import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { Dom, type Graph, NodeView, Snapline, Transform } from '../../src'
import { createTestGraph } from '../utils/graph-helpers'
import { sleep } from '../utils/sleep'

const snaplineClassName = 'x6-widget-snapline'
const horizontalClassName = 'x6-widget-snapline-horizontal'
const verticalClassName = 'x6-widget-snapline-vertical'

describe('plugin/snapline', () => {
  let graph: Graph
  let cleanup: () => void

  beforeEach(() => {
    const { graph: g, cleanup: c } = createTestGraph()
    graph = g
    cleanup = c
  })

  afterEach(() => {
    cleanup()
  })

  interface CreateOptions {
    movedPosition?: { x?: number; y?: number }
    originPosition?: { x?: number; y?: number }
    snapNodePosition?: { x?: number; y?: number }
    initialMove?: boolean
  }

  const createVisibleSnapline = (
    sOptions?: Snapline.Options,
    createOptions?: CreateOptions,
  ) => {
    const {
      originPosition,
      snapNodePosition,
      movedPosition,
      initialMove = true,
    } = createOptions ?? {}

    const defaultOriginPosition = {
      x: 60,
      y: 50,
    }
    graph.use(new Snapline(sOptions))
    const snapline = graph.getPlugin('snapline') as Snapline

    const mainNode = graph.addNode({
      id: 'n1',
      ...defaultOriginPosition,
      ...originPosition,
      width: 80,
      height: 40,
    })

    graph.addNode({
      id: 'n2',
      x: 100,
      y: 60,
      ...snapNodePosition,
      width: 80,
      height: 40,
    })

    const n1View = graph.findViewByCell(mainNode.id)
    Object.defineProperty(n1View, 'getDelegatedView', {
      value: function () {
        return NodeView.prototype.getDelegatedView.call(this)
      },
      enumerable: false,
      writable: true,
      configurable: true,
    })
    const mousedownEvent = new Dom.EventObject(new MouseEvent('mousedown'))
    const targetView = NodeView.prototype.getDelegatedView.call(n1View)
    NodeView.prototype.setEventData.call(n1View, mousedownEvent, {
      targetView,
      action: 'move',
    })

    const oHoEl = graph.container.querySelector(`.${horizontalClassName}`)
    const oVeEl = graph.container.querySelector(`.${verticalClassName}`)
    expect(oHoEl).toBe(null)
    expect(oVeEl).toBe(null)

    if (initialMove) {
      graph.trigger('node:mousedown', {
        ...defaultOriginPosition,
        ...originPosition,
        e: mousedownEvent,
        view: n1View,
      })
      graph.trigger('node:mousemove', {
        x: 60,
        y: 60,
        ...movedPosition,
        e: new Dom.EventObject(new MouseEvent('mousemove')),
        view: n1View,
      })
    }

    return { mainNode, snapline }
  }

  const getHlineDisplay = () => {
    const hoEl = graph.container.querySelector(`.${horizontalClassName}`)
    return hoEl?.getAttribute('display')
  }

  const getVlineDisplay = () => {
    const veEl = graph.container.querySelector(`.${verticalClassName}`)
    return veEl?.getAttribute('display')
  }

  it('method and options', () => {
    graph.use(
      new Snapline({
        enabled: true,
      }),
    )
    const snapline = graph.getPlugin('snapline') as Snapline

    expect(snapline.options).toEqual({ enabled: true, tolerance: 10 })
    expect(snapline.name).toBe('snapline')
    expect(snapline.isEnabled()).toBe(true)

    snapline.enable()
    expect(snapline.isEnabled()).toBe(true)

    snapline.disable()
    expect(snapline.isEnabled()).toBe(false)

    snapline.toggleEnabled()
    expect(snapline.isEnabled()).toBe(true)
    snapline.toggleEnabled(false)
    expect(snapline.isEnabled()).toBe(false)
  })

  it('graph api of snapline', () => {
    createVisibleSnapline(undefined, {
      movedPosition: {
        x: 100,
        y: 100,
      },
      snapNodePosition: {
        x: 100,
        y: 100,
      },
    })

    expect(getHlineDisplay()).toBe('inherit')
    expect(getVlineDisplay()).toBe('inherit')

    expect(graph.isSnaplineEnabled()).toBe(true)

    graph.disableSnapline()
    expect(graph.isSnaplineEnabled()).toBe(false)

    graph.enableSnapline()
    expect(graph.isSnaplineEnabled()).toBe(true)

    graph.toggleSnapline()
    expect(graph.isSnaplineEnabled()).toBe(false)

    graph.toggleSnapline(true)
    expect(graph.isSnaplineEnabled()).toBe(true)

    expect(graph.isSnaplineOnResizingEnabled()).toBe(false)

    graph.enableSnaplineOnResizing()
    expect(graph.isSnaplineOnResizingEnabled()).toBe(true)

    graph.disableSnaplineOnResizing()
    expect(graph.isSnaplineOnResizingEnabled()).toBe(false)

    graph.toggleSnaplineOnResizing()
    expect(graph.isSnaplineOnResizingEnabled()).toBe(true)

    graph.toggleSnaplineOnResizing(false)
    expect(graph.isSnaplineOnResizingEnabled()).toBe(false)

    expect(graph.isSharpSnapline()).toBe(false)

    graph.enableSharpSnapline()
    expect(graph.isSharpSnapline()).toBe(true)

    graph.disableSharpSnapline()
    expect(graph.isSharpSnapline()).toBe(false)

    graph.toggleSharpSnapline()
    expect(graph.isSharpSnapline()).toBe(true)

    graph.toggleSharpSnapline()
    expect(graph.isSharpSnapline()).toBe(false)

    expect(graph.getSnaplineTolerance()).toBe(10)

    graph.setSnaplineTolerance(5)
    expect(graph.getSnaplineTolerance()).toBe(5)

    graph.hideSnapline()
    expect(getHlineDisplay()).toBe('none')
    expect(getVlineDisplay()).toBe('none')
  })

  it('should only show horizontal line', async () => {
    createVisibleSnapline(undefined, {
      movedPosition: {
        x: 60,
        y: 60,
      },
      snapNodePosition: {
        x: 100,
        y: 60,
      },
    })

    expect(getHlineDisplay()).toBe('inherit')
    expect(getVlineDisplay()).toBe('none')
  })

  it('should only show vertical line', async () => {
    createVisibleSnapline(undefined, {
      movedPosition: {
        x: 100,
        y: 120,
      },
      snapNodePosition: {
        x: 100,
        y: 60,
      },
    })

    expect(getHlineDisplay()).toBe('none')
    expect(getVlineDisplay()).toBe('inherit')
  })

  it('should show vertical and horizontal line when overlap', async () => {
    createVisibleSnapline(undefined, {
      movedPosition: {
        x: 100,
        y: 100,
      },
      snapNodePosition: {
        x: 100,
        y: 100,
      },
    })

    expect(getHlineDisplay()).toBe('inherit')
    expect(getVlineDisplay()).toBe('inherit')
  })

  it('should show vertical and horizontal line when the distance between center points equals the height', async () => {
    createVisibleSnapline(undefined, {
      movedPosition: {
        x: 100,
        y: 100,
      },
      snapNodePosition: {
        x: 100,
        y: 60,
      },
    })

    expect(getHlineDisplay()).toBe('inherit')
    expect(getVlineDisplay()).toBe('inherit')
  })

  it('should delay hide snapline when clean options are provided', async () => {
    const { snapline } = createVisibleSnapline({
      clean: 3000,
    })
    const snaplineEl = graph.container.querySelector(`.${snaplineClassName}`)
    expect(snaplineEl).not.toBe(null)

    snapline.hide()
    await sleep(3000)
    const newSnaplineEl = graph.container.querySelector(`.${snaplineClassName}`)
    expect(newSnaplineEl).toBe(null)
  })

  it('with transform resizing plugin', () => {
    const { mainNode } = createVisibleSnapline(
      {
        resizing: true,
      },
      {
        initialMove: false,
        originPosition: {
          x: 0,
          y: 0,
        },
        snapNodePosition: {
          x: 120,
          y: 60,
        },
      },
    )

    graph.use(
      new Transform({
        resizing: true,
      }),
    )

    const baseResizeEvent = {
      cell: mainNode,
      ui: true,
      direction: 'bottom-right',
      relativeDirection: 'bottom',
      trueDirection: 'bottom',
      minWidth: 0,
      minHeight: 0,
      maxWidth: 9007199254740991,
      maxHeight: 9007199254740991,
      preserveAspectRatio: false,
    }

    graph.model.trigger('batch:stop', {
      name: 'resize',
      data: baseResizeEvent,
    })
    expect(getHlineDisplay()).toBe('none')
    expect(getVlineDisplay()).toBe('none')

    mainNode.resize(80, 60, {
      direction: 'bottom-right',
      silent: true,
    })
    graph.model.trigger('batch:stop', {
      name: 'resize',
      data: { ...baseResizeEvent, direction: 'bottom-right' },
    })
    expect(getHlineDisplay()).toBe('inherit')
    expect(getVlineDisplay()).toBe('none')

    mainNode.resize(120, 60, {
      direction: 'top-right',
      silent: true,
    })
    graph.model.trigger('batch:stop', {
      name: 'resize',
      data: {
        ...baseResizeEvent,
        direction: 'top-right',
        relativeDirection: 'right',
        trueDirection: 'right',
      },
    })
    expect(getHlineDisplay()).toBe('none')
    expect(getVlineDisplay()).toBe('inherit')

    mainNode.resize(120, 60, {
      direction: 'top-left',
      silent: true,
    })
    graph.model.trigger('batch:stop', {
      name: 'resize',
      data: {
        ...baseResizeEvent,
        direction: 'top-left',
        relativeDirection: 'top-left',
        trueDirection: 'top-left',
      },
    })
    expect(getHlineDisplay()).toBe('none')
    expect(getVlineDisplay()).toBe('none')
  })

  it('filter option with empty array', () => {
    createVisibleSnapline(
      {
        filter: [],
      },
      {
        movedPosition: {
          x: 100,
          y: 100,
        },
        snapNodePosition: {
          x: 100,
          y: 60,
        },
      },
    )

    const oHoEl = graph.container.querySelector(`.${horizontalClassName}`)
    const oVeEl = graph.container.querySelector(`.${verticalClassName}`)
    expect(oHoEl).toBe(null)
    expect(oVeEl).toBe(null)
  })

  it('filter option with valid shape array', () => {
    createVisibleSnapline(
      {
        filter: ['rect'],
      },
      {
        movedPosition: {
          x: 100,
          y: 100,
        },
        snapNodePosition: {
          x: 100,
          y: 60,
        },
      },
    )

    expect(getHlineDisplay()).toBe('inherit')
    expect(getVlineDisplay()).toBe('inherit')
  })

  it('filter option with invalid shape array', () => {
    createVisibleSnapline(
      {
        filter: ['circle'],
      },
      {
        movedPosition: {
          x: 100,
          y: 100,
        },
        snapNodePosition: {
          x: 100,
          y: 60,
        },
      },
    )

    const oHoEl = graph.container.querySelector(`.${horizontalClassName}`)
    const oVeEl = graph.container.querySelector(`.${verticalClassName}`)
    expect(oHoEl).toBe(null)
    expect(oVeEl).toBe(null)
  })
})
