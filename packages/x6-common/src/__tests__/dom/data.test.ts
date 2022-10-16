import { Vector } from '../../vector'
import { Dom } from '../../dom'
import { ObjectExt } from '../../object'

describe('Dom', () => {
  describe('data', () => {
    it('should get empty data for a new element', () => {
      const vel = Vector.create('rect')
      const node = vel.node as Element

      const data = Dom.data(node)
      expect(ObjectExt.isEmpty(data)).toEqual(true)
    })

    it('should set/get all data for a element', () => {
      const vel = Vector.create('rect')
      const node = vel.node as Element

      const key = 'dataKey'
      const value = { foo: 'foo', bar: 20 }
      Dom.data(node, key, value)

      const data = Dom.data(node)!
      expect(data[key].foo).toEqual(value.foo)
      expect(data[key].bar).toEqual(value.bar)
    })

    it('should set/get correct data for a element', () => {
      const vel = Vector.create('rect')
      const node = vel.node as Element

      const key = 'data-key'
      const value = { foo: 'foo', bar: 20 }
      Dom.data(node, key, value)

      const data = Dom.data(node, key)
      expect(data.foo).toEqual(value.foo)
      expect(data.bar).toEqual(value.bar)
    })
  })
})
