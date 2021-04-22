import { Rect } from '../rect/rect'
import { Svg } from '../svg/svg'
import { Mask } from './mask'

describe('Mask Extension', () => {
  describe('masker()', () => {
    it('should return the instance of Mask the current element is maskped with', () => {
      const svg = new Svg().appendTo(document.body)
      const mask = svg.mask()
      const rect = svg.rect(100, 100).maskWith(mask)
      expect(rect.masker()).toEqual(mask)
      svg.remove()
    })

    it('should return null if no maskPath was found', () => {
      expect(new Rect().masker()).toBe(null)
    })
  })

  describe('maskWith()', () => {
    it('should set the mask attribute on the element to the id of the maskPath', () => {
      const mask = new Mask().id('foo')
      const rect = new Rect().maskWith(mask)
      expect(rect.attr('mask')).toBe('url("#foo")')
    })

    it('should create a maskPath and appends the passed element to it to mask current element', () => {
      const svg = new Svg().appendTo(document.body)
      const circle = svg.circle(40)
      const rect = svg.rect(100, 100).maskWith(circle)
      expect(circle.parent()).toBeInstanceOf(Mask)
      expect(rect.attr('mask')).toBe(`url("#${circle.parent()!.id()}")`)
      svg.remove()
    })
  })

  describe('unmask()', () => {
    it('should set the mask-target attribute to null and returns itself', () => {
      const mask = new Mask().id('foo')
      const rect = new Rect().maskWith(mask)
      expect(rect.unmask()).toBe(rect)
      expect(rect.attr('mask')).toBe(undefined)
    })
  })
})
