import { Ellipse } from './ellipse'
import { Line } from './line'
import { Point } from './point'
import { Rectangle } from './rectangle'

describe('rectangle', () => {
  describe('#constructor', () => {
    it('should create a rectangle instance', () => {
      expect(new Rectangle()).toBeInstanceOf(Rectangle)
      expect(new Rectangle(1)).toBeInstanceOf(Rectangle)
      expect(new Rectangle(1, 2)).toBeInstanceOf(Rectangle)
      expect(new Rectangle(1, 2).x).toEqual(1)
      expect(new Rectangle(1, 2).y).toEqual(2)
      expect(new Rectangle(1, 2).width).toEqual(0)
      expect(new Rectangle(1, 2).height).toEqual(0)
      expect(new Rectangle().equals(new Rectangle(0, 0, 0, 0)))
    })

    it('should work with key points', () => {
      const rect = new Rectangle(1, 2, 3, 4)
      expect(rect.origin.equals({ x: 1, y: 2 })).toBeTrue()
      expect(rect.topLeft.equals({ x: 1, y: 2 })).toBeTrue()
      expect(rect.topCenter.equals({ x: 2.5, y: 2 })).toBeTrue()
      expect(rect.topRight.equals({ x: 4, y: 2 })).toBeTrue()
      expect(rect.center.equals({ x: 2.5, y: 4 })).toBeTrue()
      expect(rect.bottomLeft.equals({ x: 1, y: 6 })).toBeTrue()
      expect(rect.bottomCenter.equals({ x: 2.5, y: 6 })).toBeTrue()
      expect(rect.bottomRight.equals({ x: 4, y: 6 })).toBeTrue()
      expect(rect.corner.equals({ x: 4, y: 6 })).toBeTrue()
      expect(rect.leftMiddle.equals({ x: 1, y: 4 })).toBeTrue()
      expect(rect.rightMiddle.equals({ x: 4, y: 4 })).toBeTrue()
    })

    it('should return the key points', () => {
      const rect = new Rectangle(1, 2, 3, 4)
      expect(rect.getOrigin().equals({ x: 1, y: 2 })).toBeTrue()
      expect(rect.getTopLeft().equals({ x: 1, y: 2 })).toBeTrue()
      expect(rect.getTopCenter().equals({ x: 2.5, y: 2 })).toBeTrue()
      expect(rect.getTopRight().equals({ x: 4, y: 2 })).toBeTrue()
      expect(rect.getCenter().equals({ x: 2.5, y: 4 })).toBeTrue()
      expect(rect.getBottomLeft().equals({ x: 1, y: 6 })).toBeTrue()
      expect(rect.getBottomCenter().equals({ x: 2.5, y: 6 })).toBeTrue()
      expect(rect.getBottomRight().equals({ x: 4, y: 6 })).toBeTrue()
      expect(rect.getCorner().equals({ x: 4, y: 6 })).toBeTrue()
      expect(rect.getLeftMiddle().equals({ x: 1, y: 4 })).toBeTrue()
      expect(rect.getRightMiddle().equals({ x: 4, y: 4 })).toBeTrue()

      expect(rect.getCenterX()).toEqual(2.5)
      expect(rect.getCenterY()).toEqual(4)
    })

    it('should work with key lines', () => {
      const rect = new Rectangle(1, 2, 3, 4)
      expect(rect.topLine.equals(new Line(1, 2, 4, 2)))
      expect(rect.rightLine.equals(new Line(4, 2, 4, 6)))
      expect(rect.bottomLine.equals(new Line(1, 6, 4, 6)))
      expect(rect.leftLine.equals(new Line(1, 2, 1, 6)))
    })

    it('should return the key lines', () => {
      const rect = new Rectangle(1, 2, 3, 4)
      expect(rect.getTopLine().equals(new Line(1, 2, 4, 2)))
      expect(rect.getRightLine().equals(new Line(4, 2, 4, 6)))
      expect(rect.getBottomLine().equals(new Line(1, 6, 4, 6)))
      expect(rect.getLeftLine().equals(new Line(1, 2, 1, 6)))
    })
  })

  describe('#Rectangle.clone', () => {
    it('should clone rectangle', () => {
      const obj = { x: 1, y: 2, width: 3, height: 4 }
      expect(Rectangle.clone(new Rectangle(1, 2, 3, 4)).toJSON()).toEqual(obj)
      expect(Rectangle.clone(obj).toJSON()).toEqual(obj)
      expect(Rectangle.clone([1, 2, 3, 4]).toJSON()).toEqual(obj)
    })
  })

  describe('#Rectangle.isRectangleLike', () => {
    it('should return true if the given object is a rectangle-like object', () => {
      const obj = { x: 1, y: 2, width: 3, height: 4 }
      expect(Rectangle.isRectangleLike(obj)).toBeTrue()
      expect(Rectangle.isRectangleLike({ ...obj, z: 10 })).toBeTrue()
      expect(Rectangle.isRectangleLike({ ...obj, z: 10, s: 's' })).toBeTrue()
    })

    it('should return false if the given object is a rectangle-like object', () => {
      expect(Rectangle.isRectangleLike({ x: 1 })).toBeFalse()
      expect(Rectangle.isRectangleLike({ y: 2 })).toBeFalse()
      expect(Rectangle.isRectangleLike({})).toBeFalse()
      expect(Rectangle.isRectangleLike(null)).toBeFalse()
      expect(Rectangle.isRectangleLike(false)).toBeFalse()
      expect(Rectangle.isRectangleLike(1)).toBeFalse()
      expect(Rectangle.isRectangleLike('s')).toBeFalse()
    })
  })

  describe('#Rectangle.fromSize', () => {
    it('should create a rectangle from the given size', () => {
      expect(Rectangle.fromSize({ width: 10, height: 8 }).toJSON()).toEqual({
        x: 0,
        y: 0,
        width: 10,
        height: 8,
      })
    })
  })

  describe('#Rectangle.fromPositionAndSize', () => {
    it('should create a rectangle from the given position and size', () => {
      expect(
        Rectangle.fromPositionAndSize(
          { x: 2, y: 5 },
          { width: 10, height: 8 },
        ).toJSON(),
      ).toEqual({
        x: 2,
        y: 5,
        width: 10,
        height: 8,
      })
    })
  })

  describe('#Rectangle.fromEllipse', () => {
    it('should create a rectangle from the given ellipse', () => {
      expect(Rectangle.fromEllipse(new Ellipse(1, 2, 3, 4)).toJSON()).toEqual({
        x: -2,
        y: -2,
        width: 6,
        height: 8,
      })
    })
  })

  describe('#valueOf', () => {
    it('should return JSON object', () => {
      const obj = { x: 1, y: 2, width: 3, height: 4 }
      const rect = Rectangle.create(obj)
      expect(rect.valueOf()).toEqual(obj)
    })
  })

  describe('#toString', () => {
    it('should return JSON string', () => {
      const obj = { x: 1, y: 2, width: 3, height: 4 }
      const rect = Rectangle.create(obj)
      expect(rect.toString()).toEqual(JSON.stringify(obj))
    })
  })

  describe('#bbox', () => {
    it('should return a rectangle that is the bounding box of the rectangle.', () => {
      const rect = new Rectangle(1, 2, 3, 4)
      expect(rect.bbox().equals(rect)).toBeTrue()
    })

    it('should rotate the rectangle if angle specified.', () => {
      const rect = new Rectangle(0, 0, 2, 4)
      expect(
        rect.bbox(90).round().equals(new Rectangle(-1, 1, 4, 2)),
      ).toBeTrue()
    })
  })

  describe('#add', () => {
    it('should add the given `rect` to me', () => {
      const rect = new Rectangle(1, 2, 3, 4)
      expect(rect.add(0, 0, 0, 0)).toEqual(new Rectangle(0, 0, 4, 6))
    })
  })

  describe('#update', () => {
    it('should update me with the given `rect`', () => {
      const rect = new Rectangle(1, 2, 3, 4)
      expect(rect.update(0, 0, 1, 1)).toEqual(new Rectangle(0, 0, 1, 1))
    })
  })

  describe('#inflate', () => {
    it('should inflate me with the given `amount`', () => {
      const rect = new Rectangle(1, 2, 3, 4)
      expect(rect.inflate(2)).toEqual(new Rectangle(-1, 0, 7, 8))
    })

    it('should inflate me with the given `dx` and `dy`', () => {
      const rect = new Rectangle(1, 2, 3, 4)
      expect(rect.inflate(2, 1)).toEqual(new Rectangle(-1, 1, 7, 6))
    })
  })

  describe('#snapToGrid', () => {
    it('should snap to grid', () => {
      const rect1 = new Rectangle(2, 6, 33, 44)
      const rect2 = rect1.clone().snapToGrid(10)
      const rect3 = rect1.clone().snapToGrid(3, 5)
      expect(rect2.equals({ x: 0, y: 10, width: 40, height: 40 })).toBeTrue()
      expect(rect3.equals({ x: 3, y: 5, width: 33, height: 45 })).toBeTrue()
    })
  })

  describe('#translate', () => {
    it('should translate x and y by adding the given `dx` and `dy` values respectively', () => {
      const rect = new Rectangle(1, 2, 3, 4)

      expect(rect.clone().translate(2, 3).toJSON()).toEqual({
        x: 3,
        y: 5,
        width: 3,
        height: 4,
      })

      expect(rect.clone().translate(new Point(-2, 4)).toJSON()).toEqual({
        x: -1,
        y: 6,
        width: 3,
        height: 4,
      })
    })
  })

  describe('#scale', () => {
    it('should scale point with the given amount', () => {
      expect(new Rectangle(1, 2, 3, 4).scale(2, 3).toJSON()).toEqual({
        x: 2,
        y: 6,
        width: 6,
        height: 12,
      })
    })

    it('should scale point with the given amount and center ', () => {
      expect(
        new Rectangle(20, 30, 10, 20).scale(2, 3, new Point(40, 45)).toJSON(),
      ).toEqual({ x: 0, y: 0, width: 20, height: 60 })
    })
  })

  describe('#rotate', () => {
    it('should rorate the rect by the given angle', () => {
      expect(new Rectangle(1, 2, 3, 4).rotate(180).round().toJSON()).toEqual({
        x: 1,
        y: 2,
        width: 3,
        height: 4,
      })
    })

    it('should keep the same when the given angle is `0`', () => {
      expect(new Rectangle(1, 2, 3, 4).rotate(0).toJSON()).toEqual({
        x: 1,
        y: 2,
        width: 3,
        height: 4,
      })
    })
  })

  describe('#rotate90', () => {
    it("should rorate the rect by 90deg around it's center", () => {
      expect(new Rectangle(1, 2, 3, 4).rotate90().toJSON()).toEqual({
        x: 0.5,
        y: 2.5,
        width: 4,
        height: 3,
      })
    })
  })

  describe('#getMaxScaleToFit', () => {
    it('should return the scale amount', () => {
      const scale1 = new Rectangle(1, 2, 3, 4).getMaxScaleToFit([5, 6, 7, 8])
      const scale2 = new Rectangle(1, 2, 3, 4).getMaxScaleToFit([0, 0, 7, 8])
      expect(scale1.sx.toFixed(2)).toEqual('0.16')
      expect(scale1.sy.toFixed(2)).toEqual('0.20')
      expect(scale2.sx.toFixed(2)).toEqual('0.33')
      expect(scale2.sy.toFixed(2)).toEqual('0.50')
    })
  })

  describe('#getMaxUniformScaleToFit', () => {
    it('should return the scale amount', () => {
      const s1 = new Rectangle(1, 2, 3, 4).getMaxUniformScaleToFit([5, 6, 7, 8])
      const s2 = new Rectangle(1, 2, 3, 4).getMaxUniformScaleToFit([0, 0, 7, 8])
      expect(s1.toFixed(2)).toEqual('0.16')
      expect(s2.toFixed(2)).toEqual('0.33')
    })
  })

  describe('#moveAndExpand', () => {
    it('should translate and expand me by the given `rect`', () => {
      expect(
        new Rectangle(1, 2, 3, 4)
          .moveAndExpand(new Rectangle(1, 2, 3, 4))
          .toJSON(),
      ).toEqual({ x: 2, y: 4, width: 6, height: 8 })

      expect(
        new Rectangle(1, 2, 3, 4).moveAndExpand(new Rectangle()).toJSON(),
      ).toEqual({ x: 1, y: 2, width: 3, height: 4 })
    })
  })

  describe('#containsPoint', () => {
    it('should return true when rect contains the given point', () => {
      expect(new Rectangle(50, 50, 100, 100).containsPoint(60, 60)).toBeTrue()
    })
  })

  describe('#containsRect', () => {
    it('should return true when rect is completely inside the other rect', () => {
      expect(
        new Rectangle(50, 50, 100, 100).containsRect(60, 60, 80, 80),
      ).toBeTrue()
    })

    it('should return true when rect is equal the other rect', () => {
      expect(
        new Rectangle(50, 50, 100, 100).containsRect({
          x: 50,
          y: 50,
          width: 100,
          height: 100,
        }),
      ).toBeTrue()
    })

    it('should return false when rect is not inside the other rect', () => {
      expect(
        new Rectangle(50, 50, 100, 100).containsRect(20, 20, 200, 200),
      ).toBeFalse()
      expect(
        new Rectangle(50, 50, 100, 100).containsRect(40, 40, 100, 100),
      ).toBeFalse()
      expect(
        new Rectangle(50, 50, 100, 100).containsRect(60, 60, 100, 40),
      ).toBeFalse()
      expect(
        new Rectangle(50, 50, 100, 100).containsRect(60, 60, 100, 100),
      ).toBeFalse()
      expect(
        new Rectangle(50, 50, 100, 100).containsRect(60, 60, 40, 100),
      ).toBeFalse()
    })

    it('should return false when one of the dimensions is `0`', () => {
      expect(
        new Rectangle(50, 50, 100, 100).containsRect(75, 75, 0, 0),
      ).toBeFalse()
      expect(new Rectangle(50, 50, 0, 0).containsRect(50, 50, 0, 0)).toBeFalse()
    })
  })

  describe('#intersectsWithRect', () => {
    it('should return the intersection', () => {
      // inside
      expect(
        new Rectangle(20, 20, 100, 100)
          .intersectsWithRect([40, 40, 20, 20])
          ?.toJSON(),
      ).toEqual({ x: 40, y: 40, width: 20, height: 20 })

      expect(
        new Rectangle(20, 20, 100, 100)
          .intersectsWithRect([0, 0, 100, 100])
          ?.toJSON(),
      ).toEqual({ x: 20, y: 20, width: 80, height: 80 })

      expect(
        new Rectangle(20, 20, 100, 100)
          .intersectsWithRect([40, 40, 100, 100])
          ?.toJSON(),
      ).toEqual({ x: 40, y: 40, width: 80, height: 80 })
    })

    it('should return null when no intersection', () => {
      expect(
        new Rectangle(20, 20, 100, 100).intersectsWithRect([140, 140, 20, 20]),
      ).toBeNull()
    })
  })

  describe('#intersectsWithLine', () => {
    it('should return the intersection points', () => {
      const points1 = new Rectangle(0, 0, 4, 4).intersectsWithLine(
        new Line(2, 2, 2, 8),
      )
      const points2 = new Rectangle(0, 0, 4, 4).intersectsWithLine(
        new Line(2, -2, 2, 8),
      )
      expect(Point.equalPoints(points1!, [{ x: 2, y: 4 }]))
      expect(
        Point.equalPoints(points2!, [
          { x: 2, y: 0 },
          { x: 2, y: 4 },
        ]),
      )
    })

    it('should return null when no intersection exists', () => {
      expect(
        new Rectangle(0, 0, 4, 4).intersectsWithLine(new Line(-2, -2, -2, -8)),
      ).toBeNull()
    })
  })

  describe('#intersectsWithLineFromCenterToPoint', () => {
    it('should return the intersection point', () => {
      expect(
        new Rectangle(0, 0, 4, 4)
          .intersectsWithLineFromCenterToPoint([2, 8])
          ?.equals([2, 4]),
      ).toBeTrue()

      expect(
        new Rectangle(0, 0, 4, 4)
          .intersectsWithLineFromCenterToPoint([2, 8], 90)
          ?.round()
          .equals([2, 4]),
      ).toBeTrue()
    })

    it('should return null when no intersection exists', () => {
      expect(
        new Rectangle(0, 0, 4, 4).intersectsWithLineFromCenterToPoint([3, 3]),
      ).toBeNull()
    })
  })

  describe('#normalize', () => {
    it('should keep the same when width and height is positive', () => {
      expect(new Rectangle(1, 2, 3, 4).normalize().toJSON()).toEqual({
        x: 1,
        y: 2,
        width: 3,
        height: 4,
      })
    })

    it('should make the width positive', () => {
      expect(new Rectangle(1, 2, -3, 4).normalize().toJSON()).toEqual({
        x: -2,
        y: 2,
        width: 3,
        height: 4,
      })
    })

    it('should make the height positive', () => {
      expect(new Rectangle(1, 2, 3, -4).normalize().toJSON()).toEqual({
        x: 1,
        y: -2,
        width: 3,
        height: 4,
      })
    })
  })

  describe('#union', () => {})

  describe('#getNearestSideToPoint', () => {
    it('should return the nearest side to point when point is on the side', () => {
      const rect = new Rectangle(0, 0, 4, 4)
      expect(rect.getNearestSideToPoint({ x: 0, y: 0 })).toEqual('left')
      expect(rect.getNearestSideToPoint({ x: 4, y: 4 })).toEqual('right')
      expect(rect.getNearestSideToPoint({ x: 0, y: 4 })).toEqual('left')
      expect(rect.getNearestSideToPoint({ x: 4, y: 0 })).toEqual('right')
      expect(rect.getNearestSideToPoint({ x: 2, y: 0 })).toEqual('top')
      expect(rect.getNearestSideToPoint({ x: 0, y: 2 })).toEqual('left')
      expect(rect.getNearestSideToPoint({ x: 4, y: 2 })).toEqual('right')
      expect(rect.getNearestSideToPoint({ x: 2, y: 4 })).toEqual('bottom')
    })

    it('should return the nearest side to point when point is outside', () => {
      const rect = new Rectangle(0, 0, 4, 4)
      expect(rect.getNearestSideToPoint({ x: 5, y: 5 })).toEqual('right')
      expect(rect.getNearestSideToPoint({ x: 5, y: 4 })).toEqual('right')
      expect(rect.getNearestSideToPoint({ x: 5, y: 2 })).toEqual('right')
      expect(rect.getNearestSideToPoint({ x: 5, y: 0 })).toEqual('right')
      expect(rect.getNearestSideToPoint({ x: 5, y: -1 })).toEqual('right')
      expect(rect.getNearestSideToPoint({ x: -1, y: 5 })).toEqual('left')
      expect(rect.getNearestSideToPoint({ x: -1, y: 4 })).toEqual('left')
      expect(rect.getNearestSideToPoint({ x: -1, y: 2 })).toEqual('left')
      expect(rect.getNearestSideToPoint({ x: -1, y: 0 })).toEqual('left')
      expect(rect.getNearestSideToPoint({ x: -1, y: -1 })).toEqual('left')
      expect(rect.getNearestSideToPoint({ x: 0, y: 5 })).toEqual('bottom')
      expect(rect.getNearestSideToPoint({ x: 2, y: 5 })).toEqual('bottom')
      expect(rect.getNearestSideToPoint({ x: 4, y: 5 })).toEqual('bottom')
      expect(rect.getNearestSideToPoint({ x: 0, y: -1 })).toEqual('top')
      expect(rect.getNearestSideToPoint({ x: 2, y: -1 })).toEqual('top')
      expect(rect.getNearestSideToPoint({ x: 4, y: -1 })).toEqual('top')
    })

    it('should return the nearest side to point when point is inside', () => {
      const rect = new Rectangle(0, 0, 4, 4)
      expect(rect.getNearestSideToPoint({ x: 2, y: 1 })).toEqual('top')
      expect(rect.getNearestSideToPoint({ x: 3, y: 2 })).toEqual('right')
      expect(rect.getNearestSideToPoint({ x: 2, y: 3 })).toEqual('bottom')
      expect(rect.getNearestSideToPoint({ x: 1, y: 2 })).toEqual('left')
    })
  })

  describe('#getNearestPointToPoint', () => {
    it('should return the nearest point to point when point is inside the rect', () => {
      const rect = new Rectangle(0, 0, 4, 4)
      // left
      expect(rect.getNearestPointToPoint({ x: 1, y: 2 }).toJSON()).toEqual({
        x: 0,
        y: 2,
      })
      // right
      expect(rect.getNearestPointToPoint({ x: 3, y: 2 }).toJSON()).toEqual({
        x: 4,
        y: 2,
      })
      // top
      expect(rect.getNearestPointToPoint({ x: 2, y: 1 }).toJSON()).toEqual({
        x: 2,
        y: 0,
      })
      // bottom
      expect(rect.getNearestPointToPoint({ x: 2, y: 3 }).toJSON()).toEqual({
        x: 2,
        y: 4,
      })
    })

    it('should return the nearest point to point when point is outside the rect', () => {
      const rect = new Rectangle(0, 0, 4, 4)
      expect(rect.getNearestPointToPoint({ x: 5, y: 5 }).toJSON()).toEqual({
        x: 4,
        y: 4,
      })
      expect(rect.getNearestPointToPoint({ x: -1, y: -1 }).toJSON()).toEqual({
        x: 0,
        y: 0,
      })
    })
  })

  describe('#serialize', () => {
    it('should return the serialized string', () => {
      expect(new Rectangle(1, 2, 3, 4).serialize()).toEqual('1 2 3 4')
    })
  })
})
