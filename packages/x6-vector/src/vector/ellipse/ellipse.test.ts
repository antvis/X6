import { G } from '../g/g'
import { Ellipse } from './ellipse'

describe('Ellipse', () => {
  describe('constructor()', () => {
    it('should create a ellipse', () => {
      expect(Ellipse.create()).toBeInstanceOf(Ellipse)
    })

    it('should create a ellipse with given attributes', () => {
      expect(Ellipse.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create a ellipse with given width and height', () => {
      const group = new G()
      const ellipse = group.ellipse(100, 200)
      expect(ellipse.attr(['rx', 'ry'])).toEqual({
        rx: 50,
        ry: 100,
      })
    })

    it('should create a ellipse with given width, height and attributes', () => {
      const group = new G()
      const ellipse = group.ellipse(100, 200, { id: 'foo' })
      expect(ellipse.attr(['rx', 'ry'])).toEqual({
        rx: 50,
        ry: 100,
      })
      expect(ellipse).toBeInstanceOf(Ellipse)
      expect(ellipse.id()).toBe('foo')
    })

    it('should create a ellipse with given size', () => {
      const group = new G()
      const ellipse = group.ellipse(100)
      expect(ellipse.attr(['rx', 'ry'])).toEqual({
        rx: 50,
        ry: 50,
      })
      expect(ellipse).toBeInstanceOf(Ellipse)
    })

    it('should create a ellipse with given size and attributes', () => {
      const group = new G()
      const ellipse = group.ellipse(100, { id: 'foo' })
      expect(ellipse.attr(['rx', 'ry'])).toEqual({
        rx: 50,
        ry: 50,
      })
      expect(ellipse).toBeInstanceOf(Ellipse)
      expect(ellipse.id()).toBe('foo')
    })
  })

  describe('rx()', () => {
    it('should call attribute with rx and return itself', () => {
      const ellipse = new Ellipse()
      const spy = spyOn(ellipse, 'attr').and.callThrough()
      expect(ellipse.rx(50)).toBe(ellipse)
      expect(spy).toHaveBeenCalledWith('rx', 50)
    })
  })

  describe('ry()', () => {
    it('should call attribute with ry and return itself', () => {
      const ellipse = new Ellipse()
      const spy = spyOn(ellipse, 'attr').and.callThrough()
      expect(ellipse.ry(50)).toBe(ellipse)
      expect(spy).toHaveBeenCalledWith('ry', 50)
    })
  })

  describe('radius()', () => {
    it('should set rx and ry', () => {
      const ellipse = new Ellipse().radius(5, 10)
      expect(ellipse.attr('rx')).toEqual(5)
      expect(ellipse.attr('ry')).toEqual(10)
    })
  })

  describe('x()', () => {
    it('should set x position and returns itself', () => {
      const ellipse = Ellipse.create(50, 50)
      expect(ellipse.x(50)).toBe(ellipse)
      expect(ellipse.bbox().x).toBe(50)
    })

    it('should get the x position', () => {
      const ellipse = Ellipse.create(50, 50)
      ellipse.x(50)
      expect(ellipse.x()).toBe(50)
    })
  })

  describe('y()', () => {
    it('should set y position and returns itself', () => {
      const ellipse = Ellipse.create(50, 50)
      expect(ellipse.y(50)).toBe(ellipse)
      expect(ellipse.bbox().y).toBe(50)
    })

    it('should get the y position', () => {
      const ellipse = Ellipse.create(50, 50)
      ellipse.y(50)
      expect(ellipse.y()).toBe(50)
    })
  })

  describe('cx()', () => {
    it('should call attribute with cx and returns itself', () => {
      const ellipse = Ellipse.create(50, 50)
      const spy = spyOn(ellipse, 'attr').and.callThrough()
      expect(ellipse.cx(50)).toBe(ellipse)
      expect(spy).toHaveBeenCalledWith('cx', 50)
    })
  })

  describe('cy()', () => {
    it('should call attribute with cy and returns itself', () => {
      const ellipse = Ellipse.create(50, 50)
      const spy = spyOn(ellipse, 'attr').and.callThrough()
      expect(ellipse.cy(50)).toBe(ellipse)
      expect(spy).toHaveBeenCalledWith('cy', 50)
    })
  })

  describe('width()', () => {
    it('should set rx by half the given width', () => {
      const ellipse = Ellipse.create(50, 50)
      const spy = spyOn(ellipse, 'rx').and.callThrough()
      expect(ellipse.width(50)).toBe(ellipse)
      expect(spy).toHaveBeenCalledWith(25)
    })

    it('should get the width of the element', () => {
      const ellipse = Ellipse.create()
      ellipse.width(100)
      expect(ellipse.width()).toBe(100)
    })
  })

  describe('height()', () => {
    it('should set ry by half the given height', () => {
      const ellipse = Ellipse.create()
      const spy = spyOn(ellipse, 'ry').and.callThrough()
      expect(ellipse.height(50)).toBe(ellipse)
      expect(spy).toHaveBeenCalledWith(25)
    })

    it('should get the height of the element', () => {
      const ellipse = Ellipse.create()
      ellipse.height(100)
      expect(ellipse.height()).toBe(100)
    })
  })
})
