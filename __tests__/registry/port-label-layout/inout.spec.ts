import { describe, expect, it } from 'vitest'
import { Point, Rectangle } from '../../../src/geometry'
import {
  inside,
  insideOriented,
  outside,
  outsideOriented,
} from '../../../src/registry/port-label-layout/inout'

describe('Port Label Layout - InOut', () => {
  // 测试用的矩形和点
  const testBBox = new Rectangle(0, 0, 100, 100)

  describe('outside layout', () => {
    it('应该在右侧端口位置正确布局', () => {
      const portPosition = new Point(120, 50) // 右侧
      const result = outside(portPosition, testBBox, {})

      expect(result.position.x).toBe(15) // 默认偏移量
      expect(result.position.y).toBe(0)
      expect(result.angle).toBe(0)
      expect(result.attrs['.']['text-anchor']).toBe('start')
    })

    it('应该在顶部端口位置正确布局', () => {
      const portPosition = new Point(50, -20) // 顶部
      const result = outside(portPosition, testBBox, {})

      expect(result.position.x).toBe(0)
      expect(result.position.y).toBe(-15)
      expect(result.angle).toBe(0)
      expect(result.attrs['.']['text-anchor']).toBe('middle')
    })

    it('应该支持自定义偏移量', () => {
      const portPosition = new Point(120, 50)
      const result = outside(portPosition, testBBox, { offset: 20 })

      expect(result.position.x).toBe(20)
      expect(result.position.y).toBe(0)
    })
  })

  describe('outsideOriented layout', () => {
    it('应该在顶部端口位置自动旋转', () => {
      const portPosition = new Point(50, -20) // 顶部
      const result = outsideOriented(portPosition, testBBox, {})

      expect(result.angle).toBe(-90)
      expect(result.attrs['.']['text-anchor']).toBe('start')
    })

    it('应该在底部端口位置自动旋转', () => {
      const portPosition = new Point(50, 120) // 底部
      const result = outsideOriented(portPosition, testBBox, {})

      expect(result.angle).toBe(90)
      expect(result.attrs['.']['text-anchor']).toBe('start')
    })
  })

  describe('inside layout', () => {
    it('应该在右侧端口位置正确布局', () => {
      const portPosition = new Point(120, 50) // 右侧
      const result = inside(portPosition, testBBox, {})

      expect(result.position.x).toBe(-15) // 默认偏移量，向内
      expect(result.position.y).toBe(0)
      expect(result.angle).toBe(0)
      expect(result.attrs['.']['text-anchor']).toBe('end')
    })

    it('应该在顶部端口位置正确布局', () => {
      const portPosition = new Point(50, -20) // 顶部
      const result = inside(portPosition, testBBox, {})

      expect(result.position.x).toBe(0)
      expect(result.position.y).toBe(15) // 向内
      expect(result.angle).toBe(0)
      expect(result.attrs['.']['text-anchor']).toBe('middle')
    })
  })

  describe('insideOriented layout', () => {
    it('应该在顶部端口位置自动旋转', () => {
      const portPosition = new Point(50, -20) // 顶部
      const result = insideOriented(portPosition, testBBox, {})

      expect(result.angle).toBe(90)
      expect(result.attrs['.']['text-anchor']).toBe('start')
    })

    it('应该在底部端口位置自动旋转', () => {
      const portPosition = new Point(50, 120) // 底部
      const result = insideOriented(portPosition, testBBox, {})

      expect(result.angle).toBe(-90)
      expect(result.attrs['.']['text-anchor']).toBe('start')
    })
  })

  // 边界情况测试
  describe('边界情况', () => {
    it('应该处理精确的角度边界', () => {
      // 测试45度边界
      const portPosition = new Point(150, 50) // 精确的0度
      const result = outside(portPosition, testBBox, {})

      expect(result.attrs['.']['text-anchor']).toBe('start')
    })

    it('应该处理负坐标', () => {
      const portPosition = new Point(-20, 50) // 左侧
      const result = outside(portPosition, testBBox, {})

      expect(result.position.x).toBe(-15)
      expect(result.position.y).toBe(0)
      expect(result.attrs['.']['text-anchor']).toBe('end')
    })
  })
})
