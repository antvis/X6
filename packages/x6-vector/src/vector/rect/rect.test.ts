import { G } from '../g/g'
import { Rect } from './rect'

describe('Rect', () => {
  describe('constructor()', () => {
    it('should create a rect with given attributes', () => {
      expect(Rect.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create a rect with given width and height', () => {
      const group = new G()
      const rect = group.rect(100, 200)
      expect(rect.attr(['width', 'height'])).toEqual({
        width: 100,
        height: 200,
      })
      expect(rect).toBeInstanceOf(Rect)
    })

    it('should create a rect with given width, height and attributes', () => {
      const group = new G()
      const rect = group.rect(100, 200, { id: 'foo' })
      expect(rect.attr(['width', 'height'])).toEqual({
        width: 100,
        height: 200,
      })
      expect(rect).toBeInstanceOf(Rect)
      expect(rect.id()).toBe('foo')
    })

    it('should create a rect with given size', () => {
      const group = new G()
      const rect = group.rect(100)
      expect(rect.attr(['width', 'height'])).toEqual({
        width: 100,
        height: 100,
      })
      expect(rect).toBeInstanceOf(Rect)
    })

    it('should create a rect with given size and attributes', () => {
      const group = new G()
      const rect = group.rect(100, { id: 'foo' })
      expect(rect.attr(['width', 'height'])).toEqual({
        width: 100,
        height: 100,
      })
      expect(rect).toBeInstanceOf(Rect)
      expect(rect.id()).toBe('foo')
    })
  })

  describe('rx()', () => {
    it('should call attribute with rx and return itself', () => {
      const rect = new Rect()
      const spy = spyOn(rect, 'attr').and.callThrough()
      expect(rect.rx(50)).toBe(rect)
      expect(spy).toHaveBeenCalledWith('rx', 50)
    })
  })

  describe('ry()', () => {
    it('should call attribute with ry and return itself', () => {
      const rect = new Rect()
      const spy = spyOn(rect, 'attr').and.callThrough()
      expect(rect.ry(50)).toBe(rect)
      expect(spy).toHaveBeenCalledWith('ry', 50)
    })
  })

  describe('radius()', () => {
    it('should set rx and ry on the rectangle', () => {
      const rect = new Rect().radius(5, 10)
      expect(rect.attr('rx')).toEqual(5)
      expect(rect.attr('ry')).toEqual(10)
    })
  })
})
