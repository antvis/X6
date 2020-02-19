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
})
