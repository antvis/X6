import { describe, expect, it } from 'vitest'
import { Rectangle } from '../../../src/geometry'
import {
  bottom,
  left,
  line,
  right,
  top,
} from '../../../src/registry/port-layout/line'

describe('Port Layout - Line', () => {
  const elemBBox = new Rectangle(0, 0, 100, 100)

  describe('line layout', () => {
    it('should layout ports along a line with default start and end', () => {
      const portsArgs = [{}, {}, {}]
      const groupArgs = {}

      const result = line(portsArgs, elemBBox, groupArgs)

      expect(result).toHaveLength(3)
      expect(result[0].position.x).toBeCloseTo(17)
      expect(result[0].position.y).toBeCloseTo(17)
      expect(result[1].position.x).toBeCloseTo(50)
      expect(result[1].position.y).toBeCloseTo(50)
      expect(result[2].position.x).toBeCloseTo(83)
      expect(result[2].position.y).toBeCloseTo(83)
    })

    it('should layout ports along a custom line', () => {
      const portsArgs = [{}, {}, {}]
      const groupArgs = {
        start: { x: 10, y: 10 },
        end: { x: 90, y: 90 },
      }

      const result = line(portsArgs, elemBBox, groupArgs)

      expect(result).toHaveLength(3)
      expect(result[0].position.x).toBeCloseTo(23)
      expect(result[0].position.y).toBeCloseTo(23)
      expect(result[1].position.x).toBeCloseTo(50)
      expect(result[1].position.y).toBeCloseTo(50)
      expect(result[2].position.x).toBeCloseTo(77)
      expect(result[2].position.y).toBeCloseTo(77)
    })

    it('should handle strict mode', () => {
      const portsArgs = [{}, {}]
      const groupArgs = { strict: true }

      const result = line(portsArgs, elemBBox, groupArgs)

      expect(result).toHaveLength(2)
      expect(result[0].position.x).toBeCloseTo(33)
      expect(result[0].position.y).toBeCloseTo(33)
      expect(result[1].position.x).toBeCloseTo(67)
      expect(result[1].position.y).toBeCloseTo(67)
    })
  })

  describe('side layouts', () => {
    it('should layout ports on left side', () => {
      const portsArgs = [{}, {}, {}]
      const result = left(portsArgs, elemBBox, {})

      expect(result).toHaveLength(3)
      expect(result[0].position.x).toBe(0)
      expect(result[0].position.y).toBeCloseTo(17)
      expect(result[1].position.x).toBe(0)
      expect(result[1].position.y).toBeCloseTo(50)
      expect(result[2].position.x).toBe(0)
      expect(result[2].position.y).toBeCloseTo(83)
    })

    it('should layout ports on right side', () => {
      const portsArgs = [{}, {}, {}]
      const result = right(portsArgs, elemBBox, {})

      expect(result).toHaveLength(3)
      expect(result[0].position.x).toBe(100)
      expect(result[0].position.y).toBeCloseTo(17)
      expect(result[1].position.x).toBe(100)
      expect(result[1].position.y).toBeCloseTo(50)
      expect(result[2].position.x).toBe(100)
      expect(result[2].position.y).toBeCloseTo(83)
    })

    it('should layout ports on top side', () => {
      const portsArgs = [{}, {}, {}]
      const result = top(portsArgs, elemBBox, {})

      expect(result).toHaveLength(3)
      expect(result[0].position.x).toBeCloseTo(17)
      expect(result[0].position.y).toBe(0)
      expect(result[1].position.x).toBeCloseTo(50)
      expect(result[1].position.y).toBe(0)
      expect(result[2].position.x).toBeCloseTo(83)
      expect(result[2].position.y).toBe(0)
    })

    it('should layout ports on bottom side', () => {
      const portsArgs = [{}, {}, {}]
      const result = bottom(portsArgs, elemBBox, {})

      expect(result).toHaveLength(3)
      expect(result[0].position.x).toBeCloseTo(17)
      expect(result[0].position.y).toBe(100)
      expect(result[1].position.x).toBeCloseTo(50)
      expect(result[1].position.y).toBe(100)
      expect(result[2].position.x).toBeCloseTo(83)
      expect(result[2].position.y).toBe(100)
    })

    it('should handle offset in port arguments', () => {
      const portsArgs = [
        { dx: 5, dy: 10 },
        { dx: -5, dy: -10 },
      ]
      const result = left(portsArgs, elemBBox, {})

      expect(result).toHaveLength(2)
      expect(result[0].position.x).toBe(5)
      expect(result[0].position.y).toBeCloseTo(35)
      expect(result[1].position.x).toBe(-5)
      expect(result[1].position.y).toBeCloseTo(65)
    })

    it('should handle strict mode with offset', () => {
      const portsArgs = [
        { dx: 5, dy: 10 },
        { dx: -5, dy: -10 },
      ]
      const groupArgs = { strict: true }
      const result = left(portsArgs, elemBBox, groupArgs)

      expect(result).toHaveLength(2)
      expect(result[0].position.x).toBe(5)
      expect(result[0].position.y).toBeCloseTo(43)
      expect(result[1].position.x).toBe(-5)
      expect(result[1].position.y).toBeCloseTo(57)
    })
  })

  describe('edge cases', () => {
    it('should handle empty ports array', () => {
      const result = line([], elemBBox, {})
      expect(result).toHaveLength(0)
    })

    it('should handle single port', () => {
      const result = line([{}], elemBBox, {})
      expect(result).toHaveLength(1)
      expect(result[0].position.x).toBeCloseTo(50)
      expect(result[0].position.y).toBeCloseTo(50)
    })

    it('should handle single port with strict mode', () => {
      const result = line([{}], elemBBox, { strict: true })
      expect(result).toHaveLength(1)
      expect(result[0].position.x).toBeCloseTo(50)
      expect(result[0].position.y).toBeCloseTo(50)
    })
  })
})
