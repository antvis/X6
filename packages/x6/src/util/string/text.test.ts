import { sanitizeText } from './text'

describe('StringExt', () => {
  describe('#sanitizeText', () => {
    it('should sanitize text', () => {
      expect(sanitizeText('hell o')).toBe('hell\u00A0o')
    })
  })
})
