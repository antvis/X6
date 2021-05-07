import { G } from '../g/g'
import { Polyline } from './polyline'

describe('Polyline', () => {
  describe('constructor()', () => {
    it('should create an instance with given attributes', () => {
      expect(Polyline.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an instance with path string and attributes', () => {
      const line = Polyline.create('1 2 3 4', { id: 'foo' })
      expect(line.toArray()).toEqual([
        [1, 2],
        [3, 4],
      ])
      expect(line.id()).toEqual('foo')
    })

    it('should create an instance from container', () => {
      const g = new G()
      const line = g.polyline('1 2 3 4', { id: 'foo' })
      expect(line.toArray()).toEqual([
        [1, 2],
        [3, 4],
      ])
      expect(line.id()).toEqual('foo')
    })
  })
})
