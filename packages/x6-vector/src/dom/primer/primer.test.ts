import { Dom } from '../dom'
import { G } from '../../vector/g/g'
import { Svg } from '../../vector/svg/svg'

describe('Dom', () => {
  describe('constructor', () => {
    it('should create element with the given node', () => {
      const div = new Dom(document.createElement('div'), { tabIndex: 1 })
      expect(div.type.toLowerCase()).toEqual('div')
      expect(div.attr('tabIndex')).toEqual(1)
    })

    it('should create element with the given tagName', () => {
      const div = new Dom('div', { tabIndex: 1 })
      expect(div.type.toLowerCase()).toEqual('div')
      expect(div.attr('tabIndex')).toEqual(1)
    })

    it('should create a div by default', () => {
      const div = new Dom()
      expect(div.type.toLowerCase()).toEqual('div')
      expect(div.node).toBeInstanceOf(HTMLDivElement)
    })

    it('should create element with the given tagName and return the correct type', () => {
      const g = new Dom('g')
      expect(g.type.toLowerCase()).toEqual('g')
      expect(g.node).toBeInstanceOf(SVGGElement)

      const svg = new Dom('svg', { x: 10, y: 10 } as any)
      expect(svg.type.toLowerCase()).toEqual('svg')
      expect(svg.node).toBeInstanceOf(SVGSVGElement)
      expect(svg.attr('x')).toEqual(10)
      expect(svg.attr('y')).toEqual(10)
    })

    it('should create element with auto detected tagName', () => {
      const g = new G()
      expect(g.type.toLowerCase()).toEqual('g')
      expect(g.node).toBeInstanceOf(SVGGElement)

      const svg = new Svg({ x: 10, y: 10 })
      expect(svg.type.toLowerCase()).toEqual('svg')
      expect(svg.node).toBeInstanceOf(SVGSVGElement)
      expect(svg.attr('x')).toEqual(10)
      expect(svg.attr('y')).toEqual(10)
    })

    it('should throw an error', () => {
      class HTML extends Dom {}
      expect(() => new HTML()).toThrowError()
    })
  })
})
