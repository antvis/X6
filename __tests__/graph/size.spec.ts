import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SizeSensor } from '../../src'
import { createTestGraph } from '../utils'

describe('SizeManager', () => {
  let bindSpy: any
  let clearSpy: any

  beforeEach(() => {
    bindSpy = vi
      .spyOn(SizeSensor, 'bind')
      .mockImplementation((_el, cb: any) => {
        return cb
      })
    clearSpy = vi.spyOn(SizeSensor, 'clear').mockImplementation(() => {})
  })

  it('should bind SizeSensor when autoResize = true', () => {
    createTestGraph({
      autoResize: true,
    })
    expect(bindSpy).toHaveBeenCalled()
  })

  it('should not bind SizeSensor when autoResize = false', () => {
    createTestGraph({
      autoResize: false,
    })
    expect(bindSpy).not.toHaveBeenCalled()
  })

  it('should bind SizeSensor when autoResize is HTMLElement', () => {
    const customEl = document.createElement('div')
    createTestGraph({
      autoResize: customEl,
    })
    expect(bindSpy).toHaveBeenCalledWith(customEl, expect.any(Function))
  })

  it('should call graph.transform.resize if no scroller', () => {
    const { graph } = createTestGraph({
      autoResize: true,
    })
    const resizeSpy = vi.spyOn(graph.transform, 'resize')
    graph.transform.resize(200, 100)
    expect(resizeSpy).toHaveBeenCalledWith(200, 100)
  })

  it('should call scroller.resize if scroller exists', () => {
    const { graph } = createTestGraph({
      autoResize: true,
    })
    const resizeSpy = vi.fn()
    graph.getPlugin = vi.fn().mockReturnValue({
      options: { enabled: true },
      resize: resizeSpy,
      container: document.createElement('div'),
    })
    graph.size.resize(300, 150)
    expect(resizeSpy).toHaveBeenCalledWith(300, 150)
  })

  it('should trigger resize when sensor callback fired', () => {
    const { graph } = createTestGraph({
      autoResize: true,
    })
    const resizeSpy = vi.spyOn(graph.size, 'resize')
    const el = document.createElement('div')
    Object.defineProperty(el, 'offsetWidth', { value: 400 })
    Object.defineProperty(el, 'offsetHeight', { value: 200 })
    bindSpy.mock.calls[0][1]()
    expect(resizeSpy).toHaveBeenCalled()
  })

  it('should clear sensor on dispose', () => {
    const { graph } = createTestGraph({
      autoResize: true,
    })
    graph.size.dispose()
    expect(clearSpy).toHaveBeenCalledWith(graph.container)
  })
})
