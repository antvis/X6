import { SVG } from '../svg/svg'
import { Text } from '../text/text'
import { TSpan } from './tspan'
import { getFontSize } from '../text/util'

describe('TSpan', () => {
  describe('constructor()', () => {
    it('should create an instance with given attributes', () => {
      expect(new TSpan({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create a tspan in a text', () => {
      const text = new Text()
      const tspan = text.tspan('Hello World', { id: 'foo' })
      expect(tspan).toBeInstanceOf(TSpan)
      expect(tspan.node.textContent).toBe('Hello World')
      expect(tspan.id()).toEqual('foo')
      expect(tspan.parent()).toBe(text)
    })

    it('should create a tspan in a tspan', () => {
      const tspan1 = new TSpan()
      const tspan2 = tspan1.tspan({ id: 'foo' })
      expect(tspan2).toBeInstanceOf(TSpan)
      expect(tspan2.id()).toEqual('foo')
      expect(tspan2.parent()).toBe(tspan1)
    })

    it('should create a tspan and calles newLine() on it', () => {
      const text = new Text()
      const tspan = text.newLine()
      expect(tspan).toBeInstanceOf(TSpan)
      expect(tspan.parent()).toBe(text)
      expect(tspan.affix('newLined')).toBeTrue()
    })
  })

  describe('text()', () => {
    it('should set the text content of the tspan and returns itself', () => {
      const tspan = new TSpan()
      expect(tspan.text('Hello World')).toBe(tspan)
      expect(tspan.node.textContent).toBe('Hello World')
    })

    it('should return the textContent of the tspan', () => {
      const tspan = new TSpan().text('Hello World')
      expect(tspan.text()).toBe('Hello World')
    })

    it('should add a newline when this tspan is a newline', () => {
      const tspan = new TSpan().text('Hello World').newLine()
      expect(tspan.text()).toBe('Hello World\n')
    })

    it('should execute a function in the context of the tspan', () => {
      const tspan = new TSpan()
      tspan.text(function (t) {
        expect(this).toBe(tspan)
        expect(t).toBe(tspan)
      })
    })
  })

  describe('dx()', () => {
    it('should set the dx attribute and returns itself', () => {
      const tspan = new TSpan()
      expect(tspan.dx(20)).toBe(tspan)
      expect(tspan.attr('dx')).toBe(20)
    })

    it('should return the dx attribute', () => {
      const tspan = new TSpan().dx(20)
      expect(tspan.dx()).toBe(20)
    })
  })

  describe('dy()', () => {
    it('should set the dy attribute and returns itself', () => {
      const tspan = new TSpan()
      expect(tspan.dy(20)).toBe(tspan)
      expect(tspan.attr('dy')).toBe(20)
    })

    it('should return the dy attribute', () => {
      const tspan = new TSpan().dy(20)
      expect(tspan.dy()).toBe(20)
    })
  })

  describe('newLine()', () => {
    it('should work without text parent', () => {
      // should not fail
      const tspan = new TSpan().newLine()
      expect(tspan.affix('newLined')).toBeTrue()
    })

    it('should set dy to zero of first line', () => {
      const text = new Text()
      const first = text.tspan('First Line').newLine()
      expect(first.dy()).toBe(0)
    })

    it('should set dy corresponding to line and leading', () => {
      const svg = new SVG().appendTo(document.body)
      const text = new Text().leading(2).build(true).addTo(svg)
      text.tspan('First Line').newLine()
      text.tspan('Second Line').newLine()
      const third = text.tspan('Third Line').newLine()

      const dy = 2 * getFontSize(text.node)
      expect(third.dy()).toBe(dy)
      svg.remove()
    })
  })
})
