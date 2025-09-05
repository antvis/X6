import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Dom } from '../../../src/common'
import { opacity } from '../../../src/registry/highlighter/opacity'

vi.mock('../../../src/common', () => ({
  Dom: {
    addClass: vi.fn(),
    removeClass: vi.fn(),
  },
}))

vi.mock('../../../src/config', () => ({
  Config: {
    prefix: vi.fn().mockReturnValue('x6-highlight-opacity'),
  },
}))

describe('Opacity Highlighter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('应该给元素添加正确的 CSS 类', () => {
    const mockMagnet = document.createElement('div')
    const mockCellView = {} as any

    opacity.highlight(mockCellView, mockMagnet)

    expect(Dom.addClass).toHaveBeenCalledWith(
      mockMagnet,
      'x6-highlight-opacity',
    )
  })

  it('应该使用 Config.prefix 生成类名', () => {
    const mockMagnet = document.createElement('div')
    const mockCellView = {} as any

    opacity.highlight(mockCellView, mockMagnet)

    expect(Dom.addClass).toHaveBeenCalledWith(
      mockMagnet,
      'x6-highlight-opacity',
    )
  })
  describe('unhighlight', () => {
    it('应该从元素移除正确的 CSS 类', () => {
      const mockMagnetEl = document.createElement('div')
      const mockCellView = {} as any

      opacity.unhighlight(mockCellView, mockMagnetEl)

      expect(Dom.removeClass).toHaveBeenCalledWith(
        mockMagnetEl,
        'x6-highlight-opacity',
      )
    })

    it('应该使用 Config.prefix 生成类名', () => {
      const mockMagnetEl = document.createElement('div')
      const mockCellView = {} as any

      opacity.unhighlight(mockCellView, mockMagnetEl)

      expect(Dom.removeClass).toHaveBeenCalledWith(
        mockMagnetEl,
        'x6-highlight-opacity',
      )
    })
  })

  describe('类型定义', () => {
    it('应该导出正确的类型', () => {
      expect(opacity).toHaveProperty('highlight')
      expect(opacity).toHaveProperty('unhighlight')
      expect(typeof opacity.highlight).toBe('function')
      expect(typeof opacity.unhighlight).toBe('function')
    })
  })
})
