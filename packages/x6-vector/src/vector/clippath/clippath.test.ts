import { Svg } from '../svg/svg'
import { ClipPath } from './clippath'

describe('ClipPath', () => {
  describe('constructor()', () => {
    it('should create an instance', () => {
      expect(ClipPath.create()).toBeInstanceOf(ClipPath)
    })

    it('should create an instance with given attributes', () => {
      expect(ClipPath.create({ id: 'foo' }).id()).toBe('foo')
    })
  })

  describe('remove()', () => {
    it('should unclip all targets', () => {
      const svg = new Svg()
      const clip = svg.clip()
      const rect = svg.rect(100, 100).clipWith(clip)
      expect(clip.remove()).toBe(clip)
      expect(rect.clipper()).toBe(null)
    })
  })

  describe('targets()', () => {
    it('should return an empty array when the element is not in SVGSVGElement', () => {
      expect(ClipPath.create().targets()).toEqual([])
    })

    it('should get all targets of this clipPath', () => {
      const svg = new Svg()
      const clip = svg.clip()
      const rect = svg.rect(100, 100).clipWith(clip)
      expect(clip.targets()).toEqual([rect])
    })
  })
})
