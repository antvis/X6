import sinon from 'sinon'
import { Env } from '../../global/env'
import { Dom } from '../dom'
import { Hook } from './hook'

describe('Dom', () => {
  describe('attributes', () => {
    describe('attr()', () => {
      it('should set attribute by key-value', () => {
        const div = new Dom('div')
        div.attr('tabIndex', 1)
        div.attr('aria-atomic', 'foo')

        expect(div.attr('tabIndex')).toEqual(1)
        expect(div.attr('aria-atomic')).toEqual('foo' as any)
        expect(div.attr('ariaAtomic')).toEqual('foo')
      })

      it('should not process custom attribute name', () => {
        const div = new Dom('div')
        div.attr('fooBar', 'barz')
        expect(div.attr('fooBar')).toEqual('barz')
        expect(div.attr('foo-bar')).toBeUndefined()
      })

      it('should be case-insensitive for HTMLElement attribute name', () => {
        const div = new Dom('div')
        div.attr('fooBar', 'barz')
        div.attr('tabIndex', 10)
        expect(div.attr('fooBar')).toEqual('barz')
        expect(div.attr('foobar')).toEqual('barz')
        expect(div.attr('Foobar')).toEqual('barz')
        expect(div.attr('tabIndex')).toEqual(10)
        expect(div.attr('tabindex')).toEqual(10)
      })

      it('should remove attribute when the attribute value is null', () => {
        const div = new Dom('div')
        div.attr('fooBar', 'barz')
        div.attr('tabIndex', 10)
        expect(div.attr('fooBar')).toEqual('barz')
        expect(div.attr('tabIndex')).toEqual(10)

        div.attr('fooBar', null)
        div.attr('tabIndex', null)

        expect(div.attr('fooBar')).toBeUndefined()
        expect(div.attr('tabIndex')).toBeUndefined()
      })

      it('should get all attributes', () => {
        const div = new Dom('div')
        div.attr('fooBar', 'barz')
        div.attr('tabIndex', 10)
        const ret = div.attr() as any
        // attribute name was convert to lowercase
        expect(ret.foobar).toEqual('barz')
        // special attribute name
        expect(ret.tabIndex).toEqual(10)
        // unspecified attribute
        expect(ret.left).toEqual(undefined)
        expect(Object.keys(ret).length).toEqual(2)
      })

      it('should get specified attributes by name', () => {
        const div = new Dom('div')
        div.attr('fooBar', 'barz')
        div.attr('tabIndex', 10)
        const ret = div.attr(['fooBar', 'tabIndex'])
        // custom attribute name was keeped
        expect(ret.fooBar).toEqual('barz')
        expect(ret.tabIndex).toEqual(10)
      })

      it('should convert boolean string to boolean', () => {
        const div = new Dom('div')
        div.attr('foo', 'true')
        div.attr('bar', 'false')
        div.attr('barz', 'xxx')
        expect(div.attr('foo')).toBeTrue()
        expect(div.attr('bar')).toBeFalse()
        expect(div.attr('barz')).toEqual('xxx')
      })

      it('should convert numeric string to number', () => {
        const div = new Dom('div')
        div.attr('foo', '1')
        div.attr('bar', '-1')
        div.attr('barz', '1.5')
        expect(div.attr('foo')).toEqual(1)
        expect(div.attr('bar')).toEqual(-1)
        expect(div.attr('barz')).toEqual(1.5)
      })

      it('should set/get special NUMERIC attributes', () => {
        const div = new Dom('div')
        div.attr('tabIndex', '1')
        div.attr('rowSpan', '-1')
        div.attr('colSpan', '2')
        div.attr('start', '1.5')
        expect(div.attr('tabIndex')).toEqual(1)
        expect(div.attr('rowSpan')).toEqual(-1)
        expect(div.attr('colSpan')).toEqual(2)
        expect(div.attr('start')).toEqual(1.5)
      })

      it('should remove invalid value for NUMERIC attribute', () => {
        const div = new Dom('div')
        div.attr('tabIndex', '1')
        expect(div.attr('tabIndex')).toEqual(1)
        div.attr('tabIndex', 'a')
        expect(div.attr('tabIndex')).toBeUndefined()
      })

      it('should set/get special POSITIVE_NUMERIC attributes', () => {
        const div = new Dom('div')
        div.attr('cols', 1)
        div.attr('rows', 2)
        div.attr('size', 3)
        div.attr('span', 4)
        expect(div.attr('cols')).toEqual(1)
        expect(div.attr('rows')).toEqual(2)
        expect(div.attr('size')).toEqual(3)
        expect(div.attr('span')).toEqual(4)
      })

      it('should remove invalid value for POSITIVE_NUMERIC attribute', () => {
        const div = new Dom('div')
        div.attr('cols', 1)
        expect(div.attr('cols')).toEqual(1)
        div.attr('cols', -1)
        expect(div.attr('cols')).toBeUndefined()
      })

      it('should set/get special BOOLEAN attributes', () => {
        const div = new Dom('div')
        div.attr('autoFocus', true)
        div.attr('async', 'true')
        expect(div.attr('autoFocus')).toEqual(true)
        expect(div.attr('async')).toEqual(true)
      })

      it('should remove invalid value for BOOLEAN attribute', () => {
        const div = new Dom('div')
        div.attr('autoFocus', true)
        expect(div.attr('autoFocus')).toEqual(true)

        div.attr('autoFocus', 1)
        expect(div.attr('autoFocus')).toEqual(false)
      })

      it('should convert inline BOOLEAN attributes', () => {
        const div = new Dom('div')
        div.node.setAttribute('autoFocus', 'true')
        expect(div.attr('autoFocus')).toEqual(true)
        div.node.setAttribute('autoFocus', 'false')
        expect(div.attr('autoFocus')).toEqual(false)
      })

      it('should set/get special OVERLOADED_BOOLEAN attributes', () => {
        const div = new Dom('div')
        div.attr('capture', true)
        expect(div.attr('capture')).toEqual(true)
        div.attr('capture', 'demo')
        expect(div.attr('capture')).toEqual('demo')
      })

      it('should convert inline OVERLOADED_BOOLEAN attributes', () => {
        const div = new Dom('div')
        div.node.setAttribute('capture', 'true')
        expect(div.attr('capture')).toEqual(true)
        div.node.setAttribute('capture', 'false')
        expect(div.attr('capture')).toEqual(false)
        div.node.setAttribute('capture', 'demo')
        expect(div.attr('capture')).toEqual('demo')
      })

      it('should remove invalid value for OVERLOADED_BOOLEAN attribute', () => {
        const div = new Dom('div')
        div.attr('capture', true)
        expect(div.attr('capture')).toEqual(true)
        div.attr('capture', 'demo')
        expect(div.attr('capture')).toEqual('demo')
        div.attr('capture', false)
        expect(div.attr('capture')).toEqual(false)
      })

      it('should set/get attributes store on properties', () => {
        const div = new Dom('div')
        div.attr('checked', true)
        expect(div.attr('checked')).toEqual(true)
        div.attr('checked', false)
        expect(div.attr('checked')).toEqual(false)

        div.attr('checked', true)
        expect(div.attr('checked')).toEqual(true)
        div.attr('checked', null)
        expect(div.attr('checked')).toEqual(false)
      })

      it('should set/get special BOOLEANISH_STRING attributes', () => {
        const div = new Dom('div')
        expect(div.attr('draggable')).toEqual(false)
        div.attr('draggable', true)
        expect(div.attr('draggable')).toEqual(true)
        div.attr('draggable', 'false')
        expect(div.attr('draggable')).toEqual(false)
      })

      it('should return style object', () => {
        const div = new Dom('div')
        div.css('left', 10)
        const style = div.attr('style')
        expect(style).toBeInstanceOf(Object)
        expect(style.left).toEqual('10px')
      })

      it('should set style object', () => {
        const div = new Dom('div')
        div.attr('style', { left: 10 })
        expect(div.css('left')).toEqual('10px')
      })

      it('should set style string', () => {
        const div = new Dom('div')
        div.attr('style', 'left: 10px')
        expect(div.css('left')).toEqual('10px')
      })

      it('should sanitize url', () => {
        const div = new Dom('div')
        div.attr('src', 'http://www.a.com')
        expect(div.attr('src')).toEqual('http://www.a.com')

        const spy = sinon.spy(console, 'error')
        const env = Env as any
        const old = env.isDev
        env.isDev = true

        // eslint-disable-next-line no-script-url
        div.attr('src', 'javascript:;')
        expect(spy.callCount).toEqual(1)

        env.isDev = old
        spy.restore()
      })

      it('should auto set attribute with namespace', () => {
        const svg = new Dom('svg')
        svg.attr('xmlLang', 'foo')
        expect(svg.attr('xmlLang')).toEqual('foo')
      })

      it('should remove attribute with function value', () => {
        const div = new Dom('div')
        div.attr('foo', 'bar')
        expect(div.attr('foo')).toEqual('bar')
        div.attr('foo', (() => {}) as any)
        expect(div.attr('foo')).toBeUndefined()
      })

      it('should remove attribute when not accept boolean values', () => {
        const div = new Dom('div')
        div.attr('tabIndex', '1')
        expect(div.attr('tabIndex')).toEqual(1)
        div.attr('tabIndex', false)
        expect(div.attr('tabIndex')).toBeUndefined()
      })

      it('should log error message when attribute not accept empty string', () => {
        const div = new Dom('div')

        div.attr('src', 'http://www.a.com')
        expect(div.attr('src')).toEqual('http://www.a.com')

        const spy = sinon.spy(console, 'error')
        const env = Env as any
        const old = env.isDev
        env.isDev = true

        div.attr('src', '')
        expect(div.attr('src')).toBeUndefined()
        expect(spy.callCount).toEqual(1)

        div.attr('action', 'foo')
        expect(div.attr('action')).toEqual('foo')

        div.attr('action', '')
        expect(div.attr('action')).toBeUndefined()
        expect(spy.callCount).toEqual(2)

        env.isDev = old
        spy.restore()
      })

      it('should log error message when the attribute name is illegal', () => {
        const spy = sinon.spy(console, 'error')
        const env = Env as any
        const old = env.isDev
        env.isDev = true

        const div = new Dom('div')
        div.attr('1', '2')
        expect(spy.callCount).toEqual(1)
        div.attr('1', 2)
        // do not warn again
        expect(spy.callCount).toEqual(1)

        env.isDev = old
        spy.restore()
      })

      it('should call get-hook', () => {
        const div = new Dom('div')
        Hook.register('foo', {
          get() {
            return 10
          },
        })
        expect(div.attr('foo')).toEqual(10)
        div.attr('foo', 100)
        expect(div.attr('foo')).toEqual(10)
        Hook.unregister('foo')
      })

      it('should call set-hook', () => {
        const div = new Dom('div')
        Hook.register('foo', {
          set(node, value) {
            if (typeof value === 'number') {
              node.setAttribute('foo', value > 0 ? '1' : '-1')
              return true
            }
            return false
          },
        })
        div.attr('foo', 'bar')
        expect(div.attr('foo')).toEqual('bar')
        div.attr('foo', 10)
        expect(div.attr('foo')).toEqual(1)
        div.attr('foo', -10)
        expect(div.attr('foo')).toEqual(-1)

        Hook.unregister('foo')
      })
    })

    describe('round()', () => {
      it('should round the specified numeric values', () => {
        const svg = new Dom('svg')
        svg.attr({
          x: 1.33333333,
          y: 1.66666666,
          foo: 'bar',
        })
        svg.round(2, ['x', 'foo'] as any)
        expect(svg.attr('x')).toEqual(1.33)
        expect(svg.attr('y')).toEqual(1.66666666)
        expect(svg.attr('foo')).toEqual('bar')
      })

      it('should round all the numeric values', () => {
        const svg = new Dom('svg')
        svg.attr({
          x: 1.33333333,
          y: 1.66666666,
          foo: 'bar',
        })
        svg.round(2)
        expect(svg.attr('x')).toEqual(1.33)
        expect(svg.attr('y')).toEqual(1.67)
        expect(svg.attr('foo')).toEqual('bar')
      })
    })
  })
})
