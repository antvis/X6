import { G } from '../g/g'
import { A } from './a'

describe('A', () => {
  const url = 'https://placeholder.com'

  describe('constructor()', () => {
    it('should create an instance', () => {
      expect(A.create()).toBeInstanceOf(A)
    })

    it('should create an instance with given attributes', () => {
      expect(A.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an instance with given url and attributes', () => {
      const g = new G()
      const a = g.link(url, { id: 'foo' })
      expect(a.id()).toBe('foo')
      expect(a.to()).toBe(url)
      expect(a.attr('href')).toBe(url)
    })
  })

  describe('to()', () => {
    it('should get/set xlink:href attribute', () => {
      const link = new A()
      link.to(url)
      expect(link.attr('href')).toBe(url)
    })
  })

  describe('target()', () => {
    it('should get/set target attribute', () => {
      const link = new A()
      link.target('_blank')
      expect(link.attr('target')).toBe('_blank')
    })
  })
})
