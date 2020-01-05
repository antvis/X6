import { NumberExt } from '.'

describe('number', () => {
  describe('#mod', () => {
    it('should work with positive numbers', () => {
      expect(NumberExt.mod(12, 5)).toEqual(2)
    })

    it('should work with negative numbers', () => {
      expect(NumberExt.mod(-12, 5)).toEqual(3)
      expect(NumberExt.mod(12, -5)).toEqual(-3)
      expect(NumberExt.mod(-12, -5)).toEqual(-2)
    })
  })

  describe('#clamp', () => {
    it('should clamp negative numbers', () => {
      expect(NumberExt.clamp(-10, -5, 5)).toEqual(-5)
      expect(NumberExt.clamp(-10.2, -5.5, 5.5)).toEqual(-5.5)
      expect(NumberExt.clamp(-Infinity, -5, 5)).toEqual(-5)
    })

    it('should clamp positive numbers', () => {
      expect(NumberExt.clamp(10, -5, 5)).toEqual(5)
      expect(NumberExt.clamp(10.6, -5.6, 5.4)).toEqual(5.4)
      expect(NumberExt.clamp(Infinity, -5, 5)).toEqual(5)
    })

    it('should not alter negative numbers in range', () => {
      expect(NumberExt.clamp(-4, -5, 5)).toEqual(-4)
      expect(NumberExt.clamp(-5, -5, 5)).toEqual(-5)
      expect(NumberExt.clamp(-5.5, -5.6, 5.6)).toEqual(-5.5)
    })

    it('should not alter positive numbers in range', () => {
      expect(NumberExt.clamp(4, -5, 5)).toEqual(4)
      expect(NumberExt.clamp(5, -5, 5)).toEqual(5)
      expect(NumberExt.clamp(4.5, -5.1, 5.2)).toEqual(4.5)
    })

    it('should not alter `0` in range', () => {
      expect(1 / NumberExt.clamp(0, -5, 5)).toEqual(Infinity)
    })

    it('should clamp to `0`', () => {
      expect(1 / NumberExt.clamp(-10, 0, 5)).toEqual(Infinity)
    })

    it('should not alter `-0` in range', () => {
      expect(1 / NumberExt.clamp(-0, -5, 5)).toEqual(-Infinity)
    })

    it('should clamp to `-0`', () => {
      expect(1 / NumberExt.clamp(-10, -0, 5)).toEqual(-Infinity)
    })

    it('should return `NaN` when `number` is `NaN`', () => {
      expect(NumberExt.clamp(NaN, -5, 5)).toBeNaN()
    })

    it('should coerce `min` and `max` of `NaN` to `0`', () => {
      expect(NumberExt.clamp(1, -5, NaN)).toEqual(0)
      expect(NumberExt.clamp(-1, NaN, 5)).toEqual(0)
    })
  })

  describe('#inRange', () => {
    it('should work with a `start` and `end`', () => {
      expect(NumberExt.inRange(1, 1, 5)).toBe(true)
      expect(NumberExt.inRange(3, 1, 5)).toBe(true)
      expect(NumberExt.inRange(5, 1, 5)).toBe(true)
      expect(NumberExt.inRange(0, 1, 5)).toBe(false)
    })
  })
})
