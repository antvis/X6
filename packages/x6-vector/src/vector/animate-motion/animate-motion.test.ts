import { G } from '../g/g'
import { Circle } from '../circle/circle'
import { AnimateMotion } from './animate-motion'

describe('Animate', () => {
  describe('constructor()', () => {
    it('should create an AnimateMotion', () => {
      expect(AnimateMotion.create()).toBeInstanceOf(AnimateMotion)
    })

    it('should create an AnimateMotion with given attributes', () => {
      expect(AnimateMotion.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an AnimateMotion in a group', () => {
      const group = new G()
      const animate = group.animateMotion({ id: 'foo' })
      expect(animate.attr('id')).toBe('foo')
      expect(animate).toBeInstanceOf(AnimateMotion)
    })

    it('should create an AnimateMotion in a circle', () => {
      const circle = new Circle()
      const animate = circle.animateMotion({ id: 'foo' })
      expect(animate.attr('id')).toBe('foo')
      expect(animate).toBeInstanceOf(AnimateMotion)
    })
  })
})
