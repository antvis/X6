import { describe, expect, it } from 'vitest'
import { Point } from '../../../src/geometry'
import {
  radial,
  radialOriented,
} from '../../../src/registry/port-label-layout/radial'

describe('radial port label layout', () => {
  const elemBBox = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    getCenter: () => new Point(50, 50),
  }

  describe('radial layout', () => {
    it('should position label correctly for right side port', () => {
      const portPosition = new Point(100, 50) // 右侧中点
      const result = radial(portPosition, elemBBox as any, { offset: 20 })

      expect(result.position).toEqual({ x: 20, y: 0 })
      expect(result.angle).toBe(0)
      expect(result.attrs['.']['text-anchor']).toBe('start')
    })

    it('should position label correctly for left side port', () => {
      const portPosition = new Point(0, 50) // 左侧中点
      const result = radial(portPosition, elemBBox as any, { offset: 20 })

      expect(result.position.x).toBeCloseTo(-20)
      expect(result.position.y).toBeCloseTo(0)
      expect(result.angle).toBe(0)
      expect(result.attrs['.']['text-anchor']).toBe('end')
    })

    it('should position label correctly for top side port', () => {
      const portPosition = new Point(50, 0) // 顶部中点
      const result = radial(portPosition, elemBBox as any, { offset: 20 })

      expect(result.position.x).toBeCloseTo(0)
      expect(result.position.y).toBeCloseTo(-20)
      expect(result.angle).toBe(0)
      expect(result.attrs['.']['text-anchor']).toBe('middle')
      expect(result.attrs['.'].y).toBe('0em')
    })

    it('should position label correctly for bottom side port', () => {
      const portPosition = new Point(50, 100) // 底部中点
      const result = radial(portPosition, elemBBox as any, { offset: 20 })

      expect(result.position.x).toBeCloseTo(0)
      expect(result.position.y).toBeCloseTo(20)
      expect(result.angle).toBe(0)
      expect(result.attrs['.']['text-anchor']).toBe('middle')
      expect(result.attrs['.'].y).toBe('.3em')
    })

    it('should use custom offset value', () => {
      const portPosition = new Point(100, 50)
      const result = radial(portPosition, elemBBox as any, { offset: 30 })

      expect(result.position).toEqual({ x: 30, y: 0 })
    })

    it('should use default offset when not provided', () => {
      const portPosition = new Point(100, 50)
      const result = radial(portPosition, elemBBox as any, {})

      expect(result.position).toEqual({ x: 20, y: 0 })
    })
  })

  describe('radialOriented layout', () => {
    it('should auto orient label for right side port', () => {
      const portPosition = new Point(100, 50)
      const result = radialOriented(portPosition, elemBBox as any, {
        offset: 20,
      })

      expect(result.position).toEqual({ x: 20, y: 0 })
      expect(result.angle).toBe(-360)
      expect(result.attrs['.']['text-anchor']).toBe('start')
    })

    it('should auto orient label for left side port', () => {
      const portPosition = new Point(0, 50)
      const result = radialOriented(portPosition, elemBBox as any, {
        offset: 20,
      })

      expect(result.position.x).toBeCloseTo(-20)
      expect(result.position.y).toBeCloseTo(0)
      expect(result.angle).toBeCloseTo(0)
      expect(result.attrs['.']['text-anchor']).toBe('end')
    })

    it('should auto orient label for top side port', () => {
      const portPosition = new Point(50, 0)
      const result = radialOriented(portPosition, elemBBox as any, {
        offset: 20,
      })

      expect(result.position.x).toBeCloseTo(0)
      expect(result.position.y).toBeCloseTo(-20)
      expect(result.angle).toBeCloseTo(-270)
      expect(result.attrs['.']['text-anchor']).toBe('end')
    })

    it('should auto orient label for bottom side port', () => {
      const portPosition = new Point(50, 100)
      const result = radialOriented(portPosition, elemBBox as any, {
        offset: 20,
      })

      expect(result.position.x).toBeCloseTo(0)
      expect(result.position.y).toBeCloseTo(20)
      expect(result.angle).toBeCloseTo(-90)
      expect(result.attrs['.']['text-anchor']).toBe('end')
    })

    it('should handle diagonal positions correctly', () => {
      const portPosition = new Point(100, 25) // 右上角附近
      const result = radialOriented(portPosition, elemBBox as any, {
        offset: 20,
      })

      expect(result.angle).toBeLessThan(0)
      expect(result.attrs['.']['text-anchor']).toBe('start')
    })
  })
})
