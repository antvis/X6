import { PointArray } from '../../struct/point-array'
import { SVG } from '../svg/svg'
import { Line } from './line'

describe('Line', () => {
  describe('constructor()', () => {
    it('should create an instance of Line', () => {
      expect(new Line()).toBeInstanceOf(Line)
    })

    it('should create an instance with default points', () => {
      const line = Line.create()
      expect(line.attr('x1')).toEqual(0)
      expect(line.attr('y1')).toEqual(0)
      expect(line.attr('x2')).toEqual(0)
      expect(line.attr('y2')).toEqual(0)
    })

    it('should create an instance with given attributes', () => {
      expect(Line.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an instance with given points and attributes', () => {
      const line = Line.create(1, 2, 3, 4, { id: 'foo' })
      expect(line.id()).toEqual('foo')
      expect(line.attr('x1')).toEqual(1)
      expect(line.attr('y1')).toEqual(2)
      expect(line.attr('x2')).toEqual(3)
      expect(line.attr('y2')).toEqual(4)
    })

    it('should create an instance with given array of points and attributes', () => {
      const line = Line.create(
        [
          [1, 2],
          [3, 4],
        ],
        { id: 'foo' },
      )
      expect(line.id()).toEqual('foo')
      expect(line.attr('x1')).toEqual(1)
      expect(line.attr('y1')).toEqual(2)
      expect(line.attr('x2')).toEqual(3)
      expect(line.attr('y2')).toEqual(4)
    })
  })

  describe('toArray()', () => {
    it('should return an array containing the points of the line', () => {
      const line = Line.create()
      const array = line.plot(1, 2, 3, 4).toArray()
      expect(array).toEqual([
        [1, 2],
        [3, 4],
      ])
    })
  })

  describe('toPointArray()', () => {
    it('should return a PointArray containing the points of the line', () => {
      const line = Line.create()
      const array = line.plot(1, 2, 3, 4).toPointArray()
      expect(array).toBeInstanceOf(PointArray)
      expect(array.slice()).toEqual([
        [1, 2],
        [3, 4],
      ])
    })
  })

  describe('move()', () => {
    it('should move the line along x and y axis', () => {
      const svg = new SVG().appendTo(document.body)
      const line = svg.line(1, 2, 3, 4)
      line.move(50, 50)
      const bbox = line.bbox()
      expect(bbox.x).toEqual(50)
      expect(bbox.y).toEqual(50)
      expect(bbox.width).toEqual(2)
      expect(bbox.height).toEqual(2)
      svg.remove()
    })
  })

  describe('plot()', () => {
    it('should work as a getter', () => {
      const line = Line.create()
      expect(line.plot()).toEqual([
        [0, 0],
        [0, 0],
      ])
    })

    it('should plot line with points', () => {
      const line = Line.create()
      line.plot(1, 2, 3, 4)
      expect(line.attr('x1')).toEqual(1)
      expect(line.attr('y1')).toEqual(2)
      expect(line.attr('x2')).toEqual(3)
      expect(line.attr('y2')).toEqual(4)
    })

    it('should polt line with points string', () => {
      const line = Line.create('1, 2, 3, 4')
      expect(line.attr('x1')).toEqual(1)
      expect(line.attr('y1')).toEqual(2)
      expect(line.attr('x2')).toEqual(3)
      expect(line.attr('y2')).toEqual(4)
    })

    it('should polt line with points array', () => {
      const line = Line.create()
      line.plot([
        [1, 2],
        [3, 4],
      ])
      expect(line.attr('x1')).toEqual(1)
      expect(line.attr('y1')).toEqual(2)
      expect(line.attr('x2')).toEqual(3)
      expect(line.attr('y2')).toEqual(4)
    })

    it('should polt line with PointArray', () => {
      const line = Line.create()
      line.plot(
        new PointArray([
          [1, 2],
          [3, 4],
        ]),
      )
      expect(line.attr('x1')).toEqual(1)
      expect(line.attr('y1')).toEqual(2)
      expect(line.attr('x2')).toEqual(3)
      expect(line.attr('y2')).toEqual(4)
    })
  })

  describe('size()', () => {
    it('should set the size of the line', () => {
      const svg = new SVG().appendTo(document.body)
      const line = svg.line(1, 2, 3, 4)
      line.size(50, 50)
      const bbox = line.bbox()
      expect(bbox.x).toEqual(1)
      expect(bbox.y).toEqual(2)
      expect(bbox.width).toEqual(50)
      expect(bbox.height).toEqual(50)
      svg.remove()
    })

    it('should change the height proportionally', () => {
      const svg = new SVG().appendTo(document.body)
      const line = svg.line(1, 2, 3, 4)
      line.size(50, null)
      const bbox = line.bbox()
      expect(bbox.x).toEqual(1)
      expect(bbox.y).toEqual(2)
      expect(bbox.width).toEqual(50)
      expect(bbox.height).toEqual(50)
      svg.remove()
    })

    it('should change the width proportionally', () => {
      const svg = new SVG().appendTo(document.body)
      const line = svg.line(1, 2, 3, 4)
      line.size(null, 50)
      const bbox = line.bbox()
      expect(bbox.x).toEqual(1)
      expect(bbox.y).toEqual(2)
      expect(bbox.width).toEqual(50)
      expect(bbox.height).toEqual(50)
      svg.remove()
    })
  })

  describe('x()', () => {
    it(`should set the x value of the line and returns itself`, () => {
      const svg = new SVG().appendTo(document.body)
      const line = svg.line()

      expect(line.x(50)).toBe(line)
      expect(line.bbox().x).toBe(50)

      svg.remove()
    })

    it(`should get the x value of the line`, () => {
      const svg = new SVG().appendTo(document.body)
      const line = svg.line()
      expect(line.x(50).x()).toBe(50)

      svg.remove()
    })
  })

  describe('y()', () => {
    it(`should set the y value of the lineand returns itself`, () => {
      const svg = new SVG().appendTo(document.body)
      const line = svg.line()
      expect(line.y(50)).toBe(line)
      expect(line.bbox().y).toBe(50)

      svg.remove()
    })

    it(`should get the y value of the line`, () => {
      const svg = new SVG().appendTo(document.body)
      const line = svg.line()
      expect(line.y(50).y()).toBe(50)

      svg.remove()
    })
  })

  describe('width()', () => {
    it(`should set the width of the lineand returns itself`, () => {
      const svg = new SVG().appendTo(document.body)
      const line = svg.line(1, 2, 3, 4)
      expect(line.width(50)).toBe(line)
      expect(line.bbox().width).toBe(50)

      svg.remove()
    })

    it(`should get the width of the line`, () => {
      const svg = new SVG().appendTo(document.body)
      const line = svg.line(1, 2, 3, 4)
      expect(line.width(50).width()).toBe(50)

      svg.remove()
    })
  })

  describe('height()', () => {
    it(`should set the height of the lineand returns itself`, () => {
      const svg = new SVG().appendTo(document.body)
      const line = svg.line(1, 2, 3, 4)
      expect(line.height(50)).toBe(line)
      expect(line.bbox().height).toBe(50)

      svg.remove()
    })

    it(`should get the height of the line`, () => {
      const svg = new SVG().appendTo(document.body)
      const line = svg.line(1, 2, 3, 4)
      expect(line.height(50).height()).toBe(50)

      svg.remove()
    })
  })
})
