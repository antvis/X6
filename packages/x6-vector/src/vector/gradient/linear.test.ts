import { G } from '../g/g'
import { Svg } from '../svg/svg'
import { defaultAttributes } from '../vector/overrides'
import { LinearGradient } from './linear'

describe('LinearGradient', () => {
  describe('constructor()', () => {
    it('should create a new object of type LinearGradient', () => {
      const gradient = new LinearGradient()
      expect(gradient).toBeInstanceOf(LinearGradient)
      expect(gradient.type).toBe('linearGradient')
    })

    it('should create an instance with given attributes', () => {
      expect(LinearGradient.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an instance from container', () => {
      const svg = new Svg()
      expect(svg.linearGradient()).toBeInstanceOf(LinearGradient)
      expect(svg.gradient('linear')).toBeInstanceOf(LinearGradient)
    })

    it('should create an instance from container with given attributes', () => {
      const svg = new Svg()
      const gradient = svg.linearGradient({ id: 'foo' })
      expect(gradient.id()).toEqual('foo')
    })

    it('should create an instance from container with given update function and attributes', () => {
      const svg = new Svg()

      const gradient1 = svg.linearGradient((instance) => instance.stop(0.1), {
        id: 'foo',
      })
      expect(gradient1.id()).toEqual('foo')
      expect(gradient1.children().length).toEqual(1)

      const gradient2 = svg.linearGradient(null, { id: 'foo' })
      expect(gradient2.id()).toEqual('foo')
      expect(gradient2.children().length).toEqual(0)
    })

    it('should throw an error when container do not in svg context', () => {
      const g = new G()
      expect(() => g.linearGradient()).toThrowError()
    })
  })

  describe('from()', () => {
    it('should set x1, y1 attributes', () => {
      const gradient = new LinearGradient()
      gradient.from(0, 1)
      expect(gradient.attr('x1')).toEqual(0)
      expect(gradient.attr('y1')).toEqual(1)
    })
  })

  describe('to()', () => {
    it('should set x2, y2 attributes', () => {
      const gradient = new LinearGradient()
      gradient.to(2, 3)
      expect(gradient.attr('x2')).toEqual(2)
      expect(gradient.attr('y2')).toEqual(3)
    })
  })

  describe('attr()', () => {
    it('should relay to parents attr method for any call except transformation', () => {
      const gradient = new LinearGradient()
      gradient.attr('tabIndex', 1)
      gradient.attr('transform', 'foo')

      expect(gradient.attr('tabIndex')).toEqual(1)
      expect(gradient.attr('gradientTransform')).toEqual('foo')
    })
  })

  describe('bbox()', () => {
    it('should return an empty box', () => {
      const bbox = new LinearGradient().bbox()
      expect(bbox.x).toEqual(0)
      expect(bbox.y).toEqual(0)
      expect(bbox.w).toEqual(0)
      expect(bbox.h).toEqual(0)
    })
  })

  describe('targets()', () => {
    it('should get all targets of this pattern', () => {
      const svg = new Svg().appendTo(document.body)
      const gradient = svg.linearGradient()
      const rect = svg.rect(100, 100).fill(gradient)
      expect(gradient.targets()).toEqual([rect])
      svg.remove()
    })
  })

  describe('remove()', () => {
    it('should ungradient all targets', () => {
      const svg = new Svg().appendTo(document.body)
      const gradient = svg.linearGradient()
      const rect = svg.rect(100, 100).fill(gradient)
      expect(gradient.targets()).toEqual([rect])
      expect(gradient.remove()).toBe(gradient)
      expect(rect.attr('fill')).toBe(defaultAttributes.fill)
      svg.remove()
    })
  })

  describe('update()', () => {
    it('should clear the element', () => {
      const gradient = new LinearGradient()
      gradient.stop(0.1, '#fff', 0.5)
      expect(gradient.update().children()).toEqual([])
    })

    it('should execute a function in the context of the gradient', () => {
      const gradient = new LinearGradient()
      gradient.update((instance) =>
        instance.stop({ offset: 10, color: 'red', opacity: 0.1 }),
      )
      expect(gradient.update().children()).toEqual([])
    })
  })

  describe('url()', () => {
    it('should return "url(#id)"', () => {
      const gradient = new LinearGradient().id('foo')
      expect(gradient.url()).toBe('url(#foo)')
    })
  })

  describe('toString()', () => {
    it('should call `url()` and returns the result', () => {
      const gradient = new LinearGradient()
      expect(gradient.toString()).toBe(gradient.url())
    })
  })
})
