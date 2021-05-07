import { Box } from '../../struct/box'
import { Svg } from '../svg/svg'

describe('Viewbox', () => {
  describe('viewbox()', () => {
    it('should set the viewbox of the element', () => {
      const svg = new Svg().viewbox(10, 10, 200, 200)
      expect(svg.attr('viewBox')).toEqual('10 10 200 200')
    })

    it('should gets the viewbox of the element', () => {
      const svg = new Svg().viewbox(10, 10, 200, 200)
      expect(svg.viewbox()).toBeInstanceOf(Box)
      expect(svg.viewbox().toArray()).toEqual([10, 10, 200, 200])
    })
  })

  describe('zoom()', () => {
    it('should zoom around the center by default', () => {
      const svg = new Svg().size(100, 50).viewbox(0, 0, 100, 50).zoom(2)
      expect(svg.attr('viewBox')).toEqual('25 12.5 50 25')
    })

    it('should zoom around a point', () => {
      const svg = new Svg()
        .size(100, 50)
        .viewbox(0, 0, 100, 50)
        .zoom(2, { x: 0, y: 0 })
      expect(svg.attr('viewBox')).toEqual('0 0 50 25')
    })

    it('should get the zoom', () => {
      const svg = new Svg().size(100, 50).viewbox(0, 0, 100, 50).zoom(2)
      expect(svg.zoom()).toEqual(2)
    })

    it('should get the zoom with clientHeight', () => {
      const svg = new Svg()
        .css({ width: '100px', height: '50px' })
        .viewbox(25, 12.5, 50, 25)

      expect(svg.zoom()).toEqual(0)
    })

    it('should handle zoom level 0 which is - which basically sets the viewbox to a very high value', () => {
      const svg = new Svg().size(100, 50).viewbox(0, 0, 100, 50).zoom(0)
      expect(svg.zoom()).toBeCloseTo(0, 10)
    })

    it('should handle zoom level 0 and can recover from it', () => {
      const svg = new Svg().size(100, 50).viewbox(0, 0, 100, 50).zoom(0).zoom(1)
      expect(svg.zoom()).toBe(1)
    })
  })
})
