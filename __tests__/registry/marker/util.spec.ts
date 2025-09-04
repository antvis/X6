import { describe, expect, it } from 'vitest'
import { Path } from '../../../src/geometry'
import { normalize } from '../../../src/registry/marker/util'

describe('normalize', () => {
  it('应该正常处理空路径', () => {
    const result = normalize('')
    expect(result).toBe('')
  })

  it('应该处理简单的路径', () => {
    const path = 'M10,10 L20,20'
    const result = normalize(path)

    expect(result).toMatch(/^[MLHVCSQTAZ\s\d.,-]+$/)
  })

  it('应该应用 x 偏移量', () => {
    const path = 'M0,0 L10,0 L10,10 L0,10 Z'
    const result = normalize(path, { x: 5 })

    const normalizedPath = Path.parse(result)
    const bbox = normalizedPath.bbox()

    if (bbox) {
      expect(bbox.x + bbox.width / 2).toBeCloseTo(-5, 1)
    } else {
      throw new Error('无法计算边界框')
    }
  })

  it('应该应用 y 偏移量', () => {
    const path = 'M0,0 L10,0 L10,10 L0,10 Z'
    const result = normalize(path, { y: -3 })

    const normalizedPath = Path.parse(result)
    const bbox = normalizedPath.bbox()

    if (bbox) {
      expect(bbox.y + bbox.height / 2).toBeCloseTo(3, 1)
    } else {
      throw new Error('无法计算边界框')
    }
  })

  it('应该同时应用 x 和 y 偏移量', () => {
    const path = 'M0,0 L10,0 L10,10 L0,10 Z'
    const result = normalize(path, { x: 2, y: -2 })

    const normalizedPath = Path.parse(result)
    const bbox = normalizedPath.bbox()

    if (bbox) {
      expect(bbox.x + bbox.width / 2).toBeCloseTo(-2, 1)
      expect(bbox.y + bbox.height / 2).toBeCloseTo(2, 1)
    } else {
      throw new Error('无法计算边界框')
    }
  })

  it('应该支持数字参数的偏移量', () => {
    const path = 'M0,0 L10,0 L10,10 L0,10 Z'
    const result = normalize(path, 3, -4)

    const normalizedPath = Path.parse(result)
    const bbox = normalizedPath.bbox()

    if (bbox) {
      expect(bbox.x + bbox.width / 2).toBeCloseTo(-3, 1)
      expect(bbox.y + bbox.height / 2).toBeCloseTo(4, 1)
    } else {
      throw new Error('无法计算边界框')
    }
  })

  it('应该处理没有边界框的路径', () => {
    const path = 'M10,10'
    const result = normalize(path)

    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
  })

  it('应该正确处理相对路径命令', () => {
    const path = 'm10,10 l10,10'
    const result = normalize(path)

    expect(result).toMatch(/^[MLHVCSQTAZ\s\d.,-]+$/)
  })

  it('应该处理复杂的路径', () => {
    const path = 'M10,10 C20,20 30,30 40,40 Q50,50 60,60'
    const result = normalize(path)

    expect(result).toMatch(/^[MLHVCSQTAZ\s\d.,-]+$/)
  })
})
