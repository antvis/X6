import { SVG } from '../svg/svg'
import { Text } from '../text/text'
import { Path } from '../path/path'
import { TextPath } from './textpath'
import { TSpan } from '../tspan/tspan'

describe('TextPath', () => {
  let svg: SVG
  let text: Text
  let path: Path

  const txt = 'We go up, then we go down, then up again'
  const data =
    'M 100 200 C 200 100 300  0 400 100 C 500 200 600 300 700 200 C 800 100 900 100 900 100'

  beforeEach(() => {
    svg = new SVG().addTo(document.body)
    text = svg.text(txt)
    path = svg.path(data)
  })

  afterEach(() => {
    svg.remove()
  })

  describe('constructor()', () => {
    it('should create a new object of type TextPath', () => {
      expect(new TextPath()).toBeInstanceOf(TextPath)
    })

    it('should set passed attributes on the element', () => {
      expect(new TextPath({ id: 'foo' }).id()).toBe('foo')
    })
  })

  describe('track()', () => {
    it('should return the referenced path instance', () => {
      const textPath = text.path(path)
      expect(textPath.track()).toBe(path)
    })
  })

  describe('toArray()', () => {
    it('should return the path array of the underlying path', () => {
      expect(text.path(path).toArray()).toEqual(path.toArray())
    })

    it('should return null if there is no underlying path', () => {
      const textPath = new TextPath()
      expect(textPath.toArray()).toBe(null)
    })
  })

  describe('plot()', () => {
    it('should change the underlying path', () => {
      expect(text.path('').plot(path.toArray()).toArray()).toEqual(
        path.toArray(),
      )
    })

    it('should return the path array of the underlying path when no arguments is passed', () => {
      const textPath = text.path(path)
      expect(textPath.plot()).not.toBeNull()
      expect(textPath.plot()).toEqual(textPath.toPathArray()!.toArray())
    })

    it('should do nothing if no path is attached as track', () => {
      const textPath = new TextPath()
      expect(textPath.plot('M0 0')).toBe(textPath)
    })
  })

  describe('Container', () => {
    describe('textPath()', () => {
      it('should create a textPath from string text and string path', () => {
        const textPath = svg.textPath(txt, data)
        expect(textPath).toBeInstanceOf(TextPath)
        expect(textPath.parent()).toBeInstanceOf(Text)
        expect(textPath.track()).toBeInstanceOf(Path as any)
        expect(textPath.track()!.parent()).toBe(svg.defs())
      })

      it('should create a textPath from Text and Path', () => {
        const textPath = svg.textPath(text, path)
        expect(textPath.parent()).toEqual(text)
        expect(textPath.track()).toEqual(path)
      })

      it('should passes the text into textPath and not text', () => {
        const tspan = text.firstChild<TSpan>()
        const textPath = svg.textPath(text, path)
        expect(textPath.firstChild()).toBe(tspan)
        expect(text.firstChild()).toBe(textPath)
      })
    })
  })

  describe('Text', () => {
    describe('path()', () => {
      it('should create a textPath node in the text element', () => {
        text.path(data)
        expect(text.node.querySelector('textPath')).not.toBe(null)
      })

      it('should reference the passed path', () => {
        const textPath = text.path(path)
        expect(textPath.reference('href')).toBe(path)
      })

      it('should import all nodes from the text by default', () => {
        const children = text.children()
        const textPath = text.path(path)
        expect(textPath.children()).toEqual(children)
      })

      it('should not import all nodes from the text when second parameter false', () => {
        const textPath = text.path(path, false)
        expect(textPath.children()).toEqual([])
      })
    })

    describe('textPath()', () => {
      it('should return the textPath element of this text', () => {
        const textPath = text.path(path)
        expect(text.textPath()).toBe(textPath)
      })
    })
  })

  describe('Path', () => {
    describe('text()', () => {
      it('should create a text with textPath node and inserts it after the path', () => {
        const textPath = path.text(txt, { x: 10 })
        expect(textPath.parent()).toBeInstanceOf(Text)
        expect(path.node.nextSibling).toBe(textPath.parent()!.node)
      })

      it('should transplant the node from text to textPath', () => {
        const nodesInText = [].slice.call(text.node.childNodes)
        const textPath = path.text(text)
        const nodesInTextPath = [].slice.call(textPath.node.childNodes)
        expect(nodesInText).toEqual(nodesInTextPath)
      })
    })

    describe('targets', () => {
      it('should return all elements referencing this path with href', () => {
        const textPath = text.path(path)
        expect(path.targets()).toEqual([textPath])
      })

      it('should return an empty array when there is no referencs', () => {
        expect(path.targets()).toEqual([])
      })

      it('should return an empty array when path is not in the document', () => {
        const path = new Path()
        expect(path.targets()).toEqual([])
      })
    })
  })
})
