import { Rect } from '../rect/rect'
import { SVG } from '../svg/svg'
import { ClipPath } from './clippath'

describe('ClipPath', () => {
  describe('clipper()', () => {
    it('should return the instance of ClipPath the current element is clipped with', () => {
      const svg = new SVG().appendTo(document.body)
      const clip = svg.clip()
      const rect = svg.rect(100, 100).clipWith(clip)
      expect(rect.clipper()).toEqual(clip)
      svg.remove()
    })

    it('should return null if no clipPath was found', () => {
      expect(new Rect().clipper()).toBe(null)
    })
  })

  describe('clipWith()', () => {
    it('should set the clip-path attribute on the element to the id of the clipPath', () => {
      const clip = new ClipPath().id('foo')
      const rect = new Rect().clipWith(clip)
      expect(rect.attr('clip-path')).toBe('url("#foo")')
    })

    it('should create a clipPath and appends the passed element to it to clip current element', () => {
      const svg = new SVG()
      const circle = svg.circle(40)
      const rect = svg.rect(100, 100).clipWith(circle)
      const clipper = circle.parent()!
      expect(clipper).toBeInstanceOf(ClipPath)
      expect(rect.attr('clip-path')).toBe(`url("#${clipper.id()}")`)
    })
  })

  describe('unclip()', () => {
    it('should set the clip-target attribute to null and returns itself', () => {
      const clip = new ClipPath().id('foo')
      const rect = new Rect().clipWith(clip)
      expect(rect.unclip()).toBe(rect)
      expect(rect.attr('clip-path')).toBeUndefined()
    })
  })
})
