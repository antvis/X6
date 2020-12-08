import { Vector } from '../vector'
import { styleToObject, mergeAttrs } from './attr'

describe('Dom', () => {
  describe('attr', () => {
    describe('#styleToObject', () => {
      it('should parse style string to object', () => {
        const ret = { fill: 'red', stroke: 'blue' }
        expect(styleToObject('fill=red; stroke=blue')).toEqual(ret)
        expect(styleToObject('fill=red; stroke=blue;')).toEqual(ret)
      })

      it('should parse key-only string', () => {
        expect(styleToObject(';fill=red;;stroke')).toEqual({
          fill: 'red',
          stroke: '',
        })
      })

      it('should ingore empty section', () => {
        expect(styleToObject(';fill=red;;')).toEqual({ fill: 'red' })
      })

      it('should parse empty string to empty object', () => {
        expect(styleToObject('')).toEqual({})
      })
    })

    describe('#mergeAttrs', () => {
      it('shoule merge attrs by extend', () => {
        expect(mergeAttrs({ x: 5, y: 10 }, { y: 20 })).toEqual({ x: 5, y: 20 })
      })

      it('should append class attribute', () => {
        expect(
          mergeAttrs({ x: 5, y: 10, class: 'foo' }, { y: 20, class: 'bar' }),
        ).toEqual({ x: 5, y: 20, class: 'foo bar' })
      })

      it('shoule merge style object', () => {
        const result = { x: 5, y: 20, style: { fill: 'red', stroke: 'orange' } }
        expect(
          mergeAttrs(
            { x: 5, y: 10, style: { fill: 'red', stroke: 'blue' } },
            { y: 20, style: { stroke: 'orange' } },
          ),
        ).toEqual(result)

        expect(
          mergeAttrs(
            { x: 5, y: 10, style: 'fill=red; stroke=blue' },
            { y: 20, style: { stroke: 'orange' } },
          ),
        ).toEqual(result)

        expect(
          mergeAttrs(
            { x: 5, y: 10, style: 'fill=red; stroke=blue' },
            { y: 20, style: 'stroke=orange' },
          ),
        ).toEqual(result)

        expect(
          mergeAttrs(
            { x: 5, y: 10, style: { fill: 'red', stroke: 'blue' } },
            { y: 20, style: 'stroke=orange' },
          ),
        ).toEqual(result)
      })
    })

    describe('#setAttribute', () => {
      it('should set attribute with string/number value', () => {
        const vel = Vector.create('g')
        vel.setAttribute('foo', 'test')
        vel.setAttribute('bar', 100)

        expect(vel.getAttribute('foo')).toEqual('test')
        expect(vel.getAttribute('bar')).toEqual('100')
      })

      it('should remove attribute when value is null/undefined', () => {
        const vel = Vector.create('g')
        vel.setAttribute('foo', 'test')
        vel.setAttribute('bar', 100)

        expect(vel.getAttribute('foo')).toEqual('test')
        expect(vel.getAttribute('bar')).toEqual('100')

        vel.setAttribute('foo')
        vel.setAttribute('bar', null)
        expect(vel.getAttribute('foo')).toEqual(null)
        expect(vel.getAttribute('bar')).toEqual(null)
      })

      it('shoud set/remove qualified attribute', () => {
        const vel = Vector.create('g')
        vel.setAttribute('xlink:href', 'test')
        expect(vel.getAttribute('xlink:href')).toEqual('test')

        vel.removeAttribute('xlink:href')
        expect(vel.getAttribute('xlink:href')).toEqual(null)
      })
    })

    describe('#attr', () => {
      it('should get all attributes', () => {
        const vel = Vector.create('g')
        vel.setAttribute('foo', 'test')
        vel.setAttribute('bar', '100')

        const { id, ...attrs } = vel.attr()
        expect(attrs).toEqual({ foo: 'test', bar: '100' })
      })

      it('should set/get single attribute', () => {
        const vel = Vector.create('g')
        vel.attr('foo', 'test')
        expect(vel.attr('foo')).toEqual('test')
      })

      it('should set attributes', () => {
        const vel = Vector.create('g')
        vel.attr({ foo: 'test', bar: 100 })
        const { id, ...attrs } = vel.attr()
        expect(attrs).toEqual({ foo: 'test', bar: '100' })
      })
    })
  })
})
