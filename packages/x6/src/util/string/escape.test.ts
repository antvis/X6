import { escape, unescape } from './escape'

describe('string', () => {
  let escaped = '&amp;&lt;&gt;&quot;&#39;/'
  let unescaped = '&<>"\'/'

  escaped += escaped
  unescaped += unescaped

  describe('#escape', () => {
    it('should escape values', () => {
      expect(escape(unescaped)).toEqual(escaped)
    })

    it('should handle strings with nothing to escape', () => {
      expect(escape('abc')).toEqual('abc')
    })

    it('should escape the same characters unescaped by `unescape`', () => {
      expect(escape(unescape(escaped))).toEqual(escaped)
    })

    const chars: string[] = ['`', '/']
    chars.forEach(chr => {
      it(`should not escape the ${chr} character`, () => {
        expect(escape(chr)).toEqual(chr)
      })
    })
  })

  describe('#unescape', () => {
    it('should unescape entities in order', () => {
      expect(unescape('&amp;lt;')).toEqual('&lt;')
    })

    it('should unescape the proper entities', () => {
      expect(unescape(escaped)).toEqual(unescaped)
    })

    it('should handle strings with nothing to unescape', () => {
      expect(unescape('abc')).toEqual('abc')
    })

    it('should unescape the same characters escaped by `escape`', () => {
      expect(unescape(escape(unescaped))).toEqual(unescaped)
    })

    const entities = ['&#96;', '&#x2F;']
    entities.forEach(entity => {
      it(`should not unescape the ${entity} entity`, () => {
        expect(unescape(entity)).toEqual(entity)
      })
    })
  })
})
