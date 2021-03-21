import { JSONArray, JSONExt, JSONObject, JSONPrimitive } from '.'

describe('JSONExt', () => {
  describe('isPrimitive()', () => {
    it('should return `true` if the value is a primitive', () => {
      expect(JSONExt.isPrimitive(null)).toEqual(true)
      expect(JSONExt.isPrimitive(false)).toEqual(true)
      expect(JSONExt.isPrimitive(true)).toEqual(true)
      expect(JSONExt.isPrimitive(1)).toEqual(true)
      expect(JSONExt.isPrimitive('1')).toEqual(true)
    })

    it('should return `false` if the value is not a primitive', () => {
      expect(JSONExt.isPrimitive([])).toEqual(false)
      expect(JSONExt.isPrimitive({})).toEqual(false)
    })
  })

  describe('isArray()', () => {
    it('should test whether a JSON value is an array', () => {
      expect(JSONExt.isArray([])).toEqual(true)
      expect(JSONExt.isArray(null)).toEqual(false)
      expect(JSONExt.isArray(1)).toEqual(false)
    })
  })

  describe('isObject()', () => {
    it('should test whether a JSON value is an object', () => {
      expect(JSONExt.isObject({ a: 1 })).toEqual(true)
      expect(JSONExt.isObject({})).toEqual(true)
      expect(JSONExt.isObject([])).toEqual(false)
      expect(JSONExt.isObject(1)).toEqual(false)
    })
  })

  describe('deepEqual()', () => {
    it('should compare two JSON values for deep equality', () => {
      expect(JSONExt.deepEqual([], [])).toEqual(true)
      expect(JSONExt.deepEqual([1], [1])).toEqual(true)
      expect(JSONExt.deepEqual({}, {})).toEqual(true)
      expect(JSONExt.deepEqual({ a: [] }, { a: [] })).toEqual(true)
      expect(JSONExt.deepEqual({ a: { b: null } }, { a: { b: null } })).toEqual(
        true,
      )
      expect(JSONExt.deepEqual({ a: '1' }, { a: '1' })).toEqual(true)
      expect(JSONExt.deepEqual({ a: { b: null } }, { a: { b: '1' } })).toEqual(
        false,
      )
      expect(JSONExt.deepEqual({ a: [] }, { a: [1] })).toEqual(false)
      expect(JSONExt.deepEqual([1], [1, 2])).toEqual(false)
      expect(JSONExt.deepEqual(null, [1, 2])).toEqual(false)
      expect(JSONExt.deepEqual([1], {})).toEqual(false)
      expect(JSONExt.deepEqual([1], [2])).toEqual(false)
      expect(JSONExt.deepEqual({}, { a: 1 })).toEqual(false)
      expect(JSONExt.deepEqual({ b: 1 }, { a: 1 })).toEqual(false)
    })
  })

  describe('deepCopy()', () => {
    it('should deep copy an object', () => {
      const v1: JSONPrimitive = null
      const v2: JSONPrimitive = true
      const v3: JSONPrimitive = false
      const v4: JSONPrimitive = 'foo'
      const v5: JSONPrimitive = 42
      const v6: JSONArray = [1, 2, 3, [4, 5, 6], { a: 12, b: [4, 5] }, false]
      const v7: JSONObject = { a: false, b: [null, [1, 2]], c: { a: 1 } }
      const r1 = JSONExt.deepCopy(v1)
      const r2 = JSONExt.deepCopy(v2)
      const r3 = JSONExt.deepCopy(v3)
      const r4 = JSONExt.deepCopy(v4)
      const r5 = JSONExt.deepCopy(v5)
      const r6 = JSONExt.deepCopy(v6)
      const r7 = JSONExt.deepCopy(v7)
      expect(v1).toEqual(r1)
      expect(v2).toEqual(r2)
      expect(v3).toEqual(r3)
      expect(v4).toEqual(r4)
      expect(v5).toEqual(r5)
      expect(v6).toEqual(r6)
      expect(v7).toEqual(r7)
      expect(v6).toEqual(r6)
      expect(v6[3]).not.toBe(r6[3])
      expect(v6[4]).not.toBe(r6[4])
      expect((v6[4] as JSONObject).b).not.toBe((r6[4] as JSONObject).b)
      expect(v7).toEqual(r7)
      expect(v7.b).not.toBe(r7.b)
      expect((v7.b as JSONArray)[1]).not.toBe((r7.b as JSONArray)[1])
      expect(v7.c).not.toBe(r7.c)
    })
  })
})
