import { Point } from './point'
import { Matrix } from './matrix'

describe('Point', () => {
  describe('constructor()', () => {
    it('should create a point with default values', () => {
      const point = new Point()
      expect(point.x).toBe(0)
      expect(point.y).toBe(0)
    })

    it('should create a point with given x and y values', () => {
      const point = new Point(2, 4)
      expect(point.x).toBe(2)
      expect(point.y).toBe(4)
    })

    it('should create a point with only x value and set the y value to 0', () => {
      const point = new Point(7)
      expect(point.x).toBe(7)
      expect(point.y).toBe(0)
    })

    it('should create a point from array', () => {
      const point = new Point([2, 4])
      expect(point.x).toBe(2)
      expect(point.y).toBe(4)
    })

    it('should create a point from object', () => {
      const point = new Point({ x: 2, y: 4 })
      expect(point.x).toBe(2)
      expect(point.y).toBe(4)
    })

    it('should create a point from Point', () => {
      const point = new Point(new Point(2, 4))
      expect(point.x).toBe(2)
      expect(point.y).toBe(4)
    })
  })

  describe('transform()', () => {
    it('should transform point with a matrix', () => {
      expect(
        new Point().transform(new Matrix({ translate: [10, 10] })),
      ).toEqual(new Point(10, 10))
    })

    it('should transform a point with a transformation object', () => {
      expect(new Point().transform({ translate: [10, 10] })).toEqual(
        new Point(10, 10),
      )
    })
  })

  describe('clone()', () => {
    it('should return the cloned point', () => {
      const point1 = new Point(1, 1)
      const point2 = point1.clone()
      expect(point1).toEqual(point2)
      expect(point1).not.toBe(point2)
    })
  })

  describe('toArray()', () => {
    it('should create an array representation of Point', () => {
      const p = new Point(1, 2)
      expect(p.toArray()).toEqual([1, 2])
    })
  })

  describe('valueOf()', () => {
    it('should create an array representation of Point', () => {
      const p = new Point(1, 2)
      expect(p.valueOf()).toEqual([1, 2])
    })
  })

  describe('toJSON()', () => {
    it('should create an object representation of Point', () => {
      const obj1 = new Point().toJSON()
      expect(obj1.x).toBe(0)
      expect(obj1.y).toBe(0)

      const obj2 = new Point(1, 2).toJSON()
      expect(obj2.x).toBe(1)
      expect(obj2.y).toBe(2)
    })
  })
})
