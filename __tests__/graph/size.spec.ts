import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createTestGraph } from '../utils'

class MockResizeObserver {
  cb: (entries: any[], observer: any) => void
  constructor(cb: (entries: any[], observer: any) => void) {
    this.cb = cb
    instances.push(this)
  }
  observe = (...args: any[]) => observeMock(...args)
  disconnect = (...args: any[]) => disconnectMock(...args)
}

let observeMock: vi.Mock
let disconnectMock: vi.Mock
let instances: MockResizeObserver[]


describe('SizeManager', () => {
  beforeEach(() => {
    observeMock = vi.fn()
    disconnectMock = vi.fn()
    instances = []
    // @ts-expect-error - inject mock into global
    globalThis.ResizeObserver = MockResizeObserver
  })

  afterEach(() => {
    // @ts-expect-error - cleanup mock
    delete globalThis.ResizeObserver
  })

  it('should observe when autoResize = true', () => {
    createTestGraph({ autoResize: true })
    expect(observeMock).toHaveBeenCalledTimes(1)
    const target = observeMock.mock.calls[0][0]
    expect(target).toBeInstanceOf(HTMLElement)
  })

  it('should not observe when autoResize = false', () => {
    createTestGraph({ autoResize: false })
    expect(observeMock).not.toHaveBeenCalled()
  })

  it('should observe when autoResize is HTMLElement', () => {
    const customEl = document.createElement('div')
    Object.defineProperty(customEl, 'offsetWidth', { value: 400 })
    Object.defineProperty(customEl, 'offsetHeight', { value: 200 })
    createTestGraph({ autoResize: customEl })
    expect(observeMock).toHaveBeenCalledWith(customEl)
  })

  it('should delegate to graph.transform.resize if no scroller', () => {
    const { graph } = createTestGraph({ autoResize: true })
    const resizeSpy = vi.spyOn(graph.transform, 'resize')
    graph.size.resize(200, 100)
    expect(resizeSpy).toHaveBeenCalledWith(200, 100)
  })

  it('should call scroller.resize if scroller exists', () => {
    const { graph } = createTestGraph({ autoResize: true })
    const resizeSpy = vi.fn()
    graph.getPlugin = vi.fn().mockReturnValue({
      options: { enabled: true },
      resize: resizeSpy,
      container: document.createElement('div'),
    })
    graph.size.resize(300, 150)
    expect(resizeSpy).toHaveBeenCalledWith(300, 150)
  })

  it('should trigger resize when observer callback fired', () => {
    const { graph } = createTestGraph({ autoResize: true })
    const resizeSpy = vi.spyOn(graph.size, 'resize')
    const ro = instances[0]
    expect(ro).toBeDefined()
    ro.cb([{ contentRect: { width: 400, height: 200 } }] as any, {} as any)
    expect(resizeSpy).toHaveBeenCalledWith(400, 200)
  })

  it('should disconnect observer on dispose', () => {
    const { graph } = createTestGraph({ autoResize: true })
    graph.size.dispose()
    expect(disconnectMock).toHaveBeenCalled()
  })
})
