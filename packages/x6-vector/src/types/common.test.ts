import * as Util from './common'

describe('types', () => {
  describe('isFalsy()', () => {
    it('should return true when the given value is falsy', () => {
      const vals = [null, undefined, 0, false]
      vals.forEach((v) => {
        expect(Util.isFalsy(v)).toBeTrue()
      })
    })

    it('should return false when the given value is not falsy', () => {
      const vals = [1, {}, () => {}, true]
      vals.forEach((v) => {
        expect(Util.isFalsy(v)).toBeFalse()
      })
    })
  })

  describe('isNullish()', () => {
    it('should return true when the given value is nil', () => {
      const vals = [null, undefined]
      vals.forEach((v) => {
        expect(Util.isNullish(v)).toBeTrue()
      })
    })

    it('should return false when the given value is not nil', () => {
      const vals = [1, {}, () => {}, true]
      vals.forEach((v) => {
        expect(Util.isNullish(v)).toBeFalse()
      })
    })
  })

  describe('isPrimitive()', () => {
    it('should return true when the given value is primitive', () => {
      const vals = [null, undefined, 1, 'abc', true, Symbol('test')]
      vals.forEach((v) => {
        expect(Util.isPrimitive(v)).toBeTrue()
      })
    })

    it('should return true when the given value is not primitive', () => {
      const vals = [{}, () => {}]
      vals.forEach((v) => {
        expect(Util.isPrimitive(v)).toBeFalsy()
      })
    })
  })
})
