import { Dom } from '../dom'

describe('Dom', () => {
  describe('memory', () => {
    describe('memory()', () => {
      it('should return an empty object after inited', () => {
        expect(new Dom('div').memory()).toEqual({})
      })
    })

    describe('remember()', () => {
      it('should remember the given key-value', () => {
        const div = new Dom('div')
        div.remember('key1', 'foo')
        div.remember('key2', 1)
        div.remember('key3', true)
        div.remember('key4', false)
        div.remember('key5', null)
        div.remember('key6', { a: 1 })

        expect(div.remember('key1')).toEqual('foo')
        expect(div.remember('key2')).toEqual(1)
        expect(div.remember('key3')).toEqual(true)
        expect(div.remember('key4')).toEqual(false)
        expect(div.remember('key5')).toBeUndefined()
        expect(div.remember('key6')).toEqual({ a: 1 })
      })

      it('should remember the given object', () => {
        const div = new Dom('div')
        div.remember({
          key1: 'foo',
          key2: 1,
          key3: true,
          key4: false,
          key5: null,
          key6: { a: 1 },
        })

        expect(div.remember('key1')).toEqual('foo')
        expect(div.remember('key2')).toEqual(1)
        expect(div.remember('key3')).toEqual(true)
        expect(div.remember('key4')).toEqual(false)
        expect(div.remember('key5')).toBeUndefined()
        expect(div.remember('key6')).toEqual({ a: 1 })
      })

      it('should forget the key when the given value is null', () => {
        const div = new Dom('div')
        div.remember('key', 'foo')
        div.remember('key', null)
        expect(div.remember('key')).toBeUndefined()
      })
    })

    describe('forget()', () => {
      it('should forget all', () => {
        const div = new Dom('div')
        div.remember('key1', 'foo')
        div.remember('key2', 1)
        div.remember('key3', true)
        div.remember('key4', false)
        div.remember('key5', null)
        div.remember('key6', { a: 1 })

        const keys = ['key1', 'key2', 'key3', 'key4', 'key5', 'key6']

        div.forget()

        keys.forEach((key) => expect(div.remember(key)).toBeUndefined())
      })

      it('should forget the given key(s)', () => {
        const div = new Dom('div')
        div.remember('key1', 'foo')
        div.remember('key2', 1)
        div.remember('key3', true)
        div.remember('key4', false)
        div.remember('key5', null)
        div.remember('key6', { a: 1 })

        const keys = ['key1', 'key2', 'key6']

        div.forget(...keys)

        keys.forEach((key) => expect(div.remember(key)).toBeUndefined())
      })
    })
  })
})
