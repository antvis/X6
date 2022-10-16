import { Vector } from '../../vector'
import { Dom } from '../../dom'

describe('Dom', () => {
  describe('css', () => {
    it('should set right style property for element', () => {
      const vel = Vector.create('rect')
      const node = vel.node as Element

      Dom.css(node, {
        stroke: 'red',
        userDrag: 'auto',
      })

      expect(Dom.css(node, 'stroke')).toEqual('red')
      expect(Dom.css(node, 'webkitUserDrag')).toEqual('auto')
    })
  })
})
