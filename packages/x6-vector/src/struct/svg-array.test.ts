import { SVGArray } from './svg-array'

describe('SVGArray', () => {
  describe('constructor()', () => {
    it('should preallocate memory if only number is passed', () => {
      const arr = new SVGArray(1)
      expect(arr.length).toBe(1)
    })

    it('should parse a matrix array correctly to string', () => {
      const raw = [
        0.343,
        0.669,
        0.119,
        0,
        0,
        0.249,
        -0.626,
        0.13,
        0,
        0,
        0.172,
        0.334,
        0.111,
        0,
        0,
        0.0,
        0.0,
        0.0,
        1,
        -0,
      ]
      const array = new SVGArray(raw)

      array.forEach((v, i) => {
        expect(v).toBe(raw[i])
      })

      expect(`${array}`).toBe(
        '0.343 0.669 0.119 0 0 0.249 -0.626 0.13 0 0 0.172 0.334 0.111 0 0 0 0 0 1 0',
      )
    })

    it('should parse space seperated string and converts it to array', () => {
      expect(new SVGArray('1 2 3 4').valueOf()).toEqual([1, 2, 3, 4])
    })

    it('should parse comma seperated string and converts it to array', () => {
      expect(new SVGArray('1,2,3,4').valueOf()).toEqual([1, 2, 3, 4])
    })
  })

  describe('reverse()', () => {
    it('should reverse the array', () => {
      const array = new SVGArray([1, 2, 3, 4, 5]).reverse()
      expect(array.valueOf()).toEqual([5, 4, 3, 2, 1])
    })

    it('should returns itself', () => {
      const array = new SVGArray()
      expect(array.reverse()).toBe(array)
    })
  })

  describe('clone()', () => {
    it('should create a shallow clone of the array', () => {
      const array = new SVGArray([1, 2, 3, 4, 5])
      const clone = array.clone()

      expect(array.toString()).toBe(clone.toString())
      expect(array).not.toBe(clone)
    })
  })

  describe('toSet()', () => {
    it('should create a Set from the Array', () => {
      const set = new SVGArray([1, 1, 2, 3]).toSet()
      expect(set).toBeInstanceOf(Set)
    })
  })
})
