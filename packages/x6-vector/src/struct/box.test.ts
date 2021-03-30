import { Global } from '../global'
import { Box } from './box'
import { Matrix } from './matrix'

const { objectContaining } = jasmine

describe('Box', () => {
  describe('static methods', () => {
    describe('isNull', () => {
      it('should return true if x, y, with and height is 0', () => {
        expect(Box.isNull({ x: 0, y: 0, width: 0, height: 0 })).toBe(true)
      })

      it('should returns false if one or more of x, y, with and height is not 0', () => {
        expect(Box.isNull({ x: 0, y: 0, width: 0, height: 1 })).toBe(false)
        expect(Box.isNull({ x: 0, y: 1, width: 0, height: 1 })).toBe(false)
      })
    })
  })

  describe('constructor()', () => {
    it('should create a new Box with empty args', () => {
      const box = new Box()
      expect(box).toBeInstanceOf(Box)
      expect(box).toEqual(
        objectContaining({
          width: 0,
          height: 0,
          x: 0,
          y: 0,
          w: 0,
          h: 0,
          cx: 0,
          cy: 0,
          x2: 0,
          y2: 0,
        }),
      )
    })

    it('should create a new Box with x y width and height', () => {
      expect(new Box(1, 2, 3, 4).toArray()).toEqual([1, 2, 3, 4])
    })

    it('should create a new Box with array input', () => {
      expect(new Box([1, 2, 3, 4]).toArray()).toEqual([1, 2, 3, 4])
    })

    it('should create a new Box with string input', () => {
      expect(new Box('1,2,3,4').toArray()).toEqual([1, 2, 3, 4])
    })

    it('should create a new box from parsed string with exponential values', () => {
      expect(new Box('-1.12e1 1e-2 +2e2 +.3e+4').toArray()).toEqual([
        -11.2,
        0.01,
        200,
        3000,
      ])
    })

    it('should create a new box with object input', () => {
      expect(new Box({ x: 1, y: 2, width: 3, height: 4 }).toArray()).toEqual([
        1,
        2,
        3,
        4,
      ])
    })

    it('should calculate all derived values correctly', () => {
      expect(new Box(2, 4, 6, 8)).toEqual(
        objectContaining({
          cx: 5,
          cy: 8,
          x2: 8,
          y2: 12,
          w: 6,
          h: 8,
        }),
      )
    })

    it('should create a new box with input with left instead of x and top instead of y', () => {
      expect(
        new Box({ left: 1, top: 2, width: 3, height: 4 }).toArray(),
      ).toEqual([1, 2, 3, 4])
    })
  })

  describe('addOffset()', () => {
    it('should return a new instance', () => {
      Global.withWindow({ pageXOffset: 50, pageYOffset: 25 } as any, () => {
        const box = new Box(100, 100, 100, 100)
        const box2 = box.addOffset()

        expect(box2).toBeInstanceOf(Box)
        expect(box2).not.toBe(box)
      })
    })

    it('should add the current page offset to the box', () => {
      Global.withWindow({ pageXOffset: 50, pageYOffset: 25 } as any, () => {
        const box = new Box(100, 100, 100, 100).addOffset()

        expect(box.toArray()).toEqual([150, 125, 100, 100])
      })
    })
  })

  describe('merge()', () => {
    it('should merge various bounding boxes', () => {
      const box1 = new Box(50, 50, 100, 100)
      const box2 = new Box(300, 400, 100, 100)
      const box3 = new Box(500, 100, 100, 100)
      const merged = box1.merge(box2).merge(box3)

      expect(merged.toArray()).toEqual([50, 50, 550, 450])
    })

    it('should return a new instance', () => {
      const box1 = new Box(50, 50, 100, 100)
      const box2 = new Box(300, 400, 100, 100)
      const merged = box1.merge(box2)

      expect(merged).toBeInstanceOf(Box)
      expect(merged === box1).toBe(false)
      expect(merged === box2).toBe(false)
    })
  })

  describe('transform()', () => {
    it('should transform the box with given matrix', () => {
      const box1 = new Box(50, 50, 100, 100).transform(
        new Matrix(1, 0, 0, 1, 20, 20),
      )
      const box2 = new Box(50, 50, 100, 100).transform(
        new Matrix(2, 0, 0, 2, 0, 0),
      )
      const box3 = new Box(-200, -200, 100, 100).transform(
        new Matrix(1, 0, 0, 1, -20, -20),
      )

      expect(box1.toArray()).toEqual([70, 70, 100, 100])
      expect(box2.toArray()).toEqual([100, 100, 200, 200])
      expect(box3.toArray()).toEqual([-220, -220, 100, 100])
    })

    it('should work with matrix like input', () => {
      const box1 = new Box(50, 50, 100, 100).transform(
        new Matrix(1, 0, 0, 1, 20, 20).toArray() as Matrix.MatrixArray,
      )
      const box2 = new Box(50, 50, 100, 100).transform(
        new Matrix(2, 0, 0, 2, 0, 0).toArray() as Matrix.MatrixArray,
      )
      const box3 = new Box(-200, -200, 100, 100).transform(
        new Matrix(1, 0, 0, 1, -20, -20).toArray() as Matrix.MatrixArray,
      )

      expect(box1.toArray()).toEqual([70, 70, 100, 100])
      expect(box2.toArray()).toEqual([100, 100, 200, 200])
      expect(box3.toArray()).toEqual([-220, -220, 100, 100])
    })
  })

  describe('toArray()', () => {
    it('should return an array representation of the box', () => {
      expect(new Box(1, 2, 3, 4).toArray()).toEqual([1, 2, 3, 4])
    })
  })

  describe('toString()', () => {
    it('should return a string representation of the box', () => {
      expect(new Box(1, 2, 3, 4).toString()).toBe('1 2 3 4')
    })
  })

  describe('isNull()', () => {
    it('should check if the box consists of only zeros', () => {
      expect(new Box().isNull()).toBe(true)
      expect(new Box(1, 2, 3, 4).isNull()).toBe(false)
    })
  })
})
