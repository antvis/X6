import { G } from '../g/g'
import { Style } from './style'

describe('Style', () => {
  describe('constructor()', () => {
    it('should create an instance with given attributes', () => {
      expect(new Style({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create a style element in the container and adds a rule', () => {
      const g = new G()
      const style = g.style('#id', { fontSize: 15 })
      expect(style.node.textContent).toBe('#id {font-size: 15;}')
    })

    it('should create a style element in the container and adds a font-face rule', () => {
      const g = new G()
      const style = g.fontFace('fontName', 'url', { foo: 'bar' })
      expect(style.node.textContent).toBe(
        '@font-face {font-family: fontName;src: url;foo: bar;}',
      )
    })
  })

  describe('addText()', () => {
    it('should append a string to the current textContent and returns itself', () => {
      const style = new Style()
      expect(style.addText('foo').node.textContent).toBe('foo')
      expect(style.addText('bar').node.textContent).toBe('foobar')
      expect(style.addText('foobar')).toBe(style)
    })

    it('should append an empty string if nothing passed', () => {
      const style = new Style()
      expect(style.addText().node.textContent).toBe('')
    })
  })

  describe('addFont()', () => {
    it('should add a font-face rule to load a custom font and returns itself', () => {
      const style = new Style()
      expect(style.addFont('fontName', 'url')).toBe(style)
      expect(style.node.textContent).toBe(
        '@font-face {font-family: fontName;src: url;}',
      )
    })

    it('should add extra parameters if wanted', () => {
      const style = new Style()
      style.addFont('fontName', 'url', { foo: 'bar' })
      expect(style.node.textContent).toBe(
        '@font-face {font-family: fontName;src: url;foo: bar;}',
      )
    })
  })

  describe('addRule()', () => {
    it('should add a css rule', () => {
      const style = new Style()
      expect(style.addRule('#id', { fontSize: 15 })).toBe(style)
      expect(style.node.textContent).toBe('#id {font-size: 15;}')
    })

    it('should add only selector when no obj was given', () => {
      const style = new Style()
      style.addRule('#id')
      expect(style.node.textContent).toBe('#id')
    })

    it('should add nothing if no selector was given', () => {
      const style = new Style()
      style.addRule()
      expect(style.node.textContent).toBe('')
    })
  })
})
