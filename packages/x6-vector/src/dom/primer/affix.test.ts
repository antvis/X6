import { Dom } from '..'
import { Affix } from './affix'

describe('Dom', () => {
  describe('affix', () => {
    describe('affix()', () => {
      it('shoule return an empty object when inited', () => {
        const div = new Dom('div')
        expect(div.affix()).toEqual({})
        expect(div.affix('foo')).toBeUndefined()
      })

      it('shoule set affix with the given object', () => {
        const div = new Dom('div')
        div.affix({ foo: 'bar' })
        expect(div.affix()).toEqual({ foo: 'bar' })
        expect(div.affix('foo')).toEqual('bar')
      })

      it('shoule set affix by key-value', () => {
        const div = new Dom('div')
        div.affix('foo', 'bar')
        expect(div.affix()).toEqual({ foo: 'bar' })
        expect(div.affix('foo')).toEqual('bar')
      })

      it('shoule reset affix when pass null as first argument', () => {
        const div = new Dom('div')
        div.affix('foo', 'bar')
        expect(div.affix()).toEqual({ foo: 'bar' })
        expect(div.affix('foo')).toEqual('bar')

        div.affix(null)
        expect(div.affix()).toEqual({})
        expect(div.affix('foo')).toBeUndefined()
      })

      it('shoule remove key when the given value is null', () => {
        const div = new Dom('div')
        div.affix('foo', 'bar')
        div.affix('foo', null)
        expect(div.affix()).toEqual({})
        expect(div.affix('foo')).toBeUndefined()
      })
    })

    describe('storeAffix()', () => {
      it('shoule store affix to dom', () => {
        const div = new Dom('div')
        div.affix({ foo: 'bar' })
        div.storeAffix()
        expect(div.attr(Affix.PERSIST_ATTR_NAME)).toEqual('{"foo":"bar"}')
      })

      it('shoule store affix to dom deeply', () => {
        const div = new Dom('div')
        const span = new Dom('span')

        div.affix({ foo: 'bar' })
        span.affix({ a: 1 })

        div.add(span)
        div.storeAffix(true)

        expect(div.attr(Affix.PERSIST_ATTR_NAME)).toEqual('{"foo":"bar"}')
        expect(span.attr(Affix.PERSIST_ATTR_NAME)).toEqual('{"a":1}')
      })
    })

    describe('restoreAffix()', () => {
      it('shoule restore affix to dom', () => {
        const div = new Dom('div')
        const span = new Dom('span')

        div.affix({ foo: 'bar' })
        span.affix({ a: 1 })

        div.add(span)
        const div2 = div.clone(true)
        const span2 = div2.firstChild()!

        expect(div2.attr(Affix.PERSIST_ATTR_NAME)).toEqual('{"foo":"bar"}')
        expect(span2.attr(Affix.PERSIST_ATTR_NAME)).toEqual('{"a":1}')
      })
    })
  })
})
