import { Dom } from '../dom'

describe('Dom', () => {
  describe('data', () => {
    describe('data()', () => {
      it('should set data attribute by key-value', () => {
        const div = new Dom('div')
        div.data('key1', 'foo')
        div.data('key2', 1)
        div.data('key3', true)
        div.data('key4', false)
        div.data('key5', null)
        div.data('key6', { a: 1 })

        expect(div.node.getAttribute('data-key1')).toEqual('foo')
        expect(div.node.getAttribute('data-key2')).toEqual('1')
        expect(div.node.getAttribute('data-key3')).toEqual('true')
        expect(div.node.getAttribute('data-key4')).toEqual('false')
        expect(div.node.getAttribute('data-key5')).toEqual('null')
        expect(div.node.getAttribute('data-key6')).toEqual('{"a":1}')
      })

      it('should get data attribute by key', () => {
        const div = new Dom('div')
        div.data('key1', 'foo')
        div.data('key2', 1)
        div.data('key3', true)
        div.data('key4', false)
        div.data('key5', null)
        div.data('key6', { a: 1 })

        expect(div.data('key1')).toEqual('foo')
        expect(div.data('key2')).toEqual(1)
        expect(div.data('key3')).toEqual(true)
        expect(div.data('key4')).toEqual(false)
        expect(div.data('key5')).toBeNull()
        expect(div.data('key6')).toEqual({ a: 1 })
      })

      it('should set data attributes by object', () => {
        const div = new Dom('div')
        div.data({
          key1: 'foo',
          key2: 1,
          key3: true,
          key4: false,
          key5: null,
          key6: { a: 1 },
        })
        expect(div.data('key1')).toEqual('foo')
        expect(div.data('key2')).toEqual(1)
        expect(div.data('key3')).toEqual(true)
        expect(div.data('key4')).toEqual(false)
        expect(div.data('key5')).toBeNull()
        expect(div.data('key6')).toEqual({ a: 1 })
      })

      it('should return all data attributes', () => {
        const div = new Dom('div')
        div.data('key1', 'foo')
        div.data('key2', 1)
        div.data('key3', true)
        div.data('key4', false)
        div.data('key5', null)
        div.data('key6', { a: 1 })
        expect(div.data()).toEqual({
          key1: 'foo',
          key2: 1,
          key3: true,
          key4: false,
          key5: null,
          key6: { a: 1 },
        })
      })

      it('should return specified data attributes', () => {
        const div = new Dom('div')
        div.data('key1', 'foo')
        div.data('key2', 1)
        div.data('key3', true)
        div.data('key4', false)
        div.data('key5', null)
        div.data('key6', { a: 1 })
        expect(div.data(['key1', 'key6', 'key'])).toEqual({
          key1: 'foo',
          key6: { a: 1 },
          key: null,
        })
      })
    })
  })
})
