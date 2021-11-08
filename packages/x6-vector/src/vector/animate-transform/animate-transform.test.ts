import { G } from '../g/g'
import { Circle } from '../circle/circle'
import { AnimateTransform } from './animate-transform'

describe('Animate', () => {
  describe('constructor()', () => {
    it('should create an AnimateTransform', () => {
      expect(AnimateTransform.create()).toBeInstanceOf(AnimateTransform)
    })

    it('should create an AnimateTransform with given attributes', () => {
      expect(AnimateTransform.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an AnimateTransform in a group', () => {
      const group = new G()
      const animate = group.animateTransform({ id: 'foo' })
      expect(animate.attr('id')).toBe('foo')
      expect(animate).toBeInstanceOf(AnimateTransform)
    })

    it('should create an AnimateTransform in a circle', () => {
      const circle = new Circle()
      const animate = circle.animateTransform({ id: 'foo' })
      expect(animate.attr('id')).toBe('foo')
      expect(animate).toBeInstanceOf(AnimateTransform)
    })
  })
})
