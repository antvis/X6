import { SVG } from '../svg/svg'
import { Mask } from './mask'

describe('Mask', () => {
  describe('constructor()', () => {
    it('should create an instance of Mask', () => {
      expect(new Mask()).toBeInstanceOf(Mask)
    })

    it('should set passed attributes on the element', () => {
      expect(Mask.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create a maskPath in the container', () => {
      const svg = new SVG().appendTo(document.body)
      const mask = svg.mask()
      expect(mask).toBeInstanceOf(Mask)
      expect(svg.defs().children()).toEqual([mask])
      svg.remove()
    })
  })

  describe('remove()', () => {
    it('should unmask all targets', () => {
      const svg = new SVG().appendTo(document.body)
      const mask = svg.mask()
      const rect = svg.rect(100, 100).maskWith(mask)
      expect(mask.remove()).toBe(mask)
      expect(rect.masker()).toBe(null)
      svg.remove()
    })
  })

  describe('targets()', () => {
    it('should get all targets of this maskPath', () => {
      const svg = new SVG().appendTo(document.body)
      const mask = svg.mask()
      const rect = svg.rect(100, 100).maskWith(mask)
      expect(mask.targets()).toEqual([rect])
      svg.remove()
    })
  })
})
