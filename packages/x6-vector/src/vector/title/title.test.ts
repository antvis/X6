import { G } from '../g/g'
import { Title } from './title'

describe('Title', () => {
  describe('constructor()', () => {
    it('should create a new object of type Title', () => {
      expect(new Title()).toBeInstanceOf(Title)
    })

    it('should set passed attributes on the element', () => {
      expect(Title.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an instance from element', () => {
      const title = new G().title('foo', { id: 'foo' })
      expect(title.node.textContent).toEqual('foo')
      expect(title.id()).toBe('foo')
    })
  })

  describe('update()', () => {
    it('should update desc with text', () => {
      const title = Title.create()
      title.update('foo')
      expect(title.node.textContent).toEqual('foo')
    })

    it('should remove desc content when pass null', () => {
      const title = Title.create('foo')
      expect(title.node.textContent).toEqual('foo')
      title.update(null)
      expect(title.node.textContent).toEqual('')
    })

    it('should update desc with callback', () => {
      const title = Title.create()
      title.update((instance) => (instance.node.textContent = 'foo'))
      expect(title.node.textContent).toEqual('foo')
    })
  })
})
