import { Path } from '../path/path'
import { SVG } from '../svg/svg'
import { TextPath } from '../textpath/textpath'
import { TSpan } from '../tspan/tspan'
import { Text } from './text'

describe('Text', () => {
  describe('constructor()', () => {
    it('should create an instance with given attributes', () => {
      expect(new Text({ id: 'foo' }).id()).toBe('foo')
    })
  })

  describe('text()', () => {
    it('should set the text content of the tspan and return itself', () => {
      const text = new Text()
      expect(text.text('Hello World')).toBe(text)
      expect(text.node.textContent).toBe('Hello World')
    })

    it('should creates tspans for every line', () => {
      const text = new Text().text('Hello World\nHow is it\ngoing')
      expect(text.children().length).toBe(3)
      expect(text.get(0)!.node.textContent).toBe('Hello World')
      expect(text.get(1)!.node.textContent).toBe('How is it')
      expect(text.get(2)!.node.textContent).toBe('going')
    })

    it('should increase dy after empty line', () => {
      const svg = new SVG()
      const text = svg.text('Hello World\n\nHow is it\ngoing')
      expect(text.children().length).toBe(4)
      expect(text.get(0)!.node.textContent).toBe('Hello World')
      expect(text.get(1)!.node.textContent).toBe('')
      expect(text.get(2)!.node.textContent).toBe('How is it')
      expect(text.get(3)!.node.textContent).toBe('going')
      expect(text.get<TSpan>(2)!.dy()).toBe(text.get<TSpan>(3)!.dy() * 2)
    })

    it('should return the correct text with newlines', () => {
      const text = new Text().text('Hello World\nHow is it\ngoing')
      expect(text.text()).toBe('Hello World\nHow is it\ngoing')
    })

    it('should return the correct text with newlines and skips textPaths', () => {
      const path = new Path()
      const text = new Text()
      const textPath = text.text('Hello World\nHow is it\ngoing').path(path)
      textPath.eachChild((child) => {
        child.addTo(text)
      })
      text.add(new TextPath(), 3)
      expect(text.text()).toBe('Hello World\nHow is it\ngoing')
    })

    it('should execute passed update function', () => {
      const text = new Text()
      text.text((t) => {
        t.tspan('Hello World').newLine()
        t.tspan('How is it').newLine()
        t.tspan('going').newLine()
        expect(t).toBe(text)
      })
      expect(text.text()).toBe('Hello World\nHow is it\ngoing')
    })

    it('should trigger rebuild', () => {
      const text = new Text()
      const spy = spyOn(text, 'rebuild')
      text.text('foo')
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('leading()', () => {
    it('should return the leading value of the text', () => {
      const text = new Text()
      expect(text.leading()).toEqual(1.3)
    })

    it('should set the leading value of the text', () => {
      const text = new Text()
      expect(text.leading(1.5).leading()).toBe(1.5)
    })

    it('should get the leading value by `attr`', () => {
      const text = new Text()
      expect(text.attr('leading')).toBe(1.3)
    })

    it('should set the leading value by `attr`', () => {
      const text = new Text()
      expect(text.attr('leading', 1.5).leading()).toBe(1.5)
    })
  })

  describe('rebuild()', () => {
    it('should rebuild the text', () => {
      const svg = new SVG().appendTo(document.body)
      const text = new Text().addTo(svg)
      text.text((t) => {
        t.tspan('Hello World').newLine()
        t.tspan('How is it').newLine()
        t.tspan('going').newLine()
      })

      const dy = text.get<TSpan>(1)!.dy()
      text.leading(1.7)
      expect(dy).not.toBe(text.get<TSpan>(1)!.dy())

      svg.remove()
    })

    it('should not rebuild the text', () => {
      const svg = new SVG().appendTo(document.body)
      const text = new Text().addTo(svg)
      text.text((t) => {
        t.tspan('Hello World').newLine()
        t.tspan('How is it').newLine()
        t.tspan('going').newLine()
      })

      const dy = text.get<TSpan>(1)!.dy()
      text.rebuild(false)
      text.leading(1.7)
      expect(dy).toBe(text.get<TSpan>(1)!.dy())

      svg.remove()
    })
  })
})
