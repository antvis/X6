import { sanitizeHTML } from './html'

describe('String', () => {
  describe('html', () => {
    it('should removes attribute name starts with on', () => {
      const html = '<div onerror="onError()"></div>'
      expect(sanitizeHTML(html)).toBe('<div></div>')
    })

    it('should removes attribute value starts with some word', () => {
      let html = '<div script="javascript:void"></div>'
      expect(sanitizeHTML(html)).toBe('<div></div>')

      html = '<div data="data:void"></div>'
      expect(sanitizeHTML(html)).toBe('<div></div>')

      html = '<div vbscript="vbscript:void"></div>'
      expect(sanitizeHTML(html)).toBe('<div></div>')
    })
  })
})
