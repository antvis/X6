import { Global } from '../../global'
import { namespaces } from '../../util/dom'
import { G } from '..'
import { Fragment } from './fragment'

describe('Fragment', () => {
  describe('constructor()', () => {
    it('should creates a new object of type Fragment', () => {
      expect(new Fragment()).toBeInstanceOf(Fragment)
    })

    it('should use passed node instead of creating', () => {
      const fragment = Global.document.createDocumentFragment()
      expect(new Fragment(fragment).node).toBe(fragment as any)
    })

    it('should have all Container methods available', () => {
      const frag = new Fragment()
      const rect = frag.rect(100, 100)
      expect(frag.children()).toEqual([rect])
    })
  })

  describe('xml()', () => {
    describe('setter', () => {
      it('should call parent method with `outerXML` is `false`', () => {
        const frag = new Fragment()
        frag.xml('<rect />', false, namespaces.svg)
      })
    })

    describe('getter', () => {
      it('should call parent method with `outerXML` is false', () => {
        const frag = new Fragment()
        const group = new G().appendTo(frag)
        group.rect(123.456, 234.567)

        expect(frag.xml(false)).toBe(
          '<g><rect width="123.456" height="234.567"></rect></g>',
        )
      })

      it('should call parent method with default option', () => {
        const frag = new Fragment()
        const group = new G().appendTo(frag)
        group.rect(123.456, 234.567)

        expect(frag.xml()).toBe(
          '<g><rect width="123.456" height="234.567"></rect></g>',
        )
      })
    })
  })
})
