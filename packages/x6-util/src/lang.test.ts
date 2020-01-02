import {
  isNil,
  isNull,
  isString,
  isNumber,
  isNumeric,
  isBoolean,
  isUndefined,
  isObject,
  isArray,
  isArrayLike,
  isFunction,
  isWindow,
} from './lang'

describe('lang', () => {
  describe('#isNil', () => {
    it('should return `true` for nullish values', () => {
      expect(isNil(null)).toBe(true)
      expect(isNil(undefined)).toBe(true)
    })

    it('should return `false` for non-nullish values', () => {
      expect(isNil({ a: 1 })).toBe(false)
      expect(isNil(1)).toBe(false)
      expect(isNil(true)).toBe(false)
      expect(isNil('a')).toBe(false)
      expect(isNil(/x/)).toBe(false)
      expect(isNil([1, 2, 3])).toBe(false)
      expect(isNil(new Date())).toBe(false)
      expect(isNil(new Error())).toBe(false)
    })
  })

  describe('#isNull', () => {
    it('should return `true` for `null` values', () => {
      expect(isNull(null)).toBe(true)
    })

    it('should return `false` for non `null` values', () => {
      expect(isNull({ a: 1 })).toBe(false)
      expect(isNull(1)).toBe(false)
      expect(isNull(true)).toBe(false)
      expect(isNull('a')).toBe(false)
      expect(isNull(/x/)).toBe(false)
      expect(isNull([1, 2, 3])).toBe(false)
      expect(isNull(new Date())).toBe(false)
      expect(isNull(new Error())).toBe(false)
    })
  })

  describe('#isString', () => {
    it('should return `true` for strings', () => {
      expect(isString('a')).toBe(true)
      expect(isString(Object('a'))).toBe(true)
      expect(isString(String('a'))).toBe(true)
    })

    it('should return `false` for non-strings', () => {
      expect(isString({ a: 1 })).toBe(false)
      expect(isString(1)).toBe(false)
      expect(isString(true)).toBe(false)
      expect(isString(/x/)).toBe(false)
      expect(isString([1, 2, 3])).toBe(false)
      expect(isString(new Date())).toBe(false)
      expect(isString(new Error())).toBe(false)
    })
  })

  describe('#isNumber', () => {
    it('should return `true` for numbers', () => {
      expect(isNumber(0)).toBe(true)
      expect(isNumber(Object(0))).toBe(true)
      expect(isNumber(NaN)).toBe(true)
    })

    it('should return `false` for non-numbers', () => {
      expect(isNumber({ a: 1 })).toBe(false)
      expect(isNumber(true)).toBe(false)
      expect(isNumber('a')).toBe(false)
      expect(isNumber(/x/)).toBe(false)
      expect(isNumber([1, 2, 3])).toBe(false)
      expect(isNumber(new Date())).toBe(false)
      expect(isNumber(new Error())).toBe(false)
    })
  })

  describe('#isNumeric', () => {
    it('should return true with numberic string', () => {
      expect(isNumeric('1')).toBe(true)
      expect(isNumeric('1.2')).toBe(true)
    })

    it('should return true with invalid types', () => {
      expect(isNumeric(null)).toBe(false)
      expect(isNumeric(undefined)).toBe(false)
      expect(isNumeric({ a: 1 })).toBe(false)
      expect(isNumeric([1])).toBe(false)
      expect(isNumeric(new Date())).toBe(false)
      expect(isNumeric(/a/g)).toBe(false)
    })
  })

  describe('#isBoolean', () => {
    it('should return `true` for booleans', () => {
      expect(isBoolean(true)).toBe(true)
      expect(isBoolean(false)).toBe(true)
      expect(isBoolean(Object(true))).toBe(true)
      expect(isBoolean(Object(false))).toBe(true)
    })

    it('should return `false` for non-booleans', () => {
      expect(isBoolean(1)).toBe(false)
      expect(isBoolean('a')).toBe(false)
      expect(isBoolean(/x/)).toBe(false)
      expect(isBoolean({ a: 1 })).toBe(false)
      expect(isBoolean([1, 2, 3])).toBe(false)
      expect(isBoolean(new Date())).toBe(false)
      expect(isBoolean(new Error())).toBe(false)
    })
  })

  describe('#isUndefined', () => {
    it('should return `true` for `undefined` values', () => {
      expect(isUndefined(undefined)).toBe(true)
      expect(isUndefined(void 0)).toBe(true)
    })

    it('should return `false` for non `undefined` values', () => {
      expect(isUndefined(1)).toBe(false)
      expect(isUndefined(false)).toBe(false)
      expect(isUndefined('a')).toBe(false)
      expect(isUndefined(/x/)).toBe(false)
      expect(isUndefined({ a: 1 })).toBe(false)
      expect(isUndefined([1, 2, 3])).toBe(false)
      expect(isUndefined(new Date())).toBe(false)
      expect(isUndefined(new Error())).toBe(false)
    })
  })

  describe('#isObject', () => {
    it('should return `true` for objects', () => {
      expect(isObject(/x/)).toBe(true)
      expect(isObject({ a: 1 })).toBe(true)
      expect(isObject([1, 2, 3])).toBe(true)
      expect(isObject(new Date())).toBe(true)
      expect(isObject(new Error())).toBe(true)
      expect(isObject(Object('a'))).toBe(true)
      expect(isObject(Object(1))).toBe(true)
      expect(isObject(Object(true))).toBe(true)
    })

    it('should return `false` for non-objects', () => {
      expect(isObject(1)).toBe(false)
      expect(isObject(false)).toBe(false)
      expect(isObject('a')).toBe(false)
    })
  })

  describe('#isArray', () => {
    it('should return `true` for arrays', () => {
      expect(isArray([])).toBe(true)
      expect(isArray(['a', 'b', 'c'])).toBe(true)
      expect(isArray([1, 2, 3])).toBe(true)
    })

    it('should return `false` for non-arrays', () => {
      expect(isArray(1)).toBe(false)
      expect(isArray(false)).toBe(false)
      expect(isArray('a')).toBe(false)
      expect(isArray(/x/)).toBe(false)
      expect(isArray({ a: 1 })).toBe(false)
      expect(isArray(new Date())).toBe(false)
      expect(isArray(new Error())).toBe(false)
    })
  })

  describe('#isArrayLike', () => {
    it('should return `true` for array-like values', () => {
      expect(isArrayLike([])).toBe(true)
      expect(isArrayLike(['a', 'b', 'c'])).toBe(true)
      expect(isArrayLike([1, 2, 3])).toBe(true)
      expect(isArrayLike({ 0: 'a', length: 1 })).toBe(true)
    })

    it('should return `false` for non-arrays', () => {
      expect(isArrayLike(1)).toBe(false)
      expect(isArrayLike(false)).toBe(false)
      expect(isArrayLike('a')).toBe(false)
      expect(isArrayLike(/x/)).toBe(false)
      expect(isArrayLike({ a: 1 })).toBe(false)
      expect(isArrayLike(new Date())).toBe(false)
      expect(isArrayLike(new Error())).toBe(false)
    })
  })

  describe('#isFunction', () => {
    it('should return `true` for  functions', () => {
      expect(isFunction(describe)).toBe(true)
    })

    it('should return `true` for async functions', () => {
      async function fn() {}
      expect(isFunction(fn)).toBe(true)
    })

    it('should return `true` for generator functions', () => {
      function* fn() {
        yield 1
      }
      expect(isFunction(fn)).toBe(true)
    })

    it('should return `true` for the `Proxy` constructor', () => {
      if (Proxy) {
        expect(isFunction(Proxy)).toBe(true)
      }
    })

    it('should return `false` for non-functions', () => {
      expect(isFunction(1)).toBe(false)
      expect(isFunction(false)).toBe(false)
      expect(isFunction('a')).toBe(false)
      expect(isFunction(/x/)).toBe(false)
      expect(isFunction({ a: 1 })).toBe(false)
      expect(isFunction([1, 2, 3])).toBe(false)
      expect(isFunction(new Date())).toBe(false)
      expect(isFunction(new Error())).toBe(false)
    })
  })

  describe('#isWindow', () => {
    it('should return `true` for window', () => {
      expect(isWindow(window)).toBe(true)
    })

    it('should return `false` for non window', () => {
      expect(isWindow(1)).toBe(false)
      expect(isWindow(false)).toBe(false)
      expect(isWindow('a')).toBe(false)
      expect(isWindow(/x/)).toBe(false)
      expect(isWindow({ a: 1 })).toBe(false)
      expect(isWindow([1, 2, 3])).toBe(false)
      expect(isWindow(new Date())).toBe(false)
      expect(isWindow(new Error())).toBe(false)
    })
  })
})
