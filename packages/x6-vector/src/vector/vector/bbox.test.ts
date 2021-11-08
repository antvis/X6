import { Global } from '../../global'
import { Box } from '../../struct/box'
import { Matrix } from '../../struct/matrix'
import { Rect } from '../rect/rect'
import { SVG } from '../svg/svg'

describe('Vector', () => {
  describe('bbox()', () => {
    it('should returns the bounding box of the element', () => {
      const svg = new SVG().appendTo(document.body)
      const rect = svg.rect().size(100, 200).move(20, 30)

      expect(rect.bbox()).toBeInstanceOf(Box)
      expect(rect.bbox().toArray()).toEqual([20, 30, 100, 200])
      svg.remove()
    })

    it('should return the bounding box of the element even if the node is not in the dom', () => {
      const rect = new Rect().size(100, 200).move(20, 30)
      expect(rect.bbox().toArray()).toEqual([20, 30, 100, 200])
    })

    it('should throw error when it is not possible to get a bbox', () => {
      const spy = spyOn(
        Global.window.SVGGraphicsElement.prototype,
        'getBBox',
      ).and.callFake(() => {
        throw new Error('No BBox for you')
      })
      const rect = new Rect()
      expect(() => rect.bbox()).toThrow()
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('rbox()', () => {
    it('should return the BoundingClientRect of the element', () => {
      document.body.style.margin = '0px'
      document.body.style.padding = '0px'

      const svg = new SVG().appendTo(document.body)
      const rect = new Rect()
        .size(100, 200)
        .move(20, 30)
        .addTo(svg)
        .attr(
          'transform',
          new Matrix({ scale: 2, translate: [40, 50] }).toString(),
        )

      expect(rect.rbox()).toBeInstanceOf(Box)
      expect(rect.rbox().toArray()).toEqual([80, 110, 200, 400])
      svg.remove()

      document.body.style.margin = ''
      document.body.style.padding = ''
    })

    it('should return the rbox box of the element in the coordinate system of the passed element', () => {
      const svg = new SVG().appendTo(document.body)
      const group = svg.group().translate(1, 1)
      const rect = new Rect()
        .size(100, 200)
        .move(20, 30)
        .addTo(svg)
        .attr(
          'transform',
          new Matrix({ scale: 2, translate: [40, 50] }).toString(),
        )

      expect(rect.rbox(group)).toBeInstanceOf(Box)
      expect(rect.rbox(group).toArray()).toEqual([79, 109, 200, 400])
      svg.remove()
    })

    it('should throw error when element is not in dom', () => {
      expect(() => new Rect().rbox()).toThrow()
    })
  })

  describe('containsPoint()', () => {
    it('checks if a point is in the elements borders', () => {
      const svg = new SVG()
      const rect = svg.rect(100, 100)

      expect(rect.containsPoint(50, 50)).toBe(true)
      expect(rect.containsPoint({ x: 50, y: 50 })).toBe(true)

      expect(rect.containsPoint(101, 101)).toBe(false)
    })
  })
})
