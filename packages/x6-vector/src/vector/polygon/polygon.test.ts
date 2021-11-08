import { G } from '../g/g'
import { SVG } from '../svg/svg'
import { Polygon } from './polygon'

describe('Polygon', () => {
  describe('constructor()', () => {
    it('should create an instance with given attributes', () => {
      expect(Polygon.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an instance with path string and attributes', () => {
      const line = Polygon.create('1 2 3 4', { id: 'foo' })
      expect(line.toArray()).toEqual([
        [1, 2],
        [3, 4],
      ])
      expect(line.id()).toEqual('foo')
    })

    it('should create an instance from container', () => {
      const g = new G()
      const line = g.polygon('1 2 3 4', { id: 'foo' })
      expect(line.toArray()).toEqual([
        [1, 2],
        [3, 4],
      ])
      expect(line.id()).toEqual('foo')
    })
  })

  describe('x()', () => {
    it(`should set the x value of the polygon and returns itself`, () => {
      const svg = new SVG().appendTo(document.body)
      const line = svg.polygon('1, 2, 3, 4')
      expect(line.x(50)).toBe(line)
      expect(line.bbox().x).toBe(50)
      svg.remove()
    })

    it(`should get the x value of the polygon`, () => {
      const svg = new SVG().appendTo(document.body)
      const line = svg.polygon('1, 2, 3, 4')
      expect(line.x(50).x()).toBe(50)
      svg.remove()
    })
  })

  describe('y()', () => {
    it(`should set the y value of the polygonand returns itself`, () => {
      const svg = new SVG().appendTo(document.body)
      const line = svg.polygon('1, 2, 3, 4')
      expect(line.y(50)).toBe(line)
      expect(line.bbox().y).toBe(50)
      svg.remove()
    })

    it(`should get the y value of the polygon`, () => {
      const svg = new SVG().appendTo(document.body)
      const line = svg.polygon('1, 2, 3, 4')
      expect(line.y(50).y()).toBe(50)
      svg.remove()
    })
  })

  describe('width()', () => {
    it(`should set the width of the polygonand returns itself`, () => {
      const svg = new SVG().appendTo(document.body)
      const line = svg.polygon('1, 2, 3, 4')
      expect(line.width(50)).toBe(line)
      expect(line.bbox().width).toBe(50)
      svg.remove()
    })

    it(`should get the width of the polygon`, () => {
      const svg = new SVG().appendTo(document.body)
      const line = svg.polygon('1, 2, 3, 4')
      expect(line.width(50).width()).toBe(50)
      svg.remove()
    })
  })

  describe('height()', () => {
    it(`should set the height of the polygonand returns itself`, () => {
      const svg = new SVG().appendTo(document.body)
      const line = svg.polygon('1, 2, 3, 4')
      expect(line.height(50)).toBe(line)
      expect(line.bbox().height).toBe(50)
      svg.remove()
    })

    it(`should get the height of the polygon`, () => {
      const svg = new SVG().appendTo(document.body)
      const line = svg.polygon('1, 2, 3, 4')
      expect(line.height(50).height()).toBe(50)
      svg.remove()
    })
  })

  describe('plot()', () => {
    it('should work as a getter', () => {
      const line = Polygon.create('1 2 3 4')
      expect(line.plot()).toEqual([
        [1, 2],
        [3, 4],
      ])
    })

    it('should plot with a string', () => {
      const path = Polygon.create('1 2 3 4')
      path.plot('0,0 50,50')
      expect(path.attr('points')).toEqual('0,0 50,50')
    })

    it('should plot with number array', () => {
      const line = Polygon.create()
      line.plot([0, 0, 50, 50])
      expect(line.attr('points')).toEqual('0,0 50,50')
    })

    it('should plot with point array', () => {
      const line = Polygon.create()
      line.plot([
        [0, 0],
        [50, 50],
      ])
      expect(line.attr('points')).toEqual('0,0 50,50')
    })
  })
})
