import {
  toString,
  ucFirst,
  lcFirst,
  startWith,
  endWith,
  split,
  sanitizeText,
} from './format'

describe('string', () => {
  describe('#toString', () => {
    it('should convert any type to string', () => {
      expect(toString(null)).toBe('null')
      expect(toString(undefined)).toBe('undefined')
      expect(toString({ a: 1 })).toBe('[object Object]')
      expect(toString(1)).toBe('1')
      expect(toString(true)).toBe('true')
      expect(toString('a')).toBe('a')
      expect(toString(/x/)).toBe('/x/')
      const arr = [1, 2, 3]
      expect(toString(arr)).toBe(arr.toString())
      const data = new Date()
      expect(toString(data)).toBe(data.toString())
      const err = new Error()
      expect(toString(err)).toBe('Error')
    })
  })

  describe('#ucFirst', () => {
    it('shoule work with ascii', () => {
      expect(ucFirst('hello')).toBe('Hello')
      expect(ucFirst('Hello')).toBe('Hello')
    })

    it('shoule work with unicode', () => {
      expect(ucFirst('éllo')).toBe('Éllo')
      expect(ucFirst('Éllo')).toBe('Éllo')
    })

    it('shoule do nothing with empty string', () => {
      expect(ucFirst('')).toBe('')
    })
  })

  describe('#lcFirst', () => {
    it('shoule work with ascii', () => {
      expect(lcFirst('hello')).toBe('hello')
      expect(lcFirst('Hello')).toBe('hello')
    })

    it('shoule work with unicode', () => {
      expect(lcFirst('éllo')).toBe('éllo')
      expect(lcFirst('Éllo')).toBe('éllo')
    })

    it('shoule do nothing with empty string', () => {
      expect(lcFirst('')).toBe('')
    })
  })

  describe('#startWith', () => {
    it('shoud return true when start with character, string or empty string', () => {
      expect(startWith('hello', 'h')).toBe(true)
      expect(startWith('hello', 'he')).toBe(true)
      expect(startWith('hello', 'hello')).toBe(true)
      expect(startWith('hello', '')).toBe(true)
    })
  })

  describe('#endWith', () => {
    it('shoud return true when end with character, string or empty string', () => {
      expect(endWith('hello', 'o')).toBe(true)
      expect(endWith('hello', 'lo')).toBe(true)
      expect(endWith('hello', 'hello')).toBe(true)
      expect(endWith('hello', '')).toBe(true)
    })
  })

  describe('#split', () => {
    it('shoule split with character', () => {
      expect(split('h,e,l,l,o', ',')).toEqual(['h', 'e', 'l', 'l', 'o'])
    })

    it('shoule split with string', () => {
      expect(split('hello', 'll')).toEqual(['he', 'o'])
    })

    it('shoule split with regexp', () => {
      expect(split('hello', /[l]+/g)).toEqual(['he', 'o'])
    })

    it('shoule split with empty string', () => {
      expect(split('hello', '')).toEqual(['h', 'e', 'l', 'l', 'o'])
    })
  })

  describe('#sanitizeText', () => {
    expect(sanitizeText('hell o')).toBe('hell\u00A0o')
  })
})
