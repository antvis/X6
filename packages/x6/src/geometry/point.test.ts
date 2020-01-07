import { Point } from './point'

describe('point', () => {
  describe('#constructor', () => {
    it('should create a point instance', () => {
      expect(new Point()).toBeInstanceOf(Point)
      expect(new Point(1)).toBeInstanceOf(Point)
      expect(new Point(1, 2)).toBeInstanceOf(Point)
      expect(new Point().equals(new Point(0, 0)))
    })
  })

  describe('#round', () => {
    it('should round x and y properties to the given precision', () => {
      const point = new Point(17.231, 4.01)
      point.round(2)
      expect(point.toString()).toEqual('17.23 4.01')
      point.round(0)
      expect(point.toString()).toEqual('17 4')
    })
  })

  describe('#update', () => {
    it('should update the values of x and y', () => {
      expect(new Point(4, 17).update(16, 24)).toEqual(new Point(16, 24))
    })
  })

  describe('#closest', () => {
    it('should return the closest point', () => {
      const a = new Point(10, 10)
      const b = { x: 20, y: 20 }
      const c = { x: 30, y: 30 }

      expect(a.closest([])).toBeNull()

      expect(a.closest([b])).toBeInstanceOf(Point)
      expect(a.closest([b]).toJSON()).toEqual(b)
      expect(a.closest([b, c]).toJSON()).toEqual(b)
      expect(a.closest([b, c]).toJSON()).toEqual(b)
    })
  })

  describe('#diff', () => {
    it('should return the diff as a point with the given point', () => {
      expect(new Point(0, 10).diff(4, 8)).toEqual(new Point(-4, 2))
      expect(new Point(5, 8).diff(5, 10)).toEqual(new Point(0, -2))
    })
  })

  describe('#normalize', () => {
    it('should scale x and y such that the distance between the point and the origin (0,0) is equal to the given length', () => {
      expect(new Point(0, 10).normalize(20).toString()).toEqual('0 20')
      expect(new Point(2, 0).normalize(4).toString()).toEqual('4 0')
    })
  })

  describe('#translate', () => {
    it('should translate x and y by adding the given dx and dy values respectively', () => {
      const point = new Point(0, 0)
      point.translate(2, 3)
      expect(point.toJSON()).toEqual({ x: 2, y: 3 })
      point.translate(new Point(-2, 4))
      expect(point.toJSON()).toEqual({ x: 0, y: 7 })
    })
  })

  describe('#rotate', () => {
    const rotate = (p: Point, angle: number, center?: Point) =>
      p
        .clone()
        .rotate(angle, center)
        .round(3)
        .toString()

    it('should return a rotated version of self', () => {
      const point = new Point(5, 5)
      let angle

      const zeroPoint = new Point(0, 0)
      const arbitraryPoint = new Point(14, 6)

      angle = 0
      expect(rotate(point, angle)).toEqual('5 5')
      expect(rotate(point, angle, zeroPoint)).toEqual('5 5')
      expect(rotate(point, angle, point)).toEqual('5 5')
      expect(rotate(point, angle, arbitraryPoint)).toEqual('5 5')

      angle = 154
      expect(rotate(point, angle)).toEqual('-2.302 -6.686')
      expect(rotate(point, angle, zeroPoint)).toEqual('-2.302 -6.686')
      expect(rotate(point, angle, point)).toEqual('5 5')
      expect(rotate(point, angle, arbitraryPoint)).toEqual('21.651 10.844')
    })
  })

  describe('#scale', () => {
    it('should scale point with the given amount', () => {
      expect(new Point(20, 30).scale(2, 3)).toEqual(new Point(40, 90))
    })

    it('should scale point with the given amount and center ', () => {
      expect(new Point(20, 30).scale(2, 3, new Point(40, 45))).toEqual(
        new Point(0, 0),
      )
    })
  })

  describe('#theta', () => {
    it('should return the angle between me and p and the x-axis.', () => {
      const me = new Point(1, 1)

      expect(me.theta(me)).toBe(-0)
      expect(me.theta(new Point(2, 1))).toBe(-0)
      expect(me.theta(new Point(2, 0))).toBe(45)
      expect(me.theta(new Point(1, 0))).toBe(90)
      expect(me.theta(new Point(0, 0))).toBe(135)
      expect(me.theta(new Point(0, 1))).toBe(180)
      expect(me.theta(new Point(0, 2))).toBe(225)
      expect(me.theta(new Point(1, 2))).toBe(270)
      expect(me.theta(new Point(2, 2))).toBe(315)
    })
  })

  describe('#angleBetween', () => {
    it('should returns the angle between vector from me to `p1` and the vector from me to `p2`.', () => {
      const me = new Point(1, 2)
      const p1 = new Point(2, 4)
      const p2 = new Point(4, 3)

      const PRECISION = 10

      expect(me.angleBetween(me, me)).toBeNaN()
      expect(me.angleBetween(p1, me)).toBeNaN()
      expect(me.angleBetween(me, p2)).toBeNaN()
      expect(me.angleBetween(p1, p2).toFixed(PRECISION)).toBe('45.0000000000')
      expect(me.angleBetween(p2, p1).toFixed(PRECISION)).toBe('315.0000000000')
    })
  })

  describe('#vectorAngle', () => {
    it('should return the angle between the vector from `0,0` to me and the vector from `0,0` to `p`', () => {
      const p0 = new Point(1, 2)
      const p = new Point(3, 1)
      const zero = new Point(0, 0)

      const PRECISION = 10

      expect(zero.vectorAngle(zero)).toBeNaN()
      expect(p0.vectorAngle(zero)).toBeNaN()
      expect(p.vectorAngle(zero)).toBeNaN()
      expect(zero.vectorAngle(p0)).toBeNaN()
      expect(zero.vectorAngle(p)).toBeNaN()
      expect(p0.vectorAngle(p).toFixed(PRECISION)).toBe('45.0000000000')
      expect(p.vectorAngle(p0).toFixed(PRECISION)).toBe('315.0000000000')
    })
  })

  describe('#dot', () => {
    it('should return the dot product of `p`', () => {
      const p1 = new Point(4, 17)
      const p2 = new Point(2, 10)
      expect(p1.dot(p2)).toBe(178)
      expect(p2.dot(p1)).toBe(178)
    })
  })

  describe('#cross', () => {
    it('should return the cross product of the vector from me to `p1` and the vector from me to `p2`', () => {
      const p0 = new Point(3, 15)
      const p1 = new Point(4, 17)
      const p2 = new Point(2, 10)

      expect(p0.cross(p1, p2)).toBe(3)
      expect(p0.cross(p2, p1)).toBe(-3)
    })
  })
})
