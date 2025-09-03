import { describe, expect, it } from 'vitest'
import { resetOffset, xAlign, yAlign } from '../../../src/registry/attr/align'

describe('Align attribute', () => {
  describe('xAlign', () => {
    it('should handle middle alignment', () => {
      const result = xAlign.offset!('middle', {
        refBBox: { x: 100, width: 200, y: 0, height: 0 },
      })
      expect(result).toEqual({ x: -200, y: 0 })
    })

    it('should handle right alignment', () => {
      const result = xAlign.offset!('right', {
        refBBox: { x: 100, width: 200, y: 0, height: 0 },
      })
      expect(result).toEqual({ x: -300, y: 0 })
    })

    it('should handle numeric value', () => {
      const result = xAlign.offset!(50, {
        refBBox: { x: 100, width: 200, y: 0, height: 0 },
      })
      expect(result).toEqual({ x: -50, y: 0 })
    })

    it('should handle percentage value', () => {
      const result = xAlign.offset!('25%', {
        refBBox: { x: 100, width: 200, y: 0, height: 0 },
      })
      expect(result).toEqual({ x: -150, y: 0 })
    })
  })

  describe('yAlign', () => {
    it('should handle middle alignment', () => {
      const result = yAlign.offset!('middle', {
        refBBox: { y: 100, height: 200, x: 0, width: 0 },
      })
      expect(result).toEqual({ x: 0, y: -200 })
    })

    it('should handle bottom alignment', () => {
      const result = yAlign.offset!('bottom', {
        refBBox: { y: 100, height: 200, x: 0, width: 0 },
      })
      expect(result).toEqual({ x: 0, y: -300 })
    })

    it('should handle numeric value', () => {
      const result = yAlign.offset!(50, {
        refBBox: { y: 100, height: 200, x: 0, width: 0 },
      })
      expect(result).toEqual({ x: 0, y: -50 })
    })

    it('should handle percentage value', () => {
      const result = yAlign.offset!('25%', {
        refBBox: { y: 100, height: 200, x: 0, width: 0 },
      })
      expect(result).toEqual({ x: 0, y: -150 })
    })
  })

  describe('resetOffset', () => {
    it('should return negative refBBox when value is truthy', () => {
      const result = resetOffset.offset!(true, { refBBox: { x: 100, y: 200 } })
      expect(result).toEqual({ x: -100, y: -200 })
    })

    it('should return zero when value is falsy', () => {
      const result = resetOffset.offset!(false, { refBBox: { x: 100, y: 200 } })
      expect(result).toEqual({ x: 0, y: 0 })
    })
  })
})
