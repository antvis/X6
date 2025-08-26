import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} from 'vitest'
import { createTestGraph } from '../utils'
import { Background } from '../../src/registry'

describe('BackgroundManager', () => {
  let graph: any
  let cleanup: () => void

  beforeEach(() => {
    const { graph: g, cleanup: c } = createTestGraph({
      background: { color: '#f00' },
    })
    graph = g
    cleanup = c
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  afterAll(() => {
    cleanup()
  })

  beforeAll(() => {
    const canvasProto = Object.getPrototypeOf(document.createElement('canvas'))
    ;(global as any).HTMLCanvasElement = canvasProto.constructor
  })

  it('should init with background options', () => {
    const spy = vi.spyOn(graph.background, 'draw')
    graph.background['options'].background = { color: '#fff' }
    graph.background['init']()
    expect(spy).toHaveBeenCalled()
  })

  it('should update background color', () => {
    graph.background['updateBackgroundColor']('#123')
    expect(graph.view.background.style.backgroundColor).toBe('rgb(17, 34, 51)')
    graph.background['updateBackgroundColor'](null)
    expect(graph.view.background.style.backgroundColor).toBe('')
  })

  it('should update background options in graph', () => {
    graph.background['updateBackgroundOptions']({ color: '#aaa' })
    expect(graph.options.background.color).toBe('#aaa')
  })

  it('should update background image with string size/position', () => {
    graph.transform.getScale = () => ({ sx: 1, sy: 1 })
    graph.translate = () => ({ tx: 0, ty: 0 })
    graph.background['updateBackgroundImage']({
      size: '100px 200px',
      position: 'left top',
    })
    expect(graph.view.background.style.backgroundSize).toBe('100px 200px')
    expect(graph.view.background.style.backgroundPosition).toBe('left top')
  })

  it('should update background image with object size/position', () => {
    graph.transform.getScale = () => ({ sx: 2, sy: 3 })
    graph.translate = () => ({ tx: 10, ty: 20 })
    graph.background['updateBackgroundImage']({
      size: { width: 50, height: 60 },
      position: { x: 5, y: 6 },
    })
    expect(graph.view.background.style.backgroundSize).toMatch(/px/)
    expect(graph.view.background.style.backgroundPosition).toMatch(/px/)
  })

  it('should clear backgroundImage when drawBackgroundImage(null)', () => {
    graph.background['drawBackgroundImage'](null)
    expect(graph.view.background.style.backgroundImage).toBe('')
  })

  it('should draw plain image and set background', () => {
    const img = document.createElement('img')
    img.src = 'test.png'
    img.width = 100
    img.height = 50
    graph.background['optionsCache'] = { image: 'test.png' }
    graph.background['drawBackgroundImage'](img, { image: 'test.png' })
    expect(graph.view.background.style.backgroundImage).toContain('url')
    expect(graph.view.background.style.backgroundRepeat).toBe('no-repeat')
  })

  it('should support repeat pattern from registry', () => {
    const fakeCanvas = document.createElement('canvas')
    const fn = vi.fn().mockReturnValue(fakeCanvas)
    Background.registry.register('repeat-test', fn)
    const img = document.createElement('img')
    img.src =
      'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*aTu6SLT6SK4AAAAAAAAAAAAAemJ7AQ/fmt.avif'
    img.width = 10
    img.height = 10

    graph.background['optionsCache'] = { image: 'xx' }
    graph.background['drawBackgroundImage'](img, {
      image: 'xx',
      repeat: 'repeat-test',
      size: { width: 5, height: 5 },
      quality: 2,
    })

    expect(graph.view.background.style.backgroundImage).toContain('url')
    expect(graph.view.background.style.backgroundRepeat).toBe('repeat')
  })

  it('should skip drawBackgroundImage if cache.image mismatched', () => {
    const img = document.createElement('img')
    img.src = 'test.png'
    graph.background['optionsCache'] = { image: 'cached.png' }
    graph.background['drawBackgroundImage'](img, { image: 'other.png' })
    // 因为 cache.image !== options.image，什么也不做
    expect(graph.view.background.style.backgroundImage).not.toContain(
      'test.png',
    )
  })

  it('should call updateBackgroundImage inside drawBackgroundImage', () => {
    const img = document.createElement('img')
    img.src = 'test.png'
    const spy = vi.spyOn(graph.background, 'updateBackgroundImage')
    graph.background['optionsCache'] = { image: 'test.png' }
    graph.background['drawBackgroundImage'](img, { image: 'test.png' })
    expect(spy).toHaveBeenCalled()
  })

  it('should clear background when no options', () => {
    graph.background.draw()
    expect(graph.view.background.style.backgroundImage).toBe('')
  })

  it('should update() call updateBackgroundImage when optionsCache exists', () => {
    const spy = vi.spyOn(graph.background, 'updateBackgroundImage')
    graph.background['optionsCache'] = { image: 'xx' }
    graph.background.update()
    expect(spy).toHaveBeenCalled()
  })

  it('should clear background', () => {
    graph.background.clear()
    expect(graph.view.background.style.backgroundImage).toBe('')
  })

  it('should dispose correctly', () => {
    const clearSpy = vi.spyOn(graph.background, 'clear')
    const stopSpy = vi.spyOn(graph.background as any, 'stopListening')
    graph.background.dispose()
    expect(clearSpy).toHaveBeenCalled()
    expect(stopSpy).toHaveBeenCalled()
  })
})
