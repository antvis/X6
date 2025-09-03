import { describe, expect, it, vi } from 'vitest'
import { Dom } from '../../../src/common'
import { title } from '../../../src/registry/attr/title'

describe('Title attribute', () => {
  describe('qualify', () => {
    it('should return true for SVGElement', () => {
      const svgElem = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg',
      )
      expect(title.qualify('test', { elem: svgElem })).toBe(true)
    })

    it('should return false for HTMLElement', () => {
      const divElem = document.createElement('div')
      expect(title.qualify('test', { elem: divElem })).toBe(false)
    })
  })

  describe('set', () => {
    it('should create new title element when not exists', () => {
      const svgElem = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg',
      )
      title.set('test title', { elem: svgElem })

      const titleElem = svgElem.firstChild as SVGTitleElement
      expect(titleElem.tagName).toBe('title')
      expect(titleElem.textContent).toBe('test title')
      expect(Dom.data(svgElem, 'x6-title')).toBe('test title')
    })

    it('should update existing title element', () => {
      const svgElem = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg',
      )
      const existingTitle = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'title',
      )
      existingTitle.textContent = 'old title'
      svgElem.appendChild(existingTitle)

      title.set('new title', { elem: svgElem })

      const titleElem = svgElem.firstChild as SVGTitleElement
      expect(titleElem.textContent).toBe('new title')
      expect(Dom.data(svgElem, 'x6-title')).toBe('new title')
    })

    it('should not update when title is same as cached', () => {
      const svgElem = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg',
      )
      Dom.data(svgElem, 'x6-title', 'cached title')
      const spy = vi.spyOn(Dom, 'data')

      title.set('cached title', { elem: svgElem })

      expect(spy).toHaveBeenCalledTimes(1) // 只会在检查时调用一次
      expect(svgElem.childNodes.length).toBe(0) // 不会创建新的title元素
    })
  })
})
