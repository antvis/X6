import { G } from '../g/g'
import { ForeignObject } from './foreignobject'

describe('ForeignObject', () => {
  describe('constructor()', () => {
    it('should create a instance with empty args', () => {
      expect(ForeignObject.create()).toBeInstanceOf(ForeignObject)
    })

    it('should create an sintance with passed attributes', () => {
      expect(ForeignObject.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an instance with given width and height', () => {
      const group = new G()
      const ellipse = group.foreignObject(100, 200)
      expect(ellipse.attr(['width', 'height'])).toEqual({
        width: 100,
        height: 200,
      })
    })

    it('should create an instance with given width, height and attributes', () => {
      const group = new G()
      const ellipse = group.foreignObject(100, 200, { id: 'foo' })
      expect(ellipse.attr(['width', 'height'])).toEqual({
        width: 100,
        height: 200,
      })
      expect(ellipse).toBeInstanceOf(ForeignObject)
      expect(ellipse.id()).toBe('foo')
    })

    it('should create an instance with given size', () => {
      const group = new G()
      const ellipse = group.foreignObject(100)
      expect(ellipse.attr(['width', 'height'])).toEqual({
        width: 100,
        height: 100,
      })
      expect(ellipse).toBeInstanceOf(ForeignObject)
    })

    it('should create an instance with given size and attributes', () => {
      const group = new G()
      const ellipse = group.foreignObject(100, { id: 'foo' })
      expect(ellipse.attr(['width', 'height'])).toEqual({
        width: 100,
        height: 100,
      })
      expect(ellipse).toBeInstanceOf(ForeignObject)
      expect(ellipse.id()).toBe('foo')
    })
  })
})
