import { Dom } from '../dom'
import { G } from '../../vector/g/g'
import { Svg } from '../../vector/svg/svg'

describe('Dom', () => {
  describe('constructor', () => {
    it('should create element with the given node', () => {
      const div = new Dom(document.createElement('div'), { tabIndex: 1 })
      expect(div.type).toEqual('DIV')
      expect(div.attr('tabIndex')).toEqual(1)
    })

    it('should create element with the given tagName', () => {
      const div = new Dom('div', { tabIndex: 1 })
      expect(div.type).toEqual('DIV')
      expect(div.attr('tabIndex')).toEqual(1)
    })

    it('should create element with auto detected tagName', () => {
      const g = new G()
      expect(g.type).toEqual('g')

      const svg = new Svg({ x: 10, y: 10 })
      expect(svg.type).toEqual('svg')
      expect(svg.attr('x')).toEqual(10)
      expect(svg.attr('y')).toEqual(10)
    })

    it('should throw an error', () => {
      class HTML extends Dom {}
      expect(() => new HTML()).toThrowError()
    })
  })
})
