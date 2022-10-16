import { Line, Point, Rectangle } from '..'

describe('Line', () => {
  describe('#constructor', () => {
    it('should create a line instance', () => {
      expect(new Line()).toBeInstanceOf(Line)
      expect(new Line([1, 1], [2, 2])).toBeInstanceOf(Line)
      expect(new Line(1, 1, 2, 2)).toBeInstanceOf(Line)
      expect(new Line({ x: 1, y: 1 }, { x: 2, y: 2 })).toBeInstanceOf(Line)
    })
  })

  describe('#Line.isLine', () => {
    it('should return true when the given object a line instance', () => {
      expect(Line.isLine(new Line(1, 2, 3, 4))).toBeTruthy()
    })

    it('should return false when the given object is not a line instance', () => {
      expect(Line.isLine({ x: 1, y: 1 })).toBeFalsy()
    })
  })

  describe('#getCenter', () => {
    it('should return the center of the line', () => {
      const line = new Line(2, 2, 4, 4)
      expect(line.getCenter().toJSON()).toEqual({ x: 3, y: 3 })
    })
  })

  describe('#round', () => {
    it('should round x and y properties to the given precision', () => {
      const line = new Line(17.231, 4.01, 5.123, 3.75)
      line.round(2)
      expect(line.toJSON()).toEqual({
        start: { x: 17.23, y: 4.01 },
        end: { x: 5.12, y: 3.75 },
      })

      line.round()
      expect(line.toJSON()).toEqual({
        start: { x: 17, y: 4 },
        end: { x: 5, y: 4 },
      })
    })
  })

  describe('#translate', () => {
    it('should translate line by adding the given dx and dy values respectively', () => {
      const line = new Line(1, 2, 3, 4)
      line.translate(2, 3)
      expect(line.toJSON()).toEqual({
        start: { x: 3, y: 5 },
        end: { x: 5, y: 7 },
      })

      line.translate(new Point(-2, 4))
      expect(line.toJSON()).toEqual({
        start: { x: 1, y: 9 },
        end: { x: 3, y: 11 },
      })
    })
  })

  describe('#scale', () => {
    it('should scale line with the given amount', () => {
      expect(new Line(1, 2, 3, 4).scale(2, 3).serialize()).toEqual('2 6 6 12')
    })

    it('should scale line with the given amount and center ', () => {
      expect(
        new Line(1, 2, 3, 4).scale(2, 3, new Point(40, 45)).serialize(),
      ).toEqual('-38 -84 -34 -78')
    })
  })

  describe('#rotate', () => {
    const rotate = (line: Line, angle: number, center?: Point) =>
      line.clone().rotate(angle, center).round(3).serialize()

    it('should rotate the line', () => {
      const line = new Line(1, 2, 3, 4)
      let angle

      const zeroPoint = new Point(0, 0)
      const arbitraryPoint = new Point(14, 6)

      angle = 0
      expect(rotate(line, angle)).toEqual('1 2 3 4')
      expect(rotate(line, angle, zeroPoint)).toEqual('1 2 3 4')
      expect(rotate(line, angle, arbitraryPoint)).toEqual('1 2 3 4')

      angle = 154
      expect(rotate(line, angle)).toEqual('-0.022 -2.236 -0.943 -4.91')
      expect(rotate(line, angle, zeroPoint)).toEqual(
        '-0.022 -2.236 -0.943 -4.91',
      )
      expect(rotate(line, angle, arbitraryPoint)).toEqual(
        '23.931 15.294 23.01 12.62',
      )
    })
  })

  describe('#length', () => {
    it('should return the length of the line', () => {
      expect(new Line(0, 0, 0, 0).length()).toEqual(0)
      expect(new Line(0, 0, 3, 4).length()).toEqual(5)
    })
  })

  describe('#squaredLength', () => {
    it('should return the squared length of the line', () => {
      expect(new Line(0, 0, 0, 0).squaredLength()).toEqual(0)
      expect(new Line(0, 0, 3, 4).squaredLength()).toEqual(25)
    })
  })

  describe('#setLength', () => {
    it('should set the length of the line by scale the line', () => {
      expect(new Line(0, 0, 0, 0).setLength(100).serialize()).toEqual('0 0 0 0')
      expect(new Line(0, 0, 3, 4).setLength(10).serialize()).toEqual('0 0 6 8')
    })
  })

  describe('#parallel', () => {
    it('should return the parallel line', () => {
      expect(new Line(0, 0, 2, 0).parallel(10).round().serialize()).toEqual(
        '0 10 2 10',
      )

      expect(new Line(0, 0, 0, 2).parallel(10).round().serialize()).toEqual(
        '-10 0 -10 2',
      )
    })

    it('should return the the cloned line when the line is undifferentiable', () => {
      expect(new Line(3, 3, 3, 3).parallel(10).serialize()).toEqual('3 3 3 3')
    })
  })

  describe('#vector', () => {
    it('should return the vector of the line with length equal to length of the line', () => {
      expect(new Line(1, 2, 3, 4).vector().toJSON()).toEqual({ x: 2, y: 2 })
    })
  })

  describe('#angle', () => {
    it('should return the angle of incline of the line', () => {
      expect(new Line(0, 0, 0, 1).angle()).toEqual(90)
    })

    it('should return `NaN` if the start and end endpoints of the line both lie at the same coordinates', () => {
      expect(new Line(0, 0, 0, 0).angle()).toBeNaN()
      expect(new Line(1, 2, 1, 2).angle()).toBeNaN()
    })
  })

  describe('#bbox', () => {
    it('should return a rectangle that is the bounding box of the line', () => {
      const bbox = new Line(1, 2, 3, 4).bbox()
      expect(bbox).toBeInstanceOf(Rectangle)
      expect(bbox.toJSON()).toEqual({ x: 1, y: 2, width: 2, height: 2 })
    })
  })

  describe('#bearing', () => {
    it('should return the bearing (cardinal direction) of the line', () => {
      expect(new Line(0, 0, 1, 0).bearing()).toEqual('E')
      expect(new Line(0, 0, 0, 1).bearing()).toEqual('N')
      expect(new Line(0, 0, 0, -1).bearing()).toEqual('S')
      expect(new Line(0, 0, -1, 0).bearing()).toEqual('W')
      expect(new Line(0, 0, 2, 1).bearing()).toEqual('NE')
      expect(new Line(0, 0, 2, -1).bearing()).toEqual('SE')
      expect(new Line(0, 0, -2, 1).bearing()).toEqual('NW')
      expect(new Line(0, 0, -2, -1).bearing()).toEqual('SW')
    })
  })

  describe('#closestPoint', () => {
    it('should return the point on the line that lies closest to point `p`', () => {
      const line = new Line(10, 0, 20, 0)
      expect(line.closestPoint([15, 0]).toJSON()).toEqual({ x: 15, y: 0 })
      expect(line.closestPoint([15, 20]).toJSON()).toEqual({ x: 15, y: 0 })
      expect(line.closestPoint([15, -20]).toJSON()).toEqual({ x: 15, y: 0 })
      expect(line.closestPoint([20, 10]).toJSON()).toEqual({ x: 20, y: 0 })
      expect(line.closestPoint([0, 10]).toJSON()).toEqual({ x: 10, y: 0 })
      expect(line.closestPoint([30, 10]).toJSON()).toEqual({ x: 20, y: 0 })
      expect(line.closestPoint([-10, 10]).toJSON()).toEqual({ x: 10, y: 0 })
    })
  })

  describe('#closestPointLength', () => {
    it('should return the length of the line up to the point that lies closest to point `p`', () => {
      const line = new Line(10, 0, 20, 0)
      expect(line.closestPointLength([15, 0])).toEqual(5)
      expect(line.closestPointLength([15, 20])).toEqual(5)
      expect(line.closestPointLength([15, -20])).toEqual(5)
      expect(line.closestPointLength([20, 10])).toEqual(10)
      expect(line.closestPointLength([0, 10])).toEqual(0)
      expect(line.closestPointLength([30, 10])).toEqual(10)
      expect(line.closestPointLength([-10, 10])).toEqual(0)
    })
  })

  describe('#closestPointTangent', () => {
    it('should return a line that is tangent to the line at the point that lies closest to point `p`', () => {
      const line = new Line(10, 0, 20, 0)
      const tangent = (x: number, y: number) =>
        line.closestPointTangent({ x, y })?.serialize()
      expect(tangent(15, 0)).toEqual('15 0 25 0')
      expect(tangent(15, 20)).toEqual('15 0 25 0')
      expect(tangent(15, -20)).toEqual('15 0 25 0')
      expect(tangent(20, 10)).toEqual('20 0 30 0')
      expect(tangent(0, 10)).toEqual('10 0 20 0')
      expect(tangent(30, 10)).toEqual('20 0 30 0')
      expect(tangent(-10, 10)).toEqual('10 0 20 0')
    })
  })

  describe('#closestPointNormalizedLength', () => {
    it('should return the normalized length (distance from the start of the line / total line length) of the line up to the point that lies closest to point', () => {
      const line = new Line(10, 0, 20, 0)
      const length = (x: number, y: number) =>
        line.closestPointNormalizedLength({ x, y })
      expect(length(15, 0)).toEqual(0.5)
      expect(length(15, 20)).toEqual(0.5)
      expect(length(15, -20)).toEqual(0.5)
      expect(length(20, 10)).toEqual(1)
      expect(length(0, 10)).toEqual(0)
      expect(length(30, 10)).toEqual(1)
      expect(length(-10, 10)).toEqual(0)
    })

    it('should return o when the line has zero length', () => {
      expect(new Line(1, 2, 1, 2).closestPointNormalizedLength([1, 1])).toEqual(
        0,
      )
    })
  })

  describe('#pointAt', () => {
    it('should return a point at given length ratio', () => {
      const line = new Line(0, 0, 100, 0)
      expect(line.pointAt(0.4).toJSON()).toEqual({ x: 40, y: 0 })
      expect(line.pointAt(-1).toJSON()).toEqual({ x: 0, y: 0 })
      expect(line.pointAt(10).toJSON()).toEqual({ x: 100, y: 0 })
    })
  })

  describe('#pointAtLength', () => {
    it('should return a point on the line that lies length away from the beginning of the line', () => {
      const line = new Line(0, 0, 100, 0)
      expect(line.pointAtLength(40).toJSON()).toEqual({ x: 40, y: 0 })
      expect(line.pointAtLength(1000).toJSON()).toEqual({ x: 100, y: 0 })
      expect(line.pointAtLength(-40).toJSON()).toEqual({ x: 60, y: 0 })
      expect(line.pointAtLength(-1000).toJSON()).toEqual({ x: 0, y: 0 })
    })
  })

  describe('#divideAt', () => {
    it('should return an array with two lines, divided at provided `ratio`', () => {
      const line = new Line(10, 0, 20, 0)

      let lines = line.divideAt(0.5)
      expect(lines[0]).toBeInstanceOf(Line)
      expect(lines[1]).toBeInstanceOf(Line)
      expect(lines[0].serialize()).toEqual('10 0 15 0')
      expect(lines[1].serialize()).toEqual('15 0 20 0')

      lines = line.divideAt(0)
      expect(lines[0].serialize()).toEqual('10 0 10 0')
      expect(lines[1].serialize()).toEqual('10 0 20 0')

      lines = line.divideAt(-1)
      expect(lines[0].serialize()).toEqual('10 0 10 0')
      expect(lines[1].serialize()).toEqual('10 0 20 0')

      lines = line.divideAt(1)
      expect(lines[0].serialize()).toEqual('10 0 20 0')
      expect(lines[1].serialize()).toEqual('20 0 20 0')

      lines = line.divideAt(10)
      expect(lines[0].serialize()).toEqual('10 0 20 0')
      expect(lines[1].serialize()).toEqual('20 0 20 0')
    })
  })

  describe('#divideAtLength', () => {
    it('should return an array with two lines, divided at provided `length`', () => {
      const line = new Line(10, 0, 20, 0)
      let lines = line.divideAtLength(5)
      expect(lines[0]).toBeInstanceOf(Line)
      expect(lines[1]).toBeInstanceOf(Line)
      expect(lines[0].serialize()).toEqual('10 0 15 0')
      expect(lines[1].serialize()).toEqual('15 0 20 0')

      lines = line.divideAtLength(-5)
      expect(lines[0].serialize()).toEqual('10 0 15 0')
      expect(lines[1].serialize()).toEqual('15 0 20 0')

      lines = line.divideAtLength(0)
      expect(lines[0].serialize()).toEqual('10 0 10 0')
      expect(lines[1].serialize()).toEqual('10 0 20 0')

      lines = line.divideAtLength(100)
      expect(lines[0].serialize()).toEqual('10 0 20 0')
      expect(lines[1].serialize()).toEqual('20 0 20 0')

      lines = line.divideAtLength(-100)
      expect(lines[0].serialize()).toEqual('10 0 10 0')
      expect(lines[1].serialize()).toEqual('10 0 20 0')
    })
  })

  describe('#containsPoint', () => {
    it('should return true if point lies on the line', () => {
      const line = new Line(10, 0, 20, 0)
      expect(line.containsPoint({ x: 10, y: 0 })).toEqual(true)
      expect(line.containsPoint({ x: 15, y: 0 })).toEqual(true)
      expect(line.containsPoint({ x: 20, y: 0 })).toEqual(true)
    })

    it('should return false if point do not lie on the line', () => {
      const line = new Line(10, 0, 20, 0)
      expect(line.containsPoint({ x: 5, y: 0 })).toEqual(false)
      expect(line.containsPoint({ x: 15, y: 10 })).toEqual(false)
      expect(line.containsPoint({ x: 25, y: 0 })).toEqual(false)
    })
  })

  describe('#intersect', () => {
    it('should return an intersection point for the line', () => {
      const line1 = new Line(2, 4, 5, 1)
      const line2 = new Line(2, 1, 5, 4)
      const line3 = new Line(0, 2, 2, 8)
      expect(line1.intersect(line2)![0].serialize()).toEqual('3.5 2.5')
      expect(line1.intersect(line3)).toBeNull()
    })

    it('should return null for a rectangle that does not intersect the line', () => {
      const line = new Line(0, 0, 0, -10)
      const rect = new Rectangle(10, 20, 30, 40)
      expect(line.intersect(rect)).toBeNull()
    })

    it('should return one intersection point with the rectangle', () => {
      const rect = new Rectangle(-10, -20, 30, 40)
      const line = new Line(0, 0, 20, 0)
      const points = line.intersect(rect)!
      expect(points.length).toEqual(1)
      expect(points[0].serialize()).toEqual('20 0')
    })

    it('should return one intersection points with the rectangle', () => {
      const rect = new Rectangle(-10, -20, 30, 40)
      const line = new Line(-20, 0, 20, 0)
      const points = line.intersect(rect)!
      expect(points.length).toEqual(2)
      expect(points[0].serialize()).toEqual('20 0')
      expect(points[1].serialize()).toEqual('-10 0')
    })
  })

  describe('#intersectsWithLine', () => {
    it('should return an intersection point for the line', () => {
      const line1 = new Line(0, 0, 8, 0)
      const line2 = new Line(4, 4, 4, -4)
      const line3 = new Line(0, 2, 2, 8)
      expect(line1.intersectsWithLine(line2)!.serialize()).toEqual('4 0')
      expect(line1.intersectsWithLine(line3)).toBeNull()
    })
  })

  describe('#isDifferentiable', () => {
    it('should return true if the line is differentiable', () => {
      expect(new Line(1, 2, 3, 4).isDifferentiable()).toEqual(true)
    })

    it('should return false if the line is undifferentiable', () => {
      expect(new Line(0, 0, 0, 0).isDifferentiable()).toEqual(false)
      expect(new Line(1, 2, 1, 2).isDifferentiable()).toEqual(false)
    })
  })

  describe('#pointOffset', () => {
    it('should return the perpendicular distance', () => {
      const offset = (
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        x: number,
        y: number,
      ) => new Line(x1, y1, x2, y2).pointOffset({ x, y })
      expect(offset(0, 0, 1, 0, 50, 0)).toEqual(0)
      expect(offset(0, 0, 10, 0, 50, 10)).toEqual(10)
      expect(offset(0, 0, 100, 0, 50, -10)).toEqual(-10)
    })
  })

  describe('#pointSquaredDistance', () => {
    it('should renturn the squared distance between the line and the point', () => {
      const line = new Line(0, 0, 10, 0)
      expect(line.pointSquaredDistance(2, 2)).toEqual(4)
      expect(line.pointSquaredDistance(2, 0)).toEqual(0)
      expect(line.pointSquaredDistance(2, -2)).toEqual(4)
    })
  })

  describe('#pointDistance', () => {
    it('should renturn the distance between the line and the point', () => {
      const line = new Line(0, 0, 10, 0)
      expect(line.pointDistance(2, 2)).toEqual(2)
      expect(line.pointDistance(2, 0)).toEqual(0)
      expect(line.pointDistance(2, -2)).toEqual(2)
    })
  })

  describe('#tangentAt', () => {
    it('should return null when line is undifferentiable', () => {
      expect(new Line(10, 10, 10, 10).tangentAt(0.5)).toBeNull()
    })

    it('should return a line tangent to line at given length ratio', () => {
      const line = new Line(10, 10, 20, 20)
      expect(line.tangentAt(0.4)?.serialize()).toEqual('14 14 24 24')
      expect(line.tangentAt(-1)?.serialize()).toEqual('10 10 20 20')
      expect(line.tangentAt(10)?.serialize()).toEqual('20 20 30 30')
    })
  })

  describe('#tangentAtLength', () => {
    it('should return null when line is undifferentiable', () => {
      expect(new Line(10, 10, 10, 10).tangentAtLength(5)).toBeNull()
    })

    it('should return a line tangent to line at given length', () => {
      const line = new Line(10, 10, 20, 20)
      expect(line.tangentAtLength(4)?.round(2).serialize()).toEqual(
        '12.83 12.83 22.83 22.83',
      )
      expect(line.tangentAtLength(1000)?.round(2).serialize()).toEqual(
        '20 20 30 30',
      )
      expect(line.tangentAtLength(-4)?.round(2).serialize()).toEqual(
        '17.17 17.17 27.17 27.17',
      )
      expect(line.tangentAtLength(-1000)?.round(2).serialize()).toEqual(
        '10 10 20 20',
      )
    })
  })

  describe('#relativeCcw', () => {
    it('should return 1 if the given point on the right side of the segment', () => {
      expect(new Line(10, 10, 20, 20).relativeCcw(20, 15)).toEqual(1)
    })

    it('should return 0 if its on the segment', () => {
      expect(new Line(10, 10, 20, 20).relativeCcw(15, 15)).toEqual(0)
    })

    it('should return -1 if the point is on the left side of the segment', () => {
      expect(new Line(10, 10, 20, 20).relativeCcw(15, 20)).toEqual(-1)
    })
  })

  describe('#equals', () => {
    it('should return true when the given lines has the same start and end points', () => {
      expect(new Line(1, 2, 3, 4).equals(new Line([1, 2], [3, 4]))).toEqual(
        true,
      )
    })

    it('should return false when the given lines has different start or end point', () => {
      expect(new Line(1, 2, 3, 4).equals(new Line([1, 2], [3, 40]))).toEqual(
        false,
      )
    })
  })
})
