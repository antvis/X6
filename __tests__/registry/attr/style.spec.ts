import { describe, expect, it, vi } from 'vitest'
import { Dom } from '../../../src/common'
import { style } from '../../../src/registry/attr/style'

describe('Style attribute', () => {
  describe('qualify', () => {
    it('应该对普通对象返回true', () => {
      expect(style.qualify({ color: 'red' })).toBe(true)
    })

    it('应该对非普通对象返回false', () => {
      expect(style.qualify(null)).toBe(false)
      expect(style.qualify('string')).toBe(false)
      expect(style.qualify(123)).toBe(false)
      expect(style.qualify([])).toBe(false)
    })
  })

  describe('set', () => {
    it('应该正确设置元素样式', () => {
      const mockElem = document.createElement('div')
      const mockCss = vi.spyOn(Dom, 'css')

      style.set({ color: 'red', width: 100 }, { elem: mockElem })

      expect(mockCss).toHaveBeenCalledWith(mockElem, {
        color: 'red',
        width: 100,
      })
    })
  })
})
