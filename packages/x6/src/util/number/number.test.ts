import { NumberExt } from '.'

describe('NumberExt', () => {
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

  describe('#random', () => {
    it('should return random number between lower and upper', () => {
      const rnd = NumberExt.random(2, 5)
      expect(rnd).toBeGreaterThanOrEqual(2)
      expect(rnd).toBeLessThanOrEqual(5)
    })

    it('should automatically reverses the order of parameters', () => {
      const rnd = NumberExt.random(5, 2)
      expect(rnd).toBeGreaterThanOrEqual(2)
      expect(rnd).toBeLessThanOrEqual(5)
    })
  })

  describe('#parseCssNumeric', () => {
    it('should work with valid params', () => {
      expect(NumberExt.parseCssNumeric('12px')).toEqual({
        unit: 'px',
        value: 12,
      })

      expect(NumberExt.parseCssNumeric('12px', ['px'])).toEqual({
        unit: 'px',
        value: 12,
      })

      expect(NumberExt.parseCssNumeric('12px', 'px')).toEqual({
        unit: 'px',
        value: 12,
      })
    })

    it('should return null with invalid params', () => {
      expect(NumberExt.parseCssNumeric('abc')).toBe(null)
      expect(NumberExt.parseCssNumeric('12px', [])).toBe(null)
    })
  })

  describe('#normalizePercentage', () => {
    it('should return 0 when input is invalid', () => {
      expect(NumberExt.normalizePercentage(null, 1)).toBe(0)
      expect(NumberExt.normalizePercentage(Infinity, 1)).toBe(0)
    })

    it('should work with valid input', () => {
      expect(NumberExt.normalizePercentage('500%', 1)).toBe(5)
      expect(NumberExt.normalizePercentage(0.1, 10)).toBe(1)
    })
  })

  describe('#normalizeSides', () => {
    it('should return the same property', () => {
      expect(NumberExt.normalizeSides(10)).toEqual({
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
      })
    })

    it('should work with object', () => {
      let slides: any = {
        left: 0,
        right: 10,
        top: 20,
        bottom: 30,
      }
      expect(NumberExt.normalizeSides(slides)).toEqual(slides)
      slides = {
        left: 0,
        right: 10,
        vertical: 20,
      }
      expect(NumberExt.normalizeSides(slides)).toEqual({
        left: 0,
        right: 10,
        top: 20,
        bottom: 20,
      })
      slides = {
        horizontal: 30,
        vertical: 20,
      }
      expect(NumberExt.normalizeSides(slides)).toEqual({
        left: 30,
        right: 30,
        top: 20,
        bottom: 20,
      })
    })
  })
})
