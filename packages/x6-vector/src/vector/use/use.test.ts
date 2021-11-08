import { Rect } from '../rect/rect'
import { SVG } from '../svg/svg'
import { Use } from './use'

describe('Use', () => {
  describe('constructor()', () => {
    it('should create a new object of type Use', () => {
      expect(new Use()).toBeInstanceOf(Use)
    })

    it('should set passed attributes on the element', () => {
      expect(Use.create({ id: 'foo' }).id()).toBe('foo')
    })
  })

  describe('use()', () => {
    it('should link an element', () => {
      const rect = new Rect()
      const use = Use.create(rect, { foo: 'bar' } as any)
      expect(use.attr('href')).toBe(`#${rect.id()}`)
      expect(use.attr('foo')).toBe('bar')
    })

    it('should link an element with id', () => {
      const use = Use.create('rect1', null, { foo: 'bar' } as any)
      expect(use.attr('href')).toBe(`#rect1`)
      expect(use.attr('foo')).toBe('bar')
    })

    it('should link an element from a different file', () => {
      const use = Use.create('id', 'file', { foo: 'bar' } as any)
      expect(use.attr('href')).toBe('file#id')
      expect(use.attr('foo')).toBe('bar')
    })

    it('should create an use element linked to the given element', () => {
      const svg = new SVG().appendTo(document.body)
      const rect = svg.rect(100, 100)
      const use = svg.use(rect)

      expect(use.attr('href')).toBe(`#${rect.id()}`)
      expect(use.reference('href')).toBe(rect)

      svg.remove()
    })
  })
})
