import { exec } from './eval'

describe('string', () => {
  describe('#hashcode', () => {
    it('should eval string expressions', () => {
      expect(exec('1 + 1')).toBe(2)
      expect(exec('"a" + "b"')).toBe('ab')
    })

    it('should return null with invalid expression', () => {
      expect(exec('1 +')).toBe(null)
    })
  })
})
