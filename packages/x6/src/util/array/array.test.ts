import { ArrayExt } from './'

describe('Array', () => {
  describe('slice()', () => {
    it('works with correct arguments', () => {
      const arr: number[] = [1, 2, 3, 4, 5, 6, 7, 8]
      expect(ArrayExt.slice(arr, 1, 4)).toEqual([2, 3, 4])
      expect(ArrayExt.slice(arr, 2)).toEqual([3, 4, 5, 6, 7, 8])
      expect(ArrayExt.slice(arr, 3, -1)).toEqual([4, 5, 6, 7])
    })

    it('should return [] with invalid arr', () => {
      expect(ArrayExt.slice(null)).toEqual([])
    })
  })

  describe('indexOf()', () => {
    it('should return the position of the first item from left to right', () => {
      const arr: number[] = [1, 2, 3, 4, 5, 6, 7, 8]
      expect(ArrayExt.indexOf(arr, 1)).toBe(0)
      expect(ArrayExt.indexOf(arr, arr[arr.length - 1])).toBe(arr.length - 1)
    })

    it('should return -1 with no found item', () => {
      const arr: number[] = [1, 2, 3, 4, 5, 6, 7, 8]
      expect(ArrayExt.indexOf(arr, 0)).toBe(-1)
      expect(ArrayExt.indexOf(null, 1)).toBe(-1)
    })
  })

  describe('includes()', () => {
    it('should return true when item in arr', () => {
      const people = {
        name: 'Alice',
        age: 25
      }
      const arr = [people]
      expect(ArrayExt.includes(arr, people)).toBeTruthy()
    })

    it('should return false when item not in arr', () => {
      const arr = [{
        name: 'Alice',
        age: 25
      }]
      expect(ArrayExt.includes(arr, {
        name: 'Alice',
        age: 25
      })).toBeFalsy()
    })
  })

  describe('lastIndexOf()', () => {
    it('should return the position of the first item from right to left', () => {
      const arr: number[] = [1, 2, 3, 4, 3, 2, 1]
      expect(ArrayExt.lastIndexOf(arr, 1)).toBe(6)
    })

    it('should return -1 with no found item', () => {
      const arr: number[] = [1, 2, 3, 4, 5, 6, 7, 8]
      expect(ArrayExt.lastIndexOf(arr, 0)).toBe(-1)
      expect(ArrayExt.lastIndexOf(null, 1)).toBe(-1)
    })
  })

  describe('map()', () => {
    it('should return mapped result', () => {
      const arr: number[] = [1, 2, 3, 4, 5, 6, 7, 8]
      expect(ArrayExt.map(arr, item => item + 1)).toEqual([2, 3, 4, 5, 6, 7, 8, 9])
      expect(ArrayExt.map(arr, item => item * 2)).toEqual([2, 4, 6, 8, 10, 12, 14, 16])
    })

    it('should return [] with invalid arr', () => {
      expect(ArrayExt.map(null, item => item)).toEqual([])
    })
  })

  describe('some()', () => {
    it('should return true when an execution result is true', () => {
      const arr: number[] = [1, 2, 3, 4, 5, 6, 7, 8]
      expect(ArrayExt.some(arr, item => item > 7)).toBeTruthy()
      expect(ArrayExt.some(arr, item => item < 1)).toBeFalsy()
    })

    it('should return false with invalid arr', () => {
      expect(ArrayExt.some(null, () => true)).toBeFalsy()
    })
  })

  describe('every()', () => {
    it('should return true when all execution result is true', () => {
      const arr: number[] = [1, 2, 3, 4, 5, 6, 7, 8]
      expect(ArrayExt.every(arr, item => item > 0)).toBeTruthy()
      expect(ArrayExt.every(arr, item => item > 1)).toBeFalsy()
    })

    it('should return false with invalid arr', () => {
      expect(ArrayExt.every(null, () => true)).toBeFalsy()
    })
  })

  describe('filter()', () => {
    it('should return filtered arr', () => {
      const arr: number[] = [1, 2, 3, 4, 5, 6, 7, 8]
      expect(ArrayExt.filter(arr, item => item > 5)).toEqual([6, 7, 8])
      expect(ArrayExt.filter(arr, item => item > 8)).toEqual([])
    })

    it('should return [] with invalid arr', () => {
      expect(ArrayExt.filter(null, () => true)).toEqual([])
    })
  })

  describe('forEach()', () => {
    it('each iteration function shoud executed', () => {
      const arr: number[] = [1, 2, 3, 4, 5, 6, 7, 8]
      const callback = jest.fn()
      ArrayExt.forEach(arr, callback)
      expect(callback.mock.calls.length).toBe(arr.length)
      expect(callback.mock.calls[0][0]).toBe(arr[0])
    })
  })

  describe('reduce()', () => {
    it('each iteration function shoud executed', () => {
      const arr: number[] = [1, 2, 3, 4, 5, 6, 7, 8]
      const callback = jest.fn((prev, cur) => prev + cur)
      const ret = ArrayExt.reduce(arr, callback, 0)
      expect(callback.mock.calls.length).toBe(arr.length)
      expect(callback.mock.calls[0][0]).toBe(0)
      expect(callback.mock.calls[0][1]).toBe(1)
      expect(ret).toBe(36)
    })

    it('should return initialValue with invalid arr', () => {
      const callback = jest.fn()
      expect(ArrayExt.reduce(null, callback, 16)).toBe(16)
    })
  })

  describe('reduceRight()', () => {
    it('each iteration function shoud executed', () => {
      const arr: number[] = [1, 2, 3, 4, 5, 6, 7, 8]
      const callback = jest.fn((prev, cur) => prev + cur)
      const ret = ArrayExt.reduceRight(arr, callback, 0)
      expect(callback.mock.calls.length).toBe(arr.length)
      expect(callback.mock.calls[0][0]).toBe(0)
      expect(callback.mock.calls[0][1]).toBe(8)
      expect(ret).toBe(36)
    })

    it('should return initialValue with invalid arr', () => {
      const callback = jest.fn()
      expect(ArrayExt.reduceRight(null, callback, 16)).toBe(16)
    })
  })
})