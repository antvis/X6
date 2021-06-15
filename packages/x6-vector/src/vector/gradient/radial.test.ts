import { G } from '../g/g'
import { Svg } from '../svg/svg'
import { RadialGradient } from './radial'

describe('RadialGradient', () => {
  describe('constructor()', () => {
    it('should create a new object of type RadialGradient', () => {
      const gradient = new RadialGradient()
      expect(gradient).toBeInstanceOf(RadialGradient)
      expect(gradient.type).toBe('radialGradient')
    })

    it('should create an instance with given attributes', () => {
      expect(RadialGradient.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an instance from container', () => {
      const svg = new Svg()
      expect(svg.radialGradient()).toBeInstanceOf(RadialGradient)
      expect(svg.gradient('radial')).toBeInstanceOf(RadialGradient)
    })

    it('should create an instance from container with given attributes', () => {
      const svg = new Svg()
      const gradient = svg.radialGradient({ id: 'foo' })
      expect(gradient.id()).toEqual('foo')
    })

    it('should create an instance from container with given update function and attributes', () => {
      const svg = new Svg()

      const gradient1 = svg.radialGradient((instance) => instance.stop(0.1), {
        id: 'foo',
      })
      expect(gradient1.id()).toEqual('foo')
      expect(gradient1.children().length).toEqual(1)

      const gradient2 = svg.radialGradient(null, { id: 'foo' })
      expect(gradient2.id()).toEqual('foo')
      expect(gradient2.children().length).toEqual(0)
    })

    it('should throw an error when container do not in svg context', () => {
      const g = new G()
      expect(() => g.radialGradient()).toThrowError()
    })
  })

  describe('from()', () => {
    it('should set fx, fy attributes', () => {
      const gradient = new RadialGradient()
      gradient.from(0, 1)
      expect(gradient.attr('fx')).toEqual(0)
      expect(gradient.attr('fy')).toEqual(1)
    })
  })

  describe('to()', () => {
    it('should set cx, cy attributes', () => {
      const gradient = new RadialGradient()
      gradient.to(2, 3)
      expect(gradient.attr('cx')).toEqual(2)
      expect(gradient.attr('cy')).toEqual(3)
    })
  })

  describe('attr()', () => {
    it('should relay to parents attr method for any call except transformation', () => {
      const gradient = new RadialGradient()
      gradient.attr('tabIndex', 1)
      gradient.attr('transform', 'foo')

      expect(gradient.attr('tabIndex')).toEqual(1)
      expect(gradient.attr('gradientTransform')).toEqual('foo')
    })
  })

  describe('bbox()', () => {
    it('should return an empty box', () => {
      const bbox = new RadialGradient().bbox()
      expect(bbox.x).toEqual(0)
      expect(bbox.y).toEqual(0)
      expect(bbox.w).toEqual(0)
      expect(bbox.h).toEqual(0)
    })
  })

  describe('targets()', () => {
    it('should get all targets of this pattern', () => {
      const svg = new Svg().appendTo(document.body)
      const gradient = svg.radialGradient()
      const rect = svg.rect(100, 100).fill(gradient)
      expect(gradient.targets()).toEqual([rect])
      svg.remove()
    })
  })

  describe('update()', () => {
    it('should clear the element', () => {
      const gradient = new RadialGradient()
      gradient.stop(0.1, '#fff')
      expect(gradient.update().children()).toEqual([])
    })

    it('should execute a function in the context of the gradient', () => {
      const gradient = new RadialGradient()
      gradient.update((instance) => instance.stop(0.1, '#fff'))
      expect(gradient.update().children()).toEqual([])
    })
  })

  describe('url()', () => {
    it('should return "url(#id)"', () => {
      const gradient = new RadialGradient().id('foo')
      expect(gradient.url()).toBe('url(#foo)')
    })
  })

  describe('toString()', () => {
    it('should call `url()` and returns the result', () => {
      const gradient = new RadialGradient()
      expect(gradient.toString()).toBe(gradient.url())
    })
  })
})
