import { describe, expect, it } from 'vitest'
import { Line, Point } from '../../../src/geometry'
import type { AnchorOptions } from '../../../src/registry/connection-point/anchor'
import { anchor } from '../../../src/registry/connection-point/anchor'

type Align = 'top' | 'right' | 'bottom' | 'left'

function alignLine(line: Line, type: Align, offset = 0) {
  const { start, end } = line
  let a
  let b
  let direction
  let coordinate: 'x' | 'y'

  switch (type) {
    case 'left':
      coordinate = 'x'
      a = end
      b = start
      direction = -1
      break
    case 'right':
      coordinate = 'x'
      a = start
      b = end
      direction = 1
      break
    case 'top':
      coordinate = 'y'
      a = end
      b = start
      direction = -1
      break
    case 'bottom':
      coordinate = 'y'
      a = start
      b = end
      direction = 1
      break
    default:
      return
  }

  if (start[coordinate] < end[coordinate]) {
    a[coordinate] = b[coordinate]
  } else {
    b[coordinate] = a[coordinate]
  }

  if (Number.isFinite(offset)) {
    a[coordinate] += direction * offset
    b[coordinate] += direction * offset
  }
}

describe('anchor connection point', () => {
  describe('alignLine', () => {
    it('should align line to left', () => {
      const line = new Line(new Point(10, 10), new Point(20, 30))
      alignLine(line, 'left')

      expect(line.start.x).toBe(10)
      expect(line.start.y).toBe(10)
      expect(line.end.x).toBe(10)
      expect(line.end.y).toBe(30)
    })

    it('should align line to right', () => {
      const line = new Line(new Point(10, 10), new Point(20, 30))
      alignLine(line, 'right')

      expect(line.start.x).toBe(20)
      expect(line.start.y).toBe(10)
      expect(line.end.x).toBe(20)
      expect(line.end.y).toBe(30)
    })

    it('should align line to top', () => {
      const line = new Line(new Point(10, 10), new Point(20, 30))
      alignLine(line, 'top')

      expect(line.start.x).toBe(10)
      expect(line.start.y).toBe(10)
      expect(line.end.x).toBe(20)
      expect(line.end.y).toBe(10)
    })

    it('should align line to bottom', () => {
      const line = new Line(new Point(10, 10), new Point(20, 30))
      alignLine(line, 'bottom')

      expect(line.start.x).toBe(10)
      expect(line.start.y).toBe(30)
      expect(line.end.x).toBe(20)
      expect(line.end.y).toBe(30)
    })

    it('should apply offset when aligning', () => {
      const line = new Line(new Point(10, 10), new Point(20, 30))
      alignLine(line, 'left', 5)

      expect(line.start.x).toBe(5)
      expect(line.start.y).toBe(10)
      expect(line.end.x).toBe(5)
      expect(line.end.y).toBe(30)
    })
  })

  describe('anchor function', () => {
    const mockView = {} as any
    const mockMagnet = {} as any

    it('should return point without alignment', () => {
      const line = new Line(new Point(0, 0), new Point(100, 100))
      const options: AnchorOptions = { offset: 10 }

      const result = anchor(line, mockView, mockMagnet, options)

      expect(result).toBeInstanceOf(Point)
      expect(result.x).toBeCloseTo(92.92893218813452, 1)
      expect(result.y).toBeCloseTo(92.92893218813452, 1)
    })

    it('should align to left and apply offset', () => {
      const line = new Line(new Point(50, 50), new Point(150, 150))
      const options: AnchorOptions = {
        align: 'left',
        alignOffset: 5,
        offset: 10,
      }

      const result = anchor(line, mockView, mockMagnet, options)

      // 先对齐到左边，然后应用偏移
      expect(result.x).toBeCloseTo(45, 1) // 对齐后的x坐标减去偏移
      expect(result.y).toBeCloseTo(140, 1)
    })

    it('should align to right and apply offset', () => {
      const line = new Line(new Point(50, 50), new Point(150, 150))
      const options: AnchorOptions = {
        align: 'right',
        alignOffset: 5,
        offset: 10,
      }

      const result = anchor(line, mockView, mockMagnet, options)

      expect(result.x).toBeCloseTo(155, 1) // 对齐后的x坐标加上偏移
      expect(result.y).toBeCloseTo(140, 1)
    })

    it('should handle zero offset', () => {
      const line = new Line(new Point(0, 0), new Point(100, 100))
      const options: AnchorOptions = { offset: 0 }

      const result = anchor(line, mockView, mockMagnet, options)

      expect(result).toBeInstanceOf(Point)
      expect(result.equals(line.end)).toBe(true)
    })

    it('should handle undefined offset', () => {
      const line = new Line(new Point(0, 0), new Point(100, 100))
      const options: AnchorOptions = {}

      const result = anchor(line, mockView, mockMagnet, options)

      expect(result).toBeInstanceOf(Point)
      expect(result.equals(line.end)).toBe(true)
    })
  })
})
