import { namespaces } from '../../util/dom'
import { Defs } from '../defs/defs'
import { Svg } from './svg'

describe('Svg', () => {
  describe('constructor()', () => {
    it('should create an instance with given attributes', () => {
      expect(Svg.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should add namespaces on creation', () => {
      const svg = new Svg()
      expect(svg.attr('xmlns')).toBe(namespaces.svg)
      expect(svg.attr('version')).toBe(1.1)
      expect(svg.attr('xmlns:xlink')).toBe(namespaces.xlink)
    })
  })

  describe('defs()', () => {
    it('should return the defs if its the root svg', () => {
      const svg = new Svg()
      const defs = new Defs().addTo(svg)
      expect(svg.defs()).toBe(defs)
    })

    it('should return the defs if its not the root svg', () => {
      const svg = new Svg()
      const defs = new Defs().addTo(svg)
      const nested = new Svg().addTo(svg)
      expect(nested.defs()).toBe(defs)
    })

    it('should create the defs if not found', () => {
      const svg = new Svg()
      expect(svg.findOne('defs')).toBe(null)
      const defs = svg.defs()
      expect(svg.findOne('defs')).toBe(defs)
    })
  })

  describe('namespace()', () => {
    it('should create the namespace attributes on the svg', () => {
      const svg = new Svg()
      expect(svg.attr('xmlns')).toBe(namespaces.svg)
      expect(svg.attr('version')).toBe(1.1)
      expect(svg.attr('xmlns:xlink')).toBe(namespaces.xlink)
    })

    it('should create the namespace attributes on the root svg', () => {
      const svg = new Svg()
      const nested = svg.nested()

      nested.namespace()

      expect(svg.attr('xmlns')).toBe(namespaces.svg)
      expect(svg.attr('version')).toBe(1.1)
      expect(svg.attr('xmlns:xlink')).toBe(namespaces.xlink)
    })
  })

  describe('isRoot()', () => {
    it('should return true if svg is the root svg', () => {
      const svg = new Svg().addTo(document.body)
      expect(svg.isRoot()).toBe(true)
      svg.remove()
    })

    it('should return true if its detached from the dom', () => {
      const svg = new Svg()
      expect(svg.isRoot()).toBe(true)
    })

    it('should return false if its the child of a document-fragment', () => {
      const fragment = document.createDocumentFragment()
      const svg = new Svg().addTo(fragment)
      expect(svg.isRoot()).toBe(false)
    })

    it('should return false if its a child of another svg element', () => {
      const svg = new Svg()
      const nested = new Svg().addTo(svg)
      expect(nested.isRoot()).toBe(false)
    })
  })

  describe('removeNamespace()', () => {
    it('should remove the namespace attributes from the svg element', () => {
      const svg = new Svg()

      svg.removeNamespace()

      expect(svg.attr('xmlns')).toBeUndefined()
      expect(svg.attr('version')).toBeUndefined()
      expect(svg.attr('xmlns:xlink')).toBeUndefined()
    })
  })
})
