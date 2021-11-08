import { G } from '../g/g'
import { Circle } from '../circle/circle'
import { Animate } from './animate'

describe('Animate', () => {
  describe('constructor()', () => {
    it('should create an Animate', () => {
      expect(Animate.create()).toBeInstanceOf(Animate)
    })

    it('should create an Animate with given attributes', () => {
      expect(Animate.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an Animate in a group', () => {
      const group = new G()
      const animate = group.animate({ id: 'foo' })
      expect(animate.attr('id')).toBe('foo')
      expect(animate).toBeInstanceOf(Animate)
    })

    it('should create an Animate in a circle', () => {
      const circle = new Circle()
      const animate = circle.animate({ id: 'foo' })
      expect(animate.attr('id')).toBe('foo')
      expect(animate).toBeInstanceOf(Animate)
    })
  })

  describe('sugar methods with attributes', () => {
    const methods = [
      'from',
      'to',
      'by',
      'calcMode',
      'values',
      'keyTimes',
      'keySplines',
      'begin',
      'end',
      'dur',
      'min',
      'max',
      'repeatCount',
      'repeatDur',
      'restartMode',
      'fillMode',
      'additive',
      'accumulate',
      'attributeName',
      'attributeType',
    ]
    const values = [
      10,
      20,
      30,
      'linear',
      '0 1 2 3 4',
      'foo',
      'bar',
      '1s',
      '2s',
      '3s',
      '0s',
      '100s',
      3,
      3000,
      'whenNotActive',
      'freeze',
      'replace',
      'none',
      'color',
      'CSS',
    ]

    methods.forEach((method, index) => {
      const val = values[index] as any
      const attrMap = {
        restartMode: 'restart',
        fillMode: 'fill',
      }
      const attr = attrMap[method as keyof typeof attrMap] || method

      it(`should call attribute with "${method}" and return itself`, () => {
        const animate = new Animate()
        const spy = spyOn(animate, 'attr').and.callThrough()
        expect(animate[method as 'from'](val)).toBe(animate)
        expect(spy).toHaveBeenCalledWith(attr, val)
      })

      it(`should get the "${method}" atribute`, () => {
        const animate = Animate.create()
        animate[method as 'from'](val)
        expect(animate[method as 'from']()).toBe(val)
      })
    })
  })
})
