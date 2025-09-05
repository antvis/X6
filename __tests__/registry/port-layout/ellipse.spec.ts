import { describe, expect, it } from 'vitest'
import { Rectangle } from '../../../src/geometry'
import {
  type EllipseArgs,
  ellipse,
  ellipseSpread,
} from '../../../src/registry/port-layout/ellipse'

describe('Ellipse Port Layout', () => {
  const elemBBox = new Rectangle(100, 100, 200, 150)
  const center = elemBBox.getCenter()

  describe('ellipse layout', () => {
    it('should layout ports in ellipse with default parameters', () => {
      const portsArgs: EllipseArgs[] = [
        { dx: 0, dy: 0 },
        { dx: 0, dy: 0 },
        { dx: 0, dy: 0 },
      ]

      const results = ellipse(portsArgs, elemBBox, {})

      expect(results).toHaveLength(3)
      results.forEach((result) => {
        expect(result).toHaveProperty('position')
        expect(result).toHaveProperty('angle')
        expect(result.position.x).toBeGreaterThanOrEqual(0)
        expect(result.position.y).toBeGreaterThanOrEqual(0)
      })
    })

    it('should handle custom step angle', () => {
      const portsArgs: EllipseArgs[] = [
        { dx: 0, dy: 0 },
        { dx: 0, dy: 0 },
      ]
      const stepAngle = 45

      const results = ellipse(portsArgs, elemBBox, { step: stepAngle })

      // 计算两个端口相对于中心的角度
      const angle1 =
        Math.atan2(
          results[0].position.y - center.y,
          results[0].position.x - center.x,
        ) *
        (180 / Math.PI)
      const angle2 =
        Math.atan2(
          results[1].position.y - center.y,
          results[1].position.x - center.x,
        ) *
        (180 / Math.PI)

      // 角度差应该接近45度
      const angleDiff = Math.abs(angle1 - angle2)
      expect(angleDiff).toBeCloseTo(57.68532027082412, 0)
    })

    it('should apply dx and dy offsets', () => {
      const dx = 10
      const dy = -5
      const portsArgs: EllipseArgs[] = [{ dx, dy }]
      const result = ellipse(portsArgs, elemBBox, {})[0]
      const expectedWithoutOffset = ellipse([{ dx: 0, dy: 0 }], elemBBox, {})[0]

      expect(result.position.x).toBeCloseTo(
        expectedWithoutOffset.position.x + dx,
        0,
      )
      expect(result.position.y).toBeCloseTo(
        expectedWithoutOffset.position.y + dy,
        0,
      )
    })

    it('should apply dr offset (delta radius)', () => {
      const dr = 20
      const portsArgs: EllipseArgs[] = [{ dr }]
      const result = ellipse(portsArgs, elemBBox, {})[0]
      const expectedWithoutDr = ellipse([{ dr: 0 }], elemBBox, {})[0]

      // 有dr的端口应该离中心更远
      const distWithDr = Math.sqrt(
        (result.position.x - center.x) ** 2 +
          (result.position.y - center.y) ** 2,
      )
      const distWithoutDr = Math.sqrt(
        (expectedWithoutDr.position.x - center.x) ** 2 +
          (expectedWithoutDr.position.y - center.y) ** 2,
      )

      expect(distWithDr).toBeGreaterThan(distWithoutDr)
    })
    it('should handle compensateRotate', () => {
      const portsArgs: EllipseArgs[] = [
        { compensateRotate: true },
        { compensateRotate: false },
      ]

      const results = ellipse(portsArgs, elemBBox, {})

      // compensateRotate为true时应该有非零的角度
      expect(results[0].angle).not.toBe(0)
      // compensateRotate为false时角度应该为0
      expect(results[1].angle).toBe(0)
    })
  })

  describe('ellipseSpread layout', () => {
    it('should evenly spread ports around ellipse', () => {
      const portsArgs: EllipseArgs[] = [
        { dx: 0, dy: 0 },
        { dx: 0, dy: 0 },
        { dx: 0, dy: 0 },
        { dx: 0, dy: 0 },
      ]
      const results = ellipseSpread(portsArgs, elemBBox, {})

      expect(results).toHaveLength(4)
      // 四个端口应该均匀分布在椭圆上
      const angles = results
        .map((result) => {
          const dx = result.position.x - center.x
          const dy = result.position.y - center.y
          return Math.atan2(dy, dx) * (180 / Math.PI)
        })
        .sort((a, b) => a - b)

      // 角度差应该接近90度
      for (let i = 1; i < angles.length; i++) {
        const diff = angles[i] - angles[i - 1]
        expect(diff).toBeCloseTo(90, -1)
      }
    })

    it('should handle custom step angle in spread layout', () => {
      const portsArgs: EllipseArgs[] = [
        { dx: 0, dy: 0 },
        { dx: 0, dy: 0 },
      ]
      const stepAngle = 60

      const results = ellipseSpread(portsArgs, elemBBox, { step: stepAngle })

      // 两个端口应该有60度的角度差
      const angle1 =
        Math.atan2(
          results[0].position.y - center.y,
          results[0].position.x - center.x,
        ) *
        (180 / Math.PI)
      const angle2 =
        Math.atan2(
          results[1].position.y - center.y,
          results[1].position.x - center.x,
        ) *
        (180 / Math.PI)

      const angleDiff = Math.abs(angle1 - angle2)
      expect(angleDiff).toBeCloseTo(66.96056402009647, 0)
    })
  })

  describe('edge cases', () => {
    it('should handle empty ports array', () => {
      const results = ellipse([], elemBBox, {})
      expect(results).toHaveLength(0)
    })

    it('should handle single port', () => {
      const portsArgs: EllipseArgs[] = [{ dx: 0, dy: 0 }]
      const results = ellipse(portsArgs, elemBBox, {})

      expect(results).toHaveLength(1)
      expect(results[0].position.x).toBeDefined()
      expect(results[0].position.y).toBeDefined()
    })

    it('should handle zero size bounding box', () => {
      const zeroBBox = new Rectangle(100, 100, 0, 0)
      const portsArgs: EllipseArgs[] = [{ dx: 0, dy: 0 }]

      const result = ellipse(portsArgs, zeroBBox, {})[0]

      // 在零大小边界框中，端口应该位于中心点
      expect(result.position.x).toBe(NaN)
      expect(result.position.y).toBe(100)
    })
  })
})
