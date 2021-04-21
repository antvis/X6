import { G } from '../g/g'
import { Desc } from './desc'

describe('Desc', () => {
  describe('constructor()', () => {
    it('should create a new object of type Desc', () => {
      expect(new Desc()).toBeInstanceOf(Desc)
    })

    it('should set passed attributes on the element', () => {
      expect(Desc.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an instance from element', () => {
      const desc = new G().desc('foo', { id: 'foo' })
      expect(desc.node.textContent).toEqual('foo')
      expect(desc.id()).toBe('foo')
    })
  })

  describe('update()', () => {
    it('should update desc with text', () => {
      const desc = Desc.create()
      desc.update('foo')
      expect(desc.node.textContent).toEqual('foo')
    })

    it('should remove desc content when pass null', () => {
      const desc = Desc.create('foo')
      expect(desc.node.textContent).toEqual('foo')
      desc.update(null)
      expect(desc.node.textContent).toEqual('')
    })

    it('should update desc with callback', () => {
      const desc = Desc.create()
      desc.update((instance) => (instance.node.textContent = 'foo'))
      expect(desc.node.textContent).toEqual('foo')
    })
  })
})
