import { describe, expect, it } from 'vitest'
import { Rectangle } from '../../../src/geometry'
import {
  normalizePoint,
  toResult,
} from '../../../src/registry/port-layout/util'

describe('port-layout util', () => {
  describe('normalizePoint', () => {
    const bbox = new Rectangle(0, 0, 100, 200)

    it('should normalize absolute values', () => {
      const result = normalizePoint(bbox, { x: 30, y: 50 })
      expect(result.x).toBe(30)
      expect(result.y).toBe(50)
    })

    it('should normalize percentage values', () => {
      const result = normalizePoint(bbox, { x: '50%', y: '25%' })
      expect(result.x).toBe(50)
      expect(result.y).toBe(50)
    })

    it('should handle mixed absolute and percentage values', () => {
      const result = normalizePoint(bbox, { x: 20, y: '10%' })
      expect(result.x).toBe(20)
      expect(result.y).toBe(20)
    })

    it('should handle undefined values', () => {
      const result = normalizePoint(bbox, {})
      expect(result.x).toBe(0)
      expect(result.y).toBe(0)
    })

    it('should handle partial undefined values', () => {
      const result = normalizePoint(bbox, { x: 40 })
      expect(result.x).toBe(40)
      expect(result.y).toBe(0)
    })
  })

  describe('toResult', () => {
    it('should handle Point object', () => {
      const point = { x: 15, y: 25, toJSON: () => ({ x: 15, y: 25 }) }
      const result = toResult(point, 180)

      expect(result).toEqual({
        angle: 180,
        position: { x: 15, y: 25 },
      })
    })
  })
})
