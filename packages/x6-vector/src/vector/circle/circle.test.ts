import { G } from '../g/g'
import { Circle } from './circle'

describe('Circle', () => {
  describe('constructor()', () => {
    it('should create a circle', () => {
      expect(Circle.create()).toBeInstanceOf(Circle)
    })

    it('should create a circle with given attributes', () => {
      expect(Circle.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create a circle with given size', () => {
      const group = new G()
      const circle = group.circle(100)
      expect(circle.attr('r')).toEqual(50)
      expect(circle).toBeInstanceOf(Circle)
    })

    it('should create a circle with given size', () => {
      const group = new G()
      const circle = group.circle(100)
      expect(circle.attr('r')).toEqual(50)
      expect(circle).toBeInstanceOf(Circle)
    })

    it('should create a circle with given size and attributes', () => {
      const group = new G()
      const circle = group.circle(100, { id: 'foo' })
      expect(circle.attr('r')).toEqual(50)
      expect(circle).toBeInstanceOf(Circle)
      expect(circle.id()).toBe('foo')
    })
  })

  describe('rx()', () => {
    it('should call attribute with rx and return itself', () => {
      const circle = new Circle()
      const spy = spyOn(circle, 'attr').and.callThrough()
      expect(circle.rx(50)).toBe(circle)
      expect(spy).toHaveBeenCalledWith('r', 50)
    })
  })

  describe('ry()', () => {
    it('should call attribute with ry and return itself', () => {
      const circle = new Circle()
      const spy = spyOn(circle, 'attr').and.callThrough()
      expect(circle.ry(50)).toBe(circle)
      expect(spy).toHaveBeenCalledWith('r', 50)
    })
  })

  describe('radius()', () => {
    it('should set radius', () => {
      const circle = new Circle().radius(5)
      expect(circle.attr('r')).toEqual(5)
    })
  })

  describe('x()', () => {
    it('should set x position and returns itself', () => {
      const circle = Circle.create()
      expect(circle.x(50)).toBe(circle)
      expect(circle.bbox().x).toBe(50)
    })

    it('should get the x position', () => {
      const circle = Circle.create()
      circle.x(50)
      expect(circle.x()).toBe(50)
    })
  })

  describe('y()', () => {
    it('should set y position and returns itself', () => {
      const circle = Circle.create()
      expect(circle.y(50)).toBe(circle)
      expect(circle.bbox().y).toBe(50)
    })

    it('should get the y position', () => {
      const circle = Circle.create()
      circle.y(50)
      expect(circle.y()).toBe(50)
    })
  })

  describe('cx()', () => {
    it('should call attribute with cx and returns itself', () => {
      const circle = Circle.create()
      const spy = spyOn(circle, 'attr').and.callThrough()
      expect(circle.cx(50)).toBe(circle)
      expect(spy).toHaveBeenCalledWith('cx', 50)
    })
  })

  describe('cy()', () => {
    it('should call attribute with cy and returns itself', () => {
      const circle = Circle.create()
      const spy = spyOn(circle, 'attr').and.callThrough()
      expect(circle.cy(50)).toBe(circle)
      expect(spy).toHaveBeenCalledWith('cy', 50)
    })
  })

  describe('width()', () => {
    it('should set rx by half the given width', () => {
      const circle = Circle.create()
      const spy = spyOn(circle, 'rx').and.callThrough()
      expect(circle.width(50)).toBe(circle)
      expect(spy).toHaveBeenCalledWith(25)
    })

    it('should get the width of the element', () => {
      const circle = Circle.create()
      circle.width(100)
      expect(circle.width()).toBe(100)
    })
  })

  describe('height()', () => {
    it('should set ry by half the given height', () => {
      const circle = Circle.create()
      const spy = spyOn(circle, 'ry').and.callThrough()
      expect(circle.height(50)).toBe(circle)
      expect(spy).toHaveBeenCalledWith(25)
    })

    it('should get the height of the element', () => {
      const circle = Circle.create()
      circle.height(100)
      expect(circle.height()).toBe(100)
    })
  })
})
