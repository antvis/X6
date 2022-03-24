import { Text } from '../../src/text'

describe('Text', () => {
  describe('#sanitize', () => {
    it('should sanitize text', () => {
      expect(Text.sanitize('hell o')).toBe('hell\u00A0o')
    })
  })
})
