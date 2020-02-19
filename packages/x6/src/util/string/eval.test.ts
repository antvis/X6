import { exec } from './eval'

describe('string', () => {
  describe('#eval', () => {
    it('should eval string expressions', () => {
      expect(exec<number>('1 + 1')).toBe(2)
      expect(exec<string>('"a" + "b"')).toBe('ab')
    })

    it('should return null with invalid expression', () => {
      expect(exec('1 +')).toBe(null)
    })
  })
})
