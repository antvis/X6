import { createHTMLNode, createSVGNode } from '../../util/dom'
import { G, SVG } from '../../vector'
import { Dom } from '../dom'
import { Adopter } from './adopter'

describe('Adopter', () => {
  describe('adopt()', () => {
    it('should return null when the given node is null', () => {
      expect(Adopter.adopt()).toBeNull()
      expect(Adopter.adopt(null)).toBeNull()
    })

    it('should create an instance with associated class', () => {
      expect(Adopter.adopt(createHTMLNode('div'))).toBeInstanceOf(Dom)
      expect(Adopter.adopt(createSVGNode('g'))).toBeInstanceOf(G)
    })

    it('should reuse the cached instance', () => {
      const node = createSVGNode('g')
      const g = Adopter.adopt(node)
      expect(Adopter.adopt(node)).toBe(g)
    })
  })

  describe('cache()', () => {
    it('should set cache', () => {
      const node = createSVGNode('g')
      const g = new G()
      expect(Adopter.cache(node)).toBeUndefined()
      Adopter.cache(node, g)
      expect(Adopter.cache(node)).toBe(g)
    })

    it('should remove cache', () => {
      const node = createSVGNode('g')
      const g = new G()
      expect(Adopter.cache(node)).toBeUndefined()

      Adopter.cache(node, g)
      expect(Adopter.cache(node)).toBe(g)

      Adopter.cache(node, null)
      expect(Adopter.cache(node)).toBeUndefined()
    })
  })

  describe('makeInstance()', () => {
    it('should create a svg instance with nil arg', () => {
      expect(Adopter.makeInstance()).toBeInstanceOf(SVG)
      expect(Adopter.makeInstance(null)).toBeInstanceOf(SVG)
      expect(Adopter.makeInstance(undefined)).toBeInstanceOf(SVG)
    })
  })
})
