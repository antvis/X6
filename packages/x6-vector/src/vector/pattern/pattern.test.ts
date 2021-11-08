import { G } from '../g/g'
import { SVG } from '../svg/svg'
import { Pattern } from './pattern'

describe('Pattern', () => {
  describe('constructor()', () => {
    it('should create a new object of type Pattern', () => {
      expect(Pattern.create()).toBeInstanceOf(Pattern)
    })

    it('should create an instance with given attributes', () => {
      expect(Pattern.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an instance with given width and height', () => {
      const pattern = Pattern.create(100, 200)
      expect(pattern.width()).toBe(100)
      expect(pattern.height()).toBe(200)
    })

    it('should create an instance with given width, height and attributes', () => {
      const pattern = Pattern.create(100, 200, { id: 'foo' })
      expect(pattern.width()).toBe(100)
      expect(pattern.height()).toBe(200)
      expect(pattern.id()).toBe('foo')
    })

    it('should create an instance with given width, height, update function and attributes', () => {
      const pattern = Pattern.create(100, 200, (m) => m.rect(100, 100), {
        id: 'foo',
      })
      expect(pattern.width()).toBe(100)
      expect(pattern.height()).toBe(200)
      expect(pattern.id()).toBe('foo')
      expect(pattern.children().length).toBe(1)
    })

    it('should create an instance with given size', () => {
      const pattern = Pattern.create(100)
      expect(pattern.width()).toBe(100)
      expect(pattern.height()).toBe(100)
    })

    it('should create an instance with given size, update function and attributes', () => {
      const pattern = Pattern.create(100, (m) => m.rect(100, 100), {
        id: 'foo',
      })

      expect(pattern.width()).toBe(100)
      expect(pattern.height()).toBe(100)
      expect(pattern.id()).toBe('foo')
      expect(pattern.children().length).toBe(1)
    })

    it('should create an instance with given size and attributes', () => {
      const pattern = Pattern.create(100, { id: 'foo' })
      expect(pattern.width()).toBe(100)
      expect(pattern.height()).toBe(100)
      expect(pattern.id()).toBe('foo')
    })

    it('should create an instance from container', () => {
      const svg = new SVG()
      const g = svg.group()
      const pattern = g.pattern()
      expect(pattern).toBeInstanceOf(Pattern)
    })

    it('should throw an error when container do not in svg context', () => {
      const g = new G()
      expect(() => g.pattern()).toThrowError()
    })
  })

  describe('attr()', () => {
    it('should relay to parents attr method for any call except transformation', () => {
      const pattern = new Pattern()
      pattern.attr('tabIndex', 1)
      pattern.attr('transform', 'foo')

      expect(pattern.attr('tabIndex')).toEqual(1)
      expect(pattern.attr('patternTransform')).toEqual('foo')
    })
  })

  describe('bbox()', () => {
    it('should return an empty box', () => {
      const bbox = new Pattern().bbox()
      expect(bbox.x).toEqual(0)
      expect(bbox.y).toEqual(0)
      expect(bbox.w).toEqual(0)
      expect(bbox.h).toEqual(0)
    })
  })

  describe('targets()', () => {
    it('should get all targets of this pattern', () => {
      const svg = new SVG().appendTo(document.body)
      const pattern = svg.pattern()
      const rect = svg.rect(100, 100).fill(pattern)
      expect(pattern.targets()).toEqual([rect])
      svg.remove()
    })
  })

  describe('update()', () => {
    it('should clear the element', () => {
      const pattern = new Pattern()
      pattern.rect(100, 100)
      expect(pattern.update().children()).toEqual([])
    })
  })

  describe('url()', () => {
    it('should return "url(#id)"', () => {
      const pattern = new Pattern().id('foo')
      expect(pattern.url()).toBe('url(#foo)')
    })
  })

  describe('toString()', () => {
    it('should call `url()` and returns the result', () => {
      const pattern = new Pattern()
      expect(pattern.toString()).toBe(pattern.url())
    })
  })
})
