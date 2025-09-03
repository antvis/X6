import { describe, expect, it, vi } from 'vitest'
import { sourceMarker, targetMarker } from '../../../src/registry/attr/marker'
import { markerRegistry } from '../../../src/registry/marker'
import type { CellView } from '../../../src/view'

describe('Marker attribute', () => {
  describe('qualify 方法', () => {
    it('应该验证字符串或普通对象', () => {
      expect(sourceMarker.qualify('arrow')).toBe(true)
      expect(sourceMarker.qualify({ name: 'arrow' })).toBe(true)
      expect(sourceMarker.qualify(123)).toBe(false)
      expect(sourceMarker.qualify(null)).toBe(false)
    })
  })

  describe('createMarker 函数', () => {
    const mockView = {
      graph: {
        defineMarker: vi.fn().mockReturnValue('marker-id'),
      },
    } as unknown as CellView

    const mockAttrs = {
      stroke: '#333',
      strokeWidth: '2',
    }

    beforeEach(() => {
      vi.resetAllMocks()
      markerRegistry.get = vi.fn().mockReturnValue(() => ({}))
    })

    it('应该处理字符串类型的 marker', () => {
      const result = sourceMarker.set('arrow', {
        view: mockView,
        attrs: mockAttrs,
      })
      expect(result).toEqual({ 'marker-start': 'url(#undefined)' })
      expect(mockView.graph.defineMarker).toHaveBeenCalled()
    })

    it('应该处理对象类型的 marker', () => {
      const result = sourceMarker.set(
        { name: 'arrow' },
        { view: mockView, attrs: mockAttrs },
      )
      expect(result).toEqual({ 'marker-start': 'url(#undefined)' })
    })

    it('应该应用 transform 到 targetMarker', () => {
      const result = targetMarker.set('arrow', {
        view: mockView,
        attrs: mockAttrs,
      })
      expect(mockView.graph.defineMarker).toHaveBeenCalledWith(
        expect.objectContaining({ transform: 'rotate(180)' }),
      )
    })
  })
})
