import { createSVGNode } from '../../util/dom'
import { Fragment, G, Vector } from '../../vector'
import { Dom } from '../dom'
import { Base } from './base'
import { Registry } from './registry'

describe('Registry', () => {
  class Foo extends Base {}

  beforeEach(() => {
    Registry.register(Foo, 'foo')
  })

  afterEach(() => {
    Registry.unregister('foo')
  })

  describe('getClass()', () => {
    it('should return class by Node name', () => {
      expect(Registry.getClass('Foo')).toEqual(Foo)
      expect(Registry.getClass('foo')).toEqual(Foo)
      expect(Registry.getClass('FOO')).toEqual(Foo)
    })

    it('should return class by HTMLElement instance', () => {
      expect(Registry.getClass(document.createElement('div'))).toEqual(Dom)
      expect(Registry.getClass(document.createElement('span'))).toEqual(Dom)
    })

    it('should return class by SVGElement instance', () => {
      expect(Registry.getClass(createSVGNode('g'))).toEqual(G)
      expect(Registry.getClass(createSVGNode('gg'))).toEqual(Vector)
    })

    it('should return Fragment', () => {
      expect(Registry.getClass(document.createDocumentFragment())).toEqual(
        Fragment,
      )
    })

    it('should fallback to return Dom when can not find the associated class', () => {
      expect(Registry.getClass('bar')).toEqual(Dom)
    })
  })

  describe('getTagName()', () => {
    it('should return the tagName associate with the class', () => {
      expect(Registry.getTagName(Foo)).toEqual('foo')
    })

    it('should return null when class not registered', () => {
      class Bar extends Base {}
      expect(Registry.getTagName(Bar)).toBeNull()
    })
  })

  describe('isRegisted()', () => {
    it('should return true when the given tagName indicated class is registered', () => {
      expect(Registry.isRegisted('Foo')).toBeTrue()
      expect(Registry.isRegisted('foo')).toBeTrue()
      expect(Registry.isRegisted('FOO')).toBeTrue()
    })
  })
})
