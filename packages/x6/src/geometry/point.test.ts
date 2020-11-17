import { Point } from './point'

describe('point', () => {
  describe('#constructor', () => {
    it('should create a point instance', () => {
      expect(new Point()).toBeInstanceOf(Point)
      expect(new Point(1)).toBeInstanceOf(Point)
      expect(new Point(1, 2)).toBeInstanceOf(Point)
      expect(new Point(1, 2).x).toEqual(1)
      expect(new Point(1, 2).y).toEqual(2)
      expect(new Point().equals(new Point(0, 0)))
    })
  })

  describe('#Point.random', () => {
    it('should create random point', () => {
      const p = Point.random(1, 5, 2, 6)
      expect(p.x >= 1 && p.x <= 5).toBe(true)
      expect(p.y >= 2 && p.y <= 6).toBe(true)
    })
  })

  describe('#Point.isPointLike', () => {
    it('should return true when the given object is a point-like object', () => {
      expect(Point.isPointLike({ x: 1, y: 2 })).toBeTrue()
      expect(Point.isPointLike({ x: 1, y: 2, z: 10 })).toBeTrue()
      expect(Point.isPointLike({ x: 1, y: 2, z: 10, s: 's' })).toBeTrue()
    })

    it('should return false when the given object is a point-like object', () => {
      expect(Point.isPointLike({ x: 1 })).toBeFalse()
      expect(Point.isPointLike({ y: 2 })).toBeFalse()
      expect(Point.isPointLike({})).toBeFalse()
      expect(Point.isPointLike(null)).toBeFalse()
      expect(Point.isPointLike(false)).toBeFalse()
      expect(Point.isPointLike(1)).toBeFalse()
      expect(Point.isPointLike('s')).toBeFalse()
    })
  })

  describe('#Point.isPointData', () => {
    it('should return true when the given object is a point-data array', () => {
      expect(Point.isPointData([1, 2])).toBeTrue()
    })

    it('should return false when the given object is a point-data array', () => {
      expect(Point.isPointData({ x: 1, y: 2 })).toBeFalse()
      expect(Point.isPointData([1])).toBeFalse()
      expect(Point.isPointData([1, 2, 3])).toBeFalse()
      expect(Point.isPointData(null)).toBeFalse()
      expect(Point.isPointData(false)).toBeFalse()
      expect(Point.isPointData(1)).toBeFalse()
      expect(Point.isPointData('s')).toBeFalse()
    })
  })

  describe('#Point.toJSON', () => {
    it('should conver the given point to json', () => {
      expect(Point.toJSON([1, 2])).toEqual({ x: 1, y: 2 })
      expect(Point.toJSON({ x: 1, y: 2 })).toEqual({ x: 1, y: 2 })
      expect(Point.toJSON(new Point(1, 2))).toEqual({ x: 1, y: 2 })
    })
  })

  describe('#Point.equals', () => {
    it('should return true when the given two points are equal', () => {
      const p1 = new Point(1, 2)
      expect(Point.equals(p1, p1)).toBeTrue()
      expect(Point.equals(p1, { x: 1, y: 2 })).toBeTrue()
    })

    it('should return false when the given two points are not equal', () => {
      const p1 = new Point(1, 2)
      const p2 = new Point(2, 2)
      expect(Point.equals(p1, p2)).toBeFalse()
      expect(Point.equals(p1, null as any)).toBeFalse()
      expect(Point.equals(p1, { x: 2, y: 2 })).toBeFalse()
    })
  })

  describe('#Point.equalPoints', () => {
    it('should return true when the given points array are equal', () => {
      const p1 = new Point(1, 2)
      expect(Point.equalPoints([p1], [p1])).toBeTrue()
      expect(Point.equalPoints([p1], [{ x: 1, y: 2 }])).toBeTrue()
    })

    it('should return false when the given points array are not equal', () => {
      const p1 = new Point(1, 2)
      const p2 = new Point(2, 2)
      expect(Point.equalPoints([p1], [p2])).toBeFalse()
      expect(Point.equalPoints(null as any, [p2])).toBeFalse()
      expect(Point.equalPoints([p1], null as any)).toBeFalse()
      expect(Point.equalPoints([p1, p2], [p2])).toBeFalse()
      expect(Point.equalPoints([p1, p2], [p2, p1])).toBeFalse()
      expect(Point.equalPoints([p1], [{ x: 2, y: 2 }])).toBeFalse()
    })
  })

  describe('#round', () => {
    it('should round x and y properties to the given precision', () => {
      const point = new Point(17.231, 4.01)
      point.round(2)
      expect(point.serialize()).toEqual('17.23 4.01')
      point.round(0)
      expect(point.serialize()).toEqual('17 4')
    })
  })

  describe('#add', () => {
    it('should add x and y width the given amount', () => {
      const source = new Point(4, 17)
      const target = new Point(20, 20)

      expect(source.clone().add(16, 3)).toEqual(target)
      expect(source.clone().add([16, 3])).toEqual(target)
      expect(source.clone().add({ x: 16, y: 3 })).toEqual(target)
    })
  })

  describe('#update', () => {
    it('should update the values of x and y', () => {
      const source = new Point(4, 17)
      const target = new Point(16, 24)
      expect(source.clone().update(16, 24)).toEqual(target)
      expect(source.clone().update([16, 24])).toEqual(target)
      expect(source.clone().update({ x: 16, y: 24 })).toEqual(target)
      expect(source.clone().update(target)).toEqual(target)
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
      p.clone().rotate(angle, center).round(3).serialize()

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

  describe('#closest', () => {
    it('should return the closest point', () => {
      const a = new Point(10, 10)
      const b = { x: 20, y: 20 }
      const c = { x: 30, y: 30 }

      expect(a.closest([])).toBeNull()

      expect(a.closest([b])).toBeInstanceOf(Point)
      expect(a.closest([b])!.toJSON()).toEqual(b)
      expect(a.closest([b, c])!.toJSON()).toEqual(b)
      expect(a.closest([b, c])!.toJSON()).toEqual(b)
    })
  })

  describe('#distance', () => {
    it('should return the distance between me and the given point', () => {
      const source = new Point(1, 2)
      const target = new Point(4, 6)

      expect(source.distance(target)).toEqual(5)
    })
  })

  describe('#squaredDistance', () => {
    it('should return the squared distance between me and the given point', () => {
      const source = new Point(1, 2)
      const target = new Point(4, 6)

      expect(source.squaredDistance(target)).toEqual(25)
    })
  })

  describe('#manhattanDistance', () => {
    it('should return the manhattan distance between me and the given point', () => {
      const source = new Point(1, 2)
      const target = new Point(4, 6)

      expect(source.manhattanDistance(target)).toEqual(7)
    })
  })

  describe('#magnitude', () => {
    it('should return the magnitude of the given point', () => {
      expect(new Point(3, 4).magnitude()).toEqual(5)
    })

    it('should return `0.01` when the given point is `{0, 0}`', () => {
      expect(new Point(0, 0).magnitude()).toEqual(0.01)
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

  describe('#changeInAngle', () => {
    it('should return the change in angle from my previous position `-dx, -dy` to my new position relative to origin point', () => {
      const p = new Point(1, 1)
      expect(p.changeInAngle(1, 0)).toEqual(-45)
    })

    it('should return the change in angle from my previous position `-dx, -dy` to my new position relative to `ref` point', () => {
      const p = new Point(2, 2)
      expect(p.changeInAngle(1, 0, { x: 1, y: 1 })).toEqual(-45)
    })
  })

  describe('#adhereToRect', () => {
    it('should return `p` when `p` is contained in `rect`', () => {
      const p = new Point(2, 2)
      const rect = { x: 1, y: 1, width: 4, height: 4 }
      expect(p.adhereToRect(rect).equals(p)).toBeTrue()
    })

    it('should adhere to target `rect` when `p` is outside of `rect`', () => {
      const p = new Point(2, 8)
      const rect = { x: 1, y: 1, width: 4, height: 4 }
      expect(p.adhereToRect(rect).equals({ x: 2, y: 5 })).toBeTrue()
    })
  })

  describe('#bearing', () => {
    it('should return the bearing between me and the given point.', () => {
      const p = new Point(2, 8)
      expect(p.bearing(new Point())).toEqual('S')
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

  describe('#diff', () => {
    it('should return the diff as a point with the given point', () => {
      expect(new Point(0, 10).diff(4, 8)).toEqual(new Point(-4, 2))
      expect(new Point(5, 8).diff({ x: 5, y: 10 })).toEqual(new Point(0, -2))
    })
  })

  describe('#lerp', () => {
    it('should return an interpolation between me and the given point `p`', () => {
      expect(new Point(1, 1).lerp({ x: 3, y: 3 }, 0.5)).toEqual(new Point(2, 2))
    })
  })

  describe('#normalize', () => {
    it('should scale x and y such that the distance between the point and the origin (0,0) is equal to the given length', () => {
      expect(new Point(0, 10).normalize(20).serialize()).toEqual('0 20')
      expect(new Point(2, 0).normalize(4).serialize()).toEqual('4 0')
    })
  })

  describe('#move', () => {
    it('should move the point on a line that leads to another point `ref` by a certain `distance`.', () => {
      expect(new Point(1, 1).move({ x: 1, y: 0 }, 5).round(0)).toEqual(
        new Point(1, 6),
      )
    })
  })

  describe('#reflection', () => {
    it('should return a point that is the reflection of me with the center of inversion in `ref` point.', () => {
      expect(new Point(1, 0).reflection({ x: 1, y: 1 }).round(0)).toEqual(
        new Point(1, 2),
      )
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

    it('shoule return `NAN` when any of the given point is null', () => {
      expect(new Point().cross(null as any, new Point(1, 2))).toBeNaN()
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

  describe('#equals', () => {
    it('should return the true when have same coord', () => {
      const p1 = new Point(4, 17)
      const p2 = p1.clone()
      expect(p1.equals(p2)).toBe(true)
    })
  })

  describe('#toJSON', () => {
    it('should return json-object', () => {
      const p1 = new Point(4, 17)
      const p2 = p1.toJSON()
      expect(p1.equals(p2)).toBe(true)
    })
  })

  describe('#toPolar', () => {
    it('should convert rectangular to polar coordinates.', () => {
      const p = new Point(4, 3).toPolar()
      expect(p.x).toBe(5)
    })
  })

  describe('#fromPolar', () => {
    it('should convert polar to rectangular coordinates.', () => {
      const p1 = new Point(4, 3).toPolar()
      const p2 = Point.fromPolar(p1.x, p1.y)
      expect(Math.round(p2.x)).toBe(4)
      expect(Math.round(p2.y)).toBe(3)

      const p3 = new Point(-4, 3).toPolar()
      const p4 = Point.fromPolar(p3.x, p3.y)
      expect(Math.round(p4.x)).toBe(-4)
      expect(Math.round(p4.y)).toBe(3)

      const p5 = new Point(4, -3).toPolar()
      const p6 = Point.fromPolar(p5.x, p5.y)
      expect(Math.round(p6.x)).toBe(4)
      expect(Math.round(p6.y)).toBe(-3)

      const p7 = new Point(-4, -3).toPolar()
      const p8 = Point.fromPolar(p7.x, p7.y)
      expect(Math.round(p8.x)).toBe(-4)
      expect(Math.round(p8.y)).toBe(-3)
    })
  })

  describe('#snapToGrid', () => {
    it('should snap to grid', () => {
      const p1 = new Point(4, 17)
      const p2 = p1.clone().snapToGrid(10)
      const p3 = p1.clone().snapToGrid(3, 5)
      expect(p2.x).toBe(0)
      expect(p2.y).toBe(20)
      expect(p3.x).toBe(3)
      expect(p3.y).toBe(15)
    })
  })
})
