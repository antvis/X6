import { NumberArray } from './number-array'

describe('NumberArray', () => {
  describe('constructor()', () => {
    it('should preallocate memory if only number is passed', () => {
      const arr = new NumberArray(1)
      expect(arr.length).toBe(1)
    })

    it('should parse a matrix array correctly to string', () => {
      const raw = [
        0.343, 0.669, 0.119, 0, 0, 0.249, -0.626, 0.13, 0, 0, 0.172, 0.334,
        0.111, 0, 0, 0.0, 0.0, 0.0, 1, -0,
      ]
      const array = new NumberArray(raw)

      array.forEach((v, i) => {
        expect(v).toBe(raw[i])
      })

      expect(`${array}`).toBe(
        '0.343 0.669 0.119 0 0 0.249 -0.626 0.13 0 0 0.172 0.334 0.111 0 0 0 0 0 1 0',
      )
    })

    it('should parse space seperated string and converts it to array', () => {
      expect(new NumberArray('1 2 3 4').valueOf()).toEqual([1, 2, 3, 4])
    })

    it('should parse comma seperated string and converts it to array', () => {
      expect(new NumberArray('1,2,3,4').valueOf()).toEqual([1, 2, 3, 4])
    })
  })

  describe('reverse()', () => {
    it('should reverse the array', () => {
      const array = new NumberArray([1, 2, 3, 4, 5]).reverse()
      expect(array.valueOf()).toEqual([5, 4, 3, 2, 1])
    })

    it('should returns itself', () => {
      const array = new NumberArray()
      expect(array.reverse()).toBe(array)
    })
  })

  describe('clone()', () => {
    it('should create a shallow clone of the array', () => {
      const array = new NumberArray([1, 2, 3, 4, 5, 6, 7, 8])
      const clone = array.clone()

      expect(array.toString()).toBe(clone.toString())
      expect(array).not.toBe(clone)
    })
  })

  describe('toSet()', () => {
    it('should create a Set from the Array', () => {
      const set = new NumberArray([1, 1, 2, 3]).toSet()
      expect(set).toBeInstanceOf(Set)
    })
  })

  describe('toArray()', () => {
    it('should convert to an array', () => {
      const arr = [1, 1, 2, 3]
      expect(new NumberArray(arr).toArray()).toEqual(arr)
    })
  })

  describe('valueOf()', () => {
    it('should return an array', () => {
      const arr = [1, 1, 2, 3]
      expect(new NumberArray(arr).valueOf()).toEqual(arr)
    })
  })
})
