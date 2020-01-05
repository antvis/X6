import { Lang } from '.'

describe('lang', () => {
  describe('#isNil', () => {
    it('should return `true` for nullish values', () => {
      expect(Lang.isNil(null)).toBe(true)
      expect(Lang.isNil(undefined)).toBe(true)
    })

    it('should return `false` for non-nullish values', () => {
      expect(Lang.isNil({ a: 1 })).toBe(false)
      expect(Lang.isNil(1)).toBe(false)
      expect(Lang.isNil(true)).toBe(false)
      expect(Lang.isNil('a')).toBe(false)
      expect(Lang.isNil(/x/)).toBe(false)
      expect(Lang.isNil([1, 2, 3])).toBe(false)
      expect(Lang.isNil(new Date())).toBe(false)
      expect(Lang.isNil(new Error())).toBe(false)
    })
  })

  describe('#isNull', () => {
    it('should return `true` for `null` values', () => {
      expect(Lang.isNull(null)).toBe(true)
    })

    it('should return `false` for non `null` values', () => {
      expect(Lang.isNull({ a: 1 })).toBe(false)
      expect(Lang.isNull(1)).toBe(false)
      expect(Lang.isNull(true)).toBe(false)
      expect(Lang.isNull('a')).toBe(false)
      expect(Lang.isNull(/x/)).toBe(false)
      expect(Lang.isNull([1, 2, 3])).toBe(false)
      expect(Lang.isNull(new Date())).toBe(false)
      expect(Lang.isNull(new Error())).toBe(false)
    })
  })

  describe('#isString', () => {
    it('should return `true` for strings', () => {
      expect(Lang.isString('a')).toBe(true)
      expect(Lang.isString(Object('a'))).toBe(true)
      expect(Lang.isString(String('a'))).toBe(true)
    })

    it('should return `false` for non-strings', () => {
      expect(Lang.isString({ a: 1 })).toBe(false)
      expect(Lang.isString(1)).toBe(false)
      expect(Lang.isString(true)).toBe(false)
      expect(Lang.isString(/x/)).toBe(false)
      expect(Lang.isString([1, 2, 3])).toBe(false)
      expect(Lang.isString(new Date())).toBe(false)
      expect(Lang.isString(new Error())).toBe(false)
    })
  })

  describe('#isNumber', () => {
    it('should return `true` for numbers', () => {
      expect(Lang.isNumber(0)).toBe(true)
      expect(Lang.isNumber(Object(0))).toBe(true)
      expect(Lang.isNumber(NaN)).toBe(true)
    })

    it('should return `false` for non-numbers', () => {
      expect(Lang.isNumber({ a: 1 })).toBe(false)
      expect(Lang.isNumber(true)).toBe(false)
      expect(Lang.isNumber('a')).toBe(false)
      expect(Lang.isNumber(/x/)).toBe(false)
      expect(Lang.isNumber([1, 2, 3])).toBe(false)
      expect(Lang.isNumber(new Date())).toBe(false)
      expect(Lang.isNumber(new Error())).toBe(false)
    })
  })

  describe('#isNumeric', () => {
    it('should return true with numberic string', () => {
      expect(Lang.isNumeric('1')).toBe(true)
      expect(Lang.isNumeric('1.2')).toBe(true)
    })

    it('should return true with invalid types', () => {
      expect(Lang.isNumeric(null)).toBe(false)
      expect(Lang.isNumeric(undefined)).toBe(false)
      expect(Lang.isNumeric({ a: 1 })).toBe(false)
      expect(Lang.isNumeric([1])).toBe(false)
      expect(Lang.isNumeric(new Date())).toBe(false)
      expect(Lang.isNumeric(/a/g)).toBe(false)
    })
  })

  describe('#isBoolean', () => {
    it('should return `true` for booleans', () => {
      expect(Lang.isBoolean(true)).toBe(true)
      expect(Lang.isBoolean(false)).toBe(true)
      expect(Lang.isBoolean(Object(true))).toBe(true)
      expect(Lang.isBoolean(Object(false))).toBe(true)
    })

    it('should return `false` for non-booleans', () => {
      expect(Lang.isBoolean(1)).toBe(false)
      expect(Lang.isBoolean('a')).toBe(false)
      expect(Lang.isBoolean(/x/)).toBe(false)
      expect(Lang.isBoolean({ a: 1 })).toBe(false)
      expect(Lang.isBoolean([1, 2, 3])).toBe(false)
      expect(Lang.isBoolean(new Date())).toBe(false)
      expect(Lang.isBoolean(new Error())).toBe(false)
    })
  })

  describe('#isUndefined', () => {
    it('should return `true` for `undefined` values', () => {
      expect(Lang.isUndefined(undefined)).toBe(true)
      expect(Lang.isUndefined(void 0)).toBe(true)
    })

    it('should return `false` for non `undefined` values', () => {
      expect(Lang.isUndefined(1)).toBe(false)
      expect(Lang.isUndefined(false)).toBe(false)
      expect(Lang.isUndefined('a')).toBe(false)
      expect(Lang.isUndefined(/x/)).toBe(false)
      expect(Lang.isUndefined({ a: 1 })).toBe(false)
      expect(Lang.isUndefined([1, 2, 3])).toBe(false)
      expect(Lang.isUndefined(new Date())).toBe(false)
      expect(Lang.isUndefined(new Error())).toBe(false)
    })
  })

  describe('#isObject', () => {
    it('should return `true` for objects', () => {
      expect(Lang.isObject(/x/)).toBe(true)
      expect(Lang.isObject({ a: 1 })).toBe(true)
      expect(Lang.isObject([1, 2, 3])).toBe(true)
      expect(Lang.isObject(new Date())).toBe(true)
      expect(Lang.isObject(new Error())).toBe(true)
      expect(Lang.isObject(Object('a'))).toBe(true)
      expect(Lang.isObject(Object(1))).toBe(true)
      expect(Lang.isObject(Object(true))).toBe(true)
    })

    it('should return `false` for non-objects', () => {
      expect(Lang.isObject(1)).toBe(false)
      expect(Lang.isObject(false)).toBe(false)
      expect(Lang.isObject('a')).toBe(false)
    })
  })

  describe('#isArray', () => {
    it('should return `true` for arrays', () => {
      expect(Lang.isArray([])).toBe(true)
      expect(Lang.isArray(['a', 'b', 'c'])).toBe(true)
      expect(Lang.isArray([1, 2, 3])).toBe(true)
    })

    it('should return `false` for non-arrays', () => {
      expect(Lang.isArray(1)).toBe(false)
      expect(Lang.isArray(false)).toBe(false)
      expect(Lang.isArray('a')).toBe(false)
      expect(Lang.isArray(/x/)).toBe(false)
      expect(Lang.isArray({ a: 1 })).toBe(false)
      expect(Lang.isArray(new Date())).toBe(false)
      expect(Lang.isArray(new Error())).toBe(false)
    })
  })

  describe('#isArrayLike', () => {
    it('should return `true` for array-like values', () => {
      expect(Lang.isArrayLike([])).toBe(true)
      expect(Lang.isArrayLike(['a', 'b', 'c'])).toBe(true)
      expect(Lang.isArrayLike([1, 2, 3])).toBe(true)
      expect(Lang.isArrayLike({ 0: 'a', length: 1 })).toBe(true)
    })

    it('should return `false` for non-arrays', () => {
      expect(Lang.isArrayLike(1)).toBe(false)
      expect(Lang.isArrayLike(false)).toBe(false)
      expect(Lang.isArrayLike('a')).toBe(false)
      expect(Lang.isArrayLike(/x/)).toBe(false)
      expect(Lang.isArrayLike({ a: 1 })).toBe(false)
      expect(Lang.isArrayLike(new Date())).toBe(false)
      expect(Lang.isArrayLike(new Error())).toBe(false)
    })
  })

  describe('#isFunction', () => {
    it('should return `true` for  functions', () => {
      expect(Lang.isFunction(describe)).toBe(true)
    })

    it('should return `true` for async functions', () => {
      async function fn() {}
      expect(Lang.isFunction(fn)).toBe(true)
    })

    it('should return `true` for generator functions', () => {
      function* fn() {
        yield 1
      }
      expect(Lang.isFunction(fn)).toBe(true)
    })

    it('should return `true` for the `Proxy` constructor', () => {
      if (Proxy) {
        expect(Lang.isFunction(Proxy)).toBe(true)
      }
    })

    it('should return `false` for non-functions', () => {
      expect(Lang.isFunction(1)).toBe(false)
      expect(Lang.isFunction(false)).toBe(false)
      expect(Lang.isFunction('a')).toBe(false)
      expect(Lang.isFunction(/x/)).toBe(false)
      expect(Lang.isFunction({ a: 1 })).toBe(false)
      expect(Lang.isFunction([1, 2, 3])).toBe(false)
      expect(Lang.isFunction(new Date())).toBe(false)
      expect(Lang.isFunction(new Error())).toBe(false)
    })
  })

  describe('#isWindow', () => {
    it('should return `true` for window', () => {
      expect(Lang.isWindow(window)).toBe(true)
    })

    it('should return `false` for non window', () => {
      expect(Lang.isWindow(1)).toBe(false)
      expect(Lang.isWindow(false)).toBe(false)
      expect(Lang.isWindow('a')).toBe(false)
      expect(Lang.isWindow(/x/)).toBe(false)
      expect(Lang.isWindow({ a: 1 })).toBe(false)
      expect(Lang.isWindow([1, 2, 3])).toBe(false)
      expect(Lang.isWindow(new Date())).toBe(false)
      expect(Lang.isWindow(new Error())).toBe(false)
    })
  })
})
