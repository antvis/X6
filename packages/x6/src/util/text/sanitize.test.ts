import { sanitize } from './sanitize'

describe('Text', () => {
  describe('#sanitize', () => {
    it('should sanitize text', () => {
      expect(sanitize('hell o')).toBe('hell\u00A0o')
    })
  })
})
