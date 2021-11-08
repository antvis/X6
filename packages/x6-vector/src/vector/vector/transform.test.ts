import sinon from 'sinon'
import { Global } from '../../global'
import { Matrix } from '../../struct/matrix'
import { Point } from '../../struct/point'
import { G } from '../g/g'
import { Rect } from '../rect/rect'
import { SVG } from '../svg/svg'

describe('Vector', () => {
  describe('toParent()', () => {
    it('should return itself', () => {
      const svg = new SVG()
      const g = svg.group()
      const rect = g.rect(100, 100)
      expect(rect.toParent(svg)).toBe(rect)
    })

    it('should do nothing if the parent is the the current element', () => {
      const svg = new SVG().appendTo(document.body)
      const g = svg.group()
      const parent = g.parent()
      const index = g.index()
      g.toParent(g)
      expect(g.parent()).toBe(parent)
      expect(g.index()).toBe(index)
      svg.remove()
    })

    it('should move the element to a different container without changing its visual representation [1]', () => {
      const svg = new SVG().appendTo(document.body)
      const g = svg.group().matrix(1, 0, 1, 1, 0, 1)
      const rect = g.rect(100, 100)
      rect.toParent(svg)
      expect(rect.matrix()).toEqual(new Matrix(1, 0, 1, 1, 0, 1))
      expect(rect.parent()).toBe(svg)
      svg.remove()
    })

    it('should move the element to a different container without changing its visual representation [2]', () => {
      const svg = new SVG().appendTo(document.body)
      const g = svg.group().translate(10, 20)
      const rect = g.rect(100, 100)
      const g2 = svg.group().rotate(10)
      rect.toParent(g2)
      const actual = rect.matrix()
      const expected = new Matrix().translate(10, 20).rotate(-10)

      const factors = 'abcdef'.split('')
      // funny enough the dom seems to shorten the floats and precision gets lost
      factors.forEach((prop: 'a') =>
        expect(actual[prop]).toBeCloseTo(expected[prop], 5),
      )

      svg.remove()
    })

    it('should insert the element at the specified position', () => {
      const svg = new SVG()
      const g = svg.group()
      const rect = g.rect(100, 100)
      svg.rect(100, 100)
      svg.rect(100, 100)
      expect(rect.toParent(svg, 2).index()).toBe(2)
    })
  })

  describe('toRoot()', () => {
    it('should call `toParent()` with root node', () => {
      const svg = new SVG()
      const g = svg.group().matrix(1, 0, 1, 1, 0, 1)
      const rect = g.rect(100, 100)
      const spy = sinon.spy(rect, 'toParent')
      rect.toRoot(3)
      expect(spy.callCount).toEqual(1)
      expect(spy.args[0]).toEqual([svg, 3])
    })

    it('should do nothing when the element do not have a root', () => {
      const g = new G()
      const rect = g.rect()
      rect.toRoot()
      expect(rect.parent()).toBe(g)
    })
  })

  describe('toLocalPoint()', () => {
    it('should transform a screen point into the coordinate system of the element', () => {
      const rect = new Rect()
      spyOn(rect, 'screenCTM').and.callFake(
        () => new Matrix(1, 0, 0, 1, 20, 20),
      )
      expect(rect.toLocalPoint({ x: 10, y: 10 })).toEqual(new Point(-10, -10))
      expect(rect.toLocalPoint(10, 10)).toEqual(new Point(-10, -10))
    })
  })

  describe('ctm()', () => {
    it('should return the native ctm wrapped into a matrix', () => {
      const rect = new Rect()
      const spy = sinon.spy(rect.node, 'getCTM')
      rect.ctm()
      expect(spy.callCount).toEqual(1)
    })
  })

  describe('screenCTM()', () => {
    it('should return the native screenCTM wrapped into a matrix for a normal element', () => {
      const rect = new Rect()
      const spy = sinon.spy(rect.node, 'getScreenCTM')
      rect.screenCTM()
      expect(spy.callCount).toEqual(1)
    })

    it('should do extra work for nested svgs because firefox needs it', () => {
      const spy = sinon.spy(
        Global.window.SVGGraphicsElement.prototype,
        'getScreenCTM',
      )
      const svg = new SVG().nested()
      svg.screenCTM()
      expect(spy.callCount).toEqual(1)
    })
  })
})
