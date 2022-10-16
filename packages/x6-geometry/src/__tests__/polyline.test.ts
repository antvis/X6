import { Line, Point, Polyline } from '..'

describe('Polyline', () => {
  describe('#constructor', () => {
    it('should create a new Polyline object', () => {
      const polyline = new Polyline()
      expect(polyline).toBeInstanceOf(Polyline)
      expect(Array.isArray(polyline.points)).toEqual(true)
      expect(polyline.points.length).toEqual(0)
    })

    it('should create a new Polyline object with empty array', () => {
      const polyline = new Polyline([])
      expect(polyline).toBeInstanceOf(Polyline)
      expect(Array.isArray(polyline.points)).toEqual(true)
      expect(polyline.points.length).toEqual(0)
    })

    it('should create a new Polyline object with points array', () => {
      const polyline = new Polyline([new Point(1, 1), new Point(2, 2)])
      expect(polyline).toBeInstanceOf(Polyline)
      expect(Array.isArray(polyline.points)).toEqual(true)
      expect(polyline.points.length).toEqual(2)
      expect(polyline.points[0].serialize()).toEqual('1 1')
      expect(polyline.points[1].serialize()).toEqual('2 2')
    })

    it('should create a new Polyline object with points data array', () => {
      const polyline = new Polyline([
        [1, 1],
        [2, 2],
      ])
      expect(polyline).toBeInstanceOf(Polyline)
      expect(Array.isArray(polyline.points)).toEqual(true)
      expect(polyline.points.length).toEqual(2)
      expect(polyline.points[0].serialize()).toEqual('1 1')
      expect(polyline.points[1].serialize()).toEqual('2 2')
    })

    it('should create a new Polyline object with empty string', () => {
      const polyline = new Polyline('')
      expect(polyline).toBeInstanceOf(Polyline)
      expect(Array.isArray(polyline.points)).toEqual(true)
      expect(polyline.points.length).toEqual(0)
    })

    it('should create a new Polyline object with points string', () => {
      const polyline = new Polyline('1,1 2,2')
      expect(polyline).toBeInstanceOf(Polyline)
      expect(Array.isArray(polyline.points)).toEqual(true)
      expect(polyline.points.length).toEqual(2)
      expect(polyline.points[0].serialize()).toEqual('1 1')
      expect(polyline.points[1].serialize()).toEqual('2 2')
    })
  })

  describe('Polyline.parse()', () => {
    it('should create a new Polyline object from empty string', () => {
      const polyline = Polyline.parse('')
      expect(polyline).toBeInstanceOf(Polyline)
      expect(Array.isArray(polyline.points)).toEqual(true)
      expect(polyline.points.length).toEqual(0)
    })

    it('should create a new Polyline object from empty string with whitespaces', () => {
      const polyline = Polyline.parse('   ')
      expect(polyline).toBeInstanceOf(Polyline)
      expect(Array.isArray(polyline.points)).toEqual(true)
      expect(polyline.points.length).toEqual(0)
    })

    it('should create a new Polyline object from svg points string', () => {
      const polyline = Polyline.parse('1,1 2,2')
      expect(polyline).toBeInstanceOf(Polyline)
      expect(Array.isArray(polyline.points)).toEqual(true)
      expect(polyline.points.length).toEqual(2)
      expect(polyline.points[0].serialize()).toEqual('1 1')
      expect(polyline.points[1].serialize()).toEqual('2 2')
    })

    it('should create a new Polyline object from points string', () => {
      const polyline = Polyline.parse('1 1 2 2')
      expect(polyline).toBeInstanceOf(Polyline)
      expect(Array.isArray(polyline.points)).toEqual(true)
      expect(polyline.points.length).toEqual(2)
      expect(polyline.points[0].serialize()).toEqual('1 1')
      expect(polyline.points[1].serialize()).toEqual('2 2')
    })
  })

  describe('Polyline.isPolyline()', () => {
    it('should return true when the given instance is a ployline', () => {
      expect(Polyline.isPolyline(new Polyline())).toEqual(true)
    })

    it('should return false when the given instance is not a ployline', () => {
      expect(Polyline.isPolyline(null)).toEqual(false)
      expect(Polyline.isPolyline(new Point())).toEqual(false)
    })
  })

  describe('#start', () => {
    it('should return null when polyline do not have any points', () => {
      const polyline = new Polyline()
      expect(polyline.start).toBeNull()
    })

    it('should return the first point of the polyline', () => {
      const polyline = new Polyline('1,1 2,2')
      expect(polyline.start?.serialize()).toEqual('1 1')
    })
  })

  describe('#end', () => {
    it('should return null when polyline do not have any points', () => {
      const polyline = new Polyline()
      expect(polyline.end).toBeNull()
    })

    it('should return the last point of the polyline', () => {
      const polyline = new Polyline('1,1 2,2')
      expect(polyline.end?.serialize()).toEqual('2 2')
    })
  })

  describe('#scale()', () => {
    it('should scale the polyline', () => {
      const polyline1 = new Polyline()
      const polyline2 = new Polyline([
        [10, 0],
        [10, 10],
        [20, 10],
        [20, 0],
        [10, 0],
      ])

      expect(polyline1.clone().scale(10, 10).serialize()).toEqual('')
      expect(
        polyline1.clone().scale(10, 10, new Point(10, 10)).serialize(),
      ).toEqual('')

      expect(polyline2.clone().scale(10, 10).serialize()).toEqual(
        '100 0 100 100 200 100 200 0 100 0',
      )
      expect(
        polyline2.clone().scale(10, 10, new Point(10, 10)).serialize(),
      ).toEqual('10 -90 10 10 110 10 110 -90 10 -90')
    })
  })

  describe('#rotate()', () => {
    it('should rotate the polyline', () => {
      const polyline1 = new Polyline()
      const polyline2 = new Polyline([
        [0, 0],
        [5, 5],
      ])

      expect(polyline1.clone().rotate(90).serialize()).toEqual('')
      expect(polyline2.clone().rotate(90).round(3).serialize()).toEqual(
        '0 0 5 -5',
      )
      expect(
        polyline2.clone().rotate(90, new Point(10, 10)).round(3).serialize(),
      ).toEqual('0 20 5 15')
    })
  })

  describe('#translate()', () => {
    it('should translate the polyline', () => {
      const polyline1 = new Polyline()
      const polyline2 = new Polyline([
        [10, 0],
        [10, 10],
        [20, 10],
        [20, 0],
        [10, 0],
      ])

      expect(polyline1.clone().translate(10, 10).serialize()).toEqual('')
      expect(polyline2.clone().translate(10, 10).serialize()).toEqual(
        '20 10 20 20 30 20 30 10 20 10',
      )
    })
  })

  describe('#bbox()', () => {
    it('should return an empty box when polyline do not have any points', () => {
      const polyline = new Polyline()
      const bbox = polyline.bbox()
      expect(bbox.serialize()).toEqual('0 0 0 0')
    })

    it('should return the tight bounding box of the polyline', () => {
      const polyline = new Polyline([
        [10, 10],
        [10, 40],
        [50, 40],
        [50, 10],
      ])
      const bbox = polyline.bbox()
      expect(bbox.serialize()).toEqual('10 10 40 30')
    })
  })

  describe('#clone()', () => {
    it('should return the cloned ellipse', () => {
      const polyline1 = new Polyline([
        [10, 10],
        [10, 40],
        [50, 40],
        [50, 10],
      ])
      const polyline2 = polyline1.clone()
      expect(polyline2).toBeInstanceOf(Polyline)
      expect(polyline1 === polyline2).toEqual(false)
      expect(polyline1.equals(polyline2)).toEqual(true)
      expect(polyline1.toString()).toEqual(polyline2.toString())
    })
  })

  describe('#closestPoint()', () => {
    it('should return a point closest to the given point', () => {
      const point = new Point(150, 150)

      const polyline1 = new Polyline('100 100')
      expect(polyline1.closestPoint(point)?.serialize()).toEqual('100 100')

      const polyline2 = new Polyline('100 100 100 100 100 100')
      expect(polyline2.closestPoint(point)?.serialize()).toEqual('100 100')

      const polyline3 = new Polyline('100 100 200 100')
      expect(polyline3.closestPoint(point)?.serialize()).toEqual('150 100')

      const polyline4 = new Polyline('100 100 200 200 300 100')
      expect(polyline4.closestPoint(point)?.serialize()).toEqual('150 150')

      const polyline5 = new Polyline('100 100 200 110 300 100')
      expect(polyline5.closestPoint(point)?.serialize()).toEqual(
        '154.45544554455446 105.44554455445544',
      )
    })
  })

  describe('#closestPointNormalizedLength()', () => {
    it('should return normalized length closest to a given point', () => {
      const point = new Point(150, 150)
      let polyline = new Polyline()
      expect(polyline.closestPointNormalizedLength(point)).toEqual(0)

      polyline = new Polyline([[100, 100]])
      expect(polyline.closestPointNormalizedLength(point)).toEqual(0)

      polyline = new Polyline([
        [100, 100],
        [100, 100],
        [100, 100],
      ])
      expect(polyline.closestPointNormalizedLength(point)).toEqual(0)

      polyline = new Polyline([
        [100, 100],
        [200, 100],
      ])
      expect(polyline.closestPointNormalizedLength(point)).toEqual(0.5)

      polyline = new Polyline([
        [100, 100],
        [200, 200],
        [300, 100],
      ])
      expect(polyline.closestPointNormalizedLength(point)).toEqual(0.25)

      polyline = new Polyline([
        [100, 100],
        [200, 110],
        [300, 100],
      ])
      expect(polyline.closestPointNormalizedLength(point)).toEqual(
        0.2722772277227723,
      )
    })
  })

  describe('#closestPointTangent()', () => {
    it('should return tangent at point closest to a given point', () => {
      const check = (points: Point.PointData[], d: string) => {
        expect(
          new Polyline(points)
            .closestPointTangent([150, 150])
            ?.round(3)
            .serialize(),
        ).toEqual(d)
      }

      check(
        [
          [100, 100],
          [200, 100],
        ],
        '150 100 250 100',
      )

      check(
        [
          [100, 100],
          [200, 200],
          [300, 100],
        ],
        '150 150 250 250',
      )

      check(
        [
          [100, 100],
          [200, 110],
          [300, 100],
        ],
        '154.455 105.446 254.455 115.446',
      )
    })
  })

  describe('#containsPoint()', () => {
    const polyline = new Polyline([
      [10, 0],
      [10, 30],
      [30, 10],
      [0, 10],
      [20, 30],
      [30, 20],
    ])

    it('should return true when the point lies on the vertex', () => {
      expect(polyline.containsPoint([10, 0])).toEqual(true)
      expect(polyline.containsPoint([10, 30])).toEqual(true)
      expect(polyline.containsPoint([30, 10])).toEqual(true)
      expect(polyline.containsPoint([0, 10])).toEqual(true)
      expect(polyline.containsPoint([20, 30])).toEqual(true)
      expect(polyline.containsPoint([30, 20])).toEqual(true)
    })

    it('should return true when the point lies on the line', () => {
      expect(polyline.containsPoint([15, 5])).toEqual(true)
    })

    it('should return true when the point lies on the line intersection', () => {
      expect(polyline.containsPoint([10, 10])).toEqual(true)
    })

    it('should return true when the point lies within polyline according to even-odd rule', () => {
      expect(polyline.containsPoint([13, 7])).toEqual(true)
    })

    it('should return false when the point lies outside', () => {
      expect(polyline.containsPoint([5, 5])).toEqual(false)
    })

    it('should return false when the point is self-intersection', () => {
      expect(polyline.containsPoint([15, 15])).toEqual(false)
    })

    it('should return false when the polyline has zero length', () => {
      expect(new Polyline().containsPoint([10, 10])).toEqual(false)
    })
  })

  describe('#intersectsWithLine()', () => {
    const polyline = new Polyline([
      [0, 0],
      [0, 10],
      [10, 10],
    ])
    it('should return null when the polyline do not intersect with the given line', () => {
      expect(
        polyline.intersectsWithLine(new Line([0, 20], [20, 20])),
      ).toBeNull()
    })

    it('should return all intersections', () => {
      const ret = polyline.intersectsWithLine(new Line([-5, 0], [15, 20]))!
      expect(ret.length).toEqual(2)
      expect(ret[0].serialize()).toEqual('0 5')
      expect(ret[1].serialize()).toEqual('5 10')
    })
  })

  describe('#isDifferentiable()', () => {
    it('should return true when the polyline is differentiable (can have tangents)', () => {
      expect(
        new Polyline([
          [100, 100],
          [200, 100],
        ]).isDifferentiable(),
      ).toEqual(true)

      expect(
        new Polyline([
          [100, 100],
          [200, 200],
          [300, 100],
        ]).isDifferentiable(),
      ).toEqual(true)
    })

    it('should return false when the polyline is undifferentiable (can have tangents)', () => {
      expect(new Polyline().isDifferentiable()).toEqual(false)
      expect(new Polyline([[100, 100]]).isDifferentiable()).toEqual(false)
      expect(
        new Polyline([
          [100, 100],
          [100, 100],
          [100, 100],
        ]).isDifferentiable(),
      ).toEqual(false)
    })
  })

  describe('#pointAt()', () => {
    it('should return null when the polyline the empty', () => {
      expect(new Polyline().pointAt(0.5)).toBeNull()
    })

    it('should return the only point when the polyline has only one point', () => {
      const polyline = new Polyline([[10, 10]])
      expect(polyline.pointAt(0.5)?.serialize()).toEqual('10 10')
      expect(polyline.pointAt(0)?.serialize()).toEqual('10 10')
      expect(polyline.pointAt(1)?.serialize()).toEqual('10 10')
      expect(polyline.pointAt(10)?.serialize()).toEqual('10 10')
      expect(polyline.pointAt(-1)?.serialize()).toEqual('10 10')
    })

    it('should return a point at given length ratio', () => {
      const polyline = new Polyline([
        [10, 0],
        [10, 10],
        [20, 10],
        [20, 0],
        [40, 0],
      ])
      expect(polyline.pointAt(0.4)?.serialize()).toEqual('20 10')
      expect(polyline.pointAt(-1)?.serialize()).toEqual('10 0')
      expect(polyline.pointAt(10)?.serialize()).toEqual('40 0')
    })
  })

  describe('#pointAtLength()', () => {
    it('should return null when the polyline the empty', () => {
      expect(new Polyline().pointAtLength(5)).toBeNull()
    })

    it('should return a point at given length', () => {
      const polyline = new Polyline([
        [10, 0],
        [10, 10],
        [20, 10],
        [20, 0],
        [40, 0],
      ])
      expect(polyline.pointAtLength(14)?.serialize()).toEqual('14 10')
      expect(polyline.pointAtLength(1000)?.serialize()).toEqual('40 0')
      expect(polyline.pointAtLength(-14)?.serialize()).toEqual('26 0')
      expect(polyline.pointAtLength(-1000)?.serialize()).toEqual('10 0')
    })
  })

  describe('#tangentAt()', () => {
    it('should return null when the polyline is empty', () => {
      expect(new Polyline().tangentAt(0)).toBeNull()
      expect(new Polyline().tangentAt(0.5)).toBeNull()
      expect(new Polyline().tangentAt(1)).toBeNull()
      expect(new Polyline().tangentAt(100)).toBeNull()
    })

    it('should return null when the polyline has only one point', () => {
      expect(new Polyline([[10, 10]]).tangentAt(0)).toBeNull()
      expect(new Polyline([[10, 10]]).tangentAt(0.5)).toBeNull()
      expect(new Polyline([[10, 10]]).tangentAt(1)).toBeNull()
      expect(new Polyline([[10, 10]]).tangentAt(100)).toBeNull()
    })

    it('should return line tangent to point at given length ratio', () => {
      const polyline = new Polyline([
        [10, 0],
        [10, 10],
        [20, 10],
        [20, 0],
        [10, 0],
      ])

      expect(polyline.tangentAt(0.4)?.serialize()).toEqual('16 10 26 10')
      expect(polyline.tangentAt(0.5)?.serialize()).toEqual('20 10 30 10')
      expect(polyline.tangentAt(-1)?.serialize()).toEqual('10 0 10 10')
      expect(polyline.tangentAt(10)?.serialize()).toEqual('10 0 0 0')
    })
  })

  describe('#tangentAtLength()', () => {
    it('should return null when the polyline is empty', () => {
      expect(new Polyline().tangentAtLength(5)).toBeNull()
      expect(new Polyline().tangentAtLength(-5)).toBeNull()
    })

    it('should return null when the polyline has only one point', () => {
      expect(new Polyline([[10, 10]]).tangentAtLength(5)).toBeNull()
      expect(new Polyline([[10, 10]]).tangentAtLength(-5)).toBeNull()
    })

    it('should return null when the polyline is undifferentiable', () => {
      expect(
        new Polyline([
          [100, 100],
          [100, 100],
        ]).tangentAtLength(100),
      ).toBeNull()
    })

    it('should return line tangent to point at given length', () => {
      const polyline = new Polyline([
        [10, 0],
        [10, 10],
        [20, 10],
        [20, 0],
        [10, 0],
      ])

      expect(polyline.tangentAtLength(14)?.serialize()).toEqual('14 10 24 10')
      expect(polyline.tangentAtLength(20)?.serialize()).toEqual('20 10 30 10')
      expect(polyline.tangentAtLength(1000)?.serialize()).toEqual('10 0 0 0')

      expect(polyline.tangentAtLength(-14)?.serialize()).toEqual('20 4 20 -6')
      expect(polyline.tangentAtLength(-20)?.serialize()).toEqual('20 10 20 0')
      expect(polyline.tangentAtLength(-1000)?.serialize()).toEqual('10 0 10 10')
    })
  })

  describe('#simplify()', () => {
    const check = (
      points: Point.PointData[],
      d: string,
      threshold?: number,
    ) => {
      expect(new Polyline(points).simplify({ threshold }).serialize()).toEqual(
        d,
      )
    }

    it('should simplify the polyline', () => {
      check(
        [
          [10, 0],
          [10, 0],
          [10, 10],
          [20, 10],
          [20, 10],
        ],
        '10 0 10 10 20 10',
      )

      check(
        [
          [10, 0],
          [10, 0],
          [10, 0],
        ],
        '10 0 10 0',
      )

      check([[10, 0]], '10 0')
      check([], '')
    })

    it('should simplify the polyline with precision', () => {
      check(
        [
          [10, 0],
          [10.1, 0],
          [10, 10],
          [9.9, 10],
          [20, 10.1],
          [20, 10],
        ],
        '10 0 9.9 10 20 10',
        0.1,
      )

      check(
        [
          [10, 0],
          [10.1, 0],
          [10, 0],
        ],
        '10 0 10 0',
        0.1,
      )

      check([[10, 0]], '10 0', 0.1)
      check([], '', 0.1)
    })
  })

  describe('#toHull()', () => {
    it('should return a convex hull', () => {
      expect(new Polyline().toHull().serialize()).toEqual('')
      expect(new Polyline('100 100').toHull().serialize()).toEqual('100 100')
      expect(new Polyline('100 100 200 100').toHull().serialize()).toEqual(
        '100 100 200 100',
      )

      expect(
        new Polyline('100 100 200 100 300 100').toHull().serialize(),
      ).toEqual('100 100 300 100')

      expect(
        new Polyline('200 100 100 100 300 100').toHull().serialize(),
      ).toEqual('100 100 300 100')

      expect(
        new Polyline('100 100 200 100 300 100 400 100').toHull().serialize(),
      ).toEqual('100 100 400 100')

      expect(
        new Polyline('200 100 100 100 300 100 400 100').toHull().serialize(),
      ).toEqual('100 100 400 100')

      expect(new Polyline('100 100 100 500').toHull().serialize()).toEqual(
        '100 100 100 500',
      )

      expect(
        new Polyline('100 100 100 500 500 500').toHull().serialize(),
      ).toEqual('100 100 500 500 100 500')

      expect(
        new Polyline('100 100 100 500 300 300 500 500 500 100')
          .toHull()
          .serialize(),
      ).toEqual('100 100 500 100 500 500 100 500')

      expect(
        new Polyline('100 100 200 100 300 200 300 200 300 300')
          .toHull()
          .serialize(),
      ).toEqual('100 100 200 100 300 200 300 300')

      expect(
        new Polyline('300 200 300 200 300 300 100 100 200 100')
          .toHull()
          .serialize(),
      ).toEqual('300 200 300 300 100 100 200 100')

      expect(
        new Polyline([
          [480, 80],
          [520, 80],
          [520, 120],
          [480, 120],
          [380, 80],
          [420, 80],
          [420, 120],
          [380, 120],
          [280, 80],
          [320, 80],
          [320, 120],
          [280, 120],
          [180, 80],
          [220, 80],
          [220, 120],
          [180, 120],
          [80, 80],
          [120, 80],
          [120, 120],
          [80, 120],
        ])
          .toHull()
          .serialize(),
      ).toEqual('520 80 520 120 80 120 80 80')

      expect(
        new Polyline([
          new Point(180, 80),
          new Point(220, 80),
          new Point(220, 120),
          new Point(180, 120),
          new Point(180, 280),
          new Point(220, 280),
          new Point(220, 320),
          new Point(180, 320),
          new Point(180, 380),
          new Point(220, 380),
          new Point(220, 420),
          new Point(180, 420),
          new Point(180, 180),
          new Point(220, 180),
          new Point(220, 220),
          new Point(180, 220),
          new Point(80, 380),
          new Point(120, 380),
          new Point(120, 420),
          new Point(80, 420),
        ])
          .toHull()
          .serialize(),
      ).toEqual('180 80 220 80 220 420 80 420 80 380')

      expect(
        new Polyline([
          new Point(80, 80),
          new Point(120, 80),
          new Point(120, 120),
          new Point(80, 120),
          new Point(180, 80),
          new Point(220, 80),
          new Point(220, 120),
          new Point(180, 120),
          new Point(180, 280),
          new Point(220, 280),
          new Point(220, 320),
          new Point(180, 320),
          new Point(180, 380),
          new Point(220, 380),
          new Point(220, 420),
          new Point(180, 420),
          new Point(180, 180),
          new Point(220, 180),
          new Point(220, 220),
          new Point(180, 220),
          new Point(80, 380),
          new Point(120, 380),
          new Point(120, 420),
          new Point(80, 420),
        ])
          .toHull()
          .serialize(),
      ).toEqual('80 80 220 80 220 420 80 420')

      expect(
        new Polyline([
          new Point(280, 280),
          new Point(320, 280),
          new Point(320, 320),
          new Point(280, 320),
          new Point(180, 280),
          new Point(220, 280),
          new Point(220, 320),
          new Point(180, 320),
          new Point(80, 180),
          new Point(120, 180),
          new Point(120, 220),
          new Point(80, 220),
          new Point(180, 80),
          new Point(220, 80),
          new Point(220, 120),
          new Point(180, 120),
          new Point(280, 80),
          new Point(320, 80),
          new Point(320, 120),
          new Point(280, 120),
          new Point(80, 80),
          new Point(120, 80),
          new Point(120, 120),
          new Point(80, 120),
          new Point(380, 80),
          new Point(420, 80),
          new Point(420, 120),
          new Point(380, 120),
        ])
          .toHull()
          .serialize(),
      ).toEqual('320 320 180 320 80 220 80 80 420 80 420 120')
    })
  })

  describe('#equals()', () => {
    it('should return true when the two polyline are the same', () => {
      expect(
        new Polyline([
          [1, 1],
          [2, 2],
        ]).equals(new Polyline('1 1 2 2')),
      ).toEqual(true)

      expect(new Polyline().equals(new Polyline())).toEqual(true)
      expect(new Polyline([]).equals(new Polyline(''))).toEqual(true)
    })

    it('should return false when the given polyline is null ', () => {
      expect(new Polyline().equals(null as any)).toEqual(false)
    })

    it('should return false when the given polyline do not have the same points count', () => {
      expect(
        new Polyline([
          [1, 1],
          [2, 2],
        ]).equals(new Polyline()),
      ).toEqual(false)
    })
  })
})
