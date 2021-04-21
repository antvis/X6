import { G } from '../g/g'
import { Rect } from '../rect/rect'
import { A } from './a'

describe('A', () => {
  const url = 'https://placeholder.com'

  describe('linker()', () => {
    it('should return the instance of the link of a linked element', () => {
      const link = new A().to(url)
      const rect = link.rect(100, 100)
      expect(rect.linker()).toBe(link)
    })

    it('should return null if no link is found', () => {
      const group = new G()
      const rect = group.rect(100, 100)
      expect(rect.linker()).toBe(null)
    })

    it('should return null if the element is not in dom at all', () => {
      const group = new G()
      expect(group.linker()).toBe(null)
    })
  })

  describe('unlink()', () => {
    it('should return itself', () => {
      const group = new G()
      expect(group.unlink()).toBe(group)
    })

    it('should remove the link', () => {
      const group = new G()
      const link = group.link(url)
      const rect = link.rect(100, 100)

      expect(rect.unlink().parent()).toBe(group)
      expect(link.parent()).toBe(null)
    })

    it("should remove also the link when link wasn't in document", () => {
      const link = new A().to(url)
      const rect = link.rect(100, 100)

      expect(rect.unlink().parent()).toBe(null)
      expect(link.parent()).toBe(null)
    })
  })

  describe('linkTo()', () => {
    it('should wrap the called element in a link with given url', () => {
      const rect = new Rect()
      rect.linkTo(url)
      expect(rect.linker()).toBeInstanceOf(A)
      expect(rect.linker()!.attr('href')).toBe(url)
    })

    it('should wrap the called element in a link with given block', () => {
      const rect = new Rect()
      rect.linkTo((link) => {
        link.to(url).target('_blank')
      })
      expect(rect.linker()!.attr('href')).toBe(url)
      expect(rect.linker()!.attr('target')).toBe('_blank')
    })

    it('should reuse existing link if possible', () => {
      const rect = new Rect()
      rect.linkTo(url)
      const link = rect.linker()
      rect.linkTo(`${url}/something`)
      expect(rect.linker()).toBe(link)
    })
  })
})
