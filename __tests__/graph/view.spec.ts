import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest'
import { Graph } from '../../src/graph'
import { GraphView } from '../../src'
import { createTestGraph } from '../utils'
import { Dom } from '../../src/common'

describe('GraphView', () => {
  let graph: Graph
  let view: GraphView
  let cleanup: () => void

  beforeEach(() => {
    const { graph: g, cleanup: c } = createTestGraph()
    graph = g
    cleanup = c
    view = new GraphView(graph)
  })

  afterAll(() => {
    cleanup()
  })

  it('should mount with correct DOM structure', () => {
    expect(view.container.classList.contains('x6-graph')).toBeTruthy()
    expect(view.background).toBeInstanceOf(HTMLDivElement)
    expect(view.svg).toBeInstanceOf(SVGSVGElement)
  })

  it('guard should return true for right click', () => {
    const e: any = { type: 'mousedown', button: 2 }
    expect(view.guard(e)).toBeTruthy()
  })

  it('guard should return false if event target inside svg', () => {
    const e: any = { type: 'click', target: view.svg }
    expect(view.guard(e)).toBeFalsy()
  })

  it('onClick should trigger blank:click when no view', () => {
    const spy = vi.spyOn(graph, 'trigger')
    const evt: any = new Dom.EventObject(
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    )
    evt.clientX = 10
    evt.clientY = 20
    evt.target = graph.container // ✅ 容器本身，不属于 cell
    evt.data = { mouseMovedCount: 0 }

    view.onClick(evt)
    expect(spy).toHaveBeenCalledWith('blank:click', expect.any(Object))
  })

  it('onDblClick should trigger blank:dblclick when no view', () => {
    const spy = vi.spyOn(graph, 'trigger')
    const evt: any = new Dom.EventObject(
      new MouseEvent('dblclick', { bubbles: true, cancelable: true }),
    )
    evt.clientX = 10
    evt.clientY = 20
    evt.target = graph.container
    evt.data = { mouseMovedCount: 0 }
    view.onDblClick(evt)
    expect(spy).toHaveBeenCalledWith('blank:dblclick', expect.any(Object))
  })

  it('onContextMenu should preventDefault and trigger blank:contextmenu', () => {
    const spy = vi.spyOn(graph, 'trigger')
    const prevent = vi.fn()
    const evt: any = new Dom.EventObject(
      new MouseEvent('contextmenu', { bubbles: true, cancelable: true }),
    )
    evt.clientX = 50
    evt.clientY = 60
    evt.preventDefault = prevent
    evt.target = graph.container
    evt.data = { mouseMovedCount: 0 }
    view.onContextMenu(evt)
    expect(prevent).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith('blank:contextmenu', expect.any(Object))
  })

  it('delegateDragEvents should set eventData and undelegateEvents', () => {
    const e: any = new Dom.EventObject(new MouseEvent('mousedown'))
    e.clientX = 1
    e.clientY = 2
    view.delegateDragEvents(e, null)
    const data = view.getEventData(e)
    expect(data.startPosition).toEqual({ x: 1, y: 2 })
  })

  it('onMouseMove should increment mouseMovedCount', () => {
    const e: any = new Dom.EventObject(new MouseEvent('mousemove'))
    e.clientX = 3
    e.clientY = 4
    view.setEventData(e, {
      startPosition: { x: 1, y: 2 },
      mouseMovedCount: 0,
    })
    view.onMouseMove(e)
    const data = view.getEventData(e)
    expect(data.mouseMovedCount).toBeGreaterThan(0)
  })

  it('onMouseUp should trigger blank:mouseup when no view', () => {
    const spy = vi.spyOn(graph, 'trigger')
    const e: any = new Dom.EventObject(new MouseEvent('mouseup'))
    e.clientX = 7
    e.clientY = 8
    view.setEventData(e, { currentView: null })
    view.onMouseUp(e)
    expect(spy).toHaveBeenCalledWith('blank:mouseup', expect.any(Object))
  })

  it('snapshoot and restore should work', () => {
    const container = document.createElement('div')
    container.setAttribute('data-test', '1')
    const child = document.createElement('span')
    container.appendChild(child)
    const restore = GraphView.snapshoot(container)
    container.setAttribute('data-test', '2')
    container.innerHTML = ''
    restore()
    expect(container.getAttribute('data-test')).toBe('1')
    expect(container.querySelector('span')).not.toBeNull()
  })

  it('dispose should restore DOM and clean listeners', () => {
    const spy = vi.spyOn(view as any, 'undelegateEvents')
    view.dispose()
    expect(spy).toHaveBeenCalled()
  })
})
