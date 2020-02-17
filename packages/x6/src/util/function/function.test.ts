import sinon from 'sinon'
import { FunctionExt } from '.'

describe('FunctionExt', () => {
  describe('#call', () => {
    it('should invoke function with empty args', () => {
      const spy = sinon.spy()
      const ctx = {}
      FunctionExt.call(spy, ctx)
      expect(spy.calledOn(ctx)).toBeTruthy()
      expect(spy.calledWith()).toBeTruthy()
    })

    it('should invoke function with one args', () => {
      const spy = sinon.spy()
      const ctx = {}
      FunctionExt.call(spy, ctx, 1)
      expect(spy.calledOn(ctx)).toBeTruthy()
      expect(spy.calledWith(1)).toBeTruthy()
    })

    it('should invoke function with two args', () => {
      const spy = sinon.spy()
      const ctx = {}
      FunctionExt.call(spy, ctx, 1, '2')
      expect(spy.calledOn(ctx)).toBeTruthy()
      expect(spy.calledWith(1, '2')).toBeTruthy()
    })

    it('should invoke function with three args', () => {
      const spy = sinon.spy()
      const ctx = {}
      FunctionExt.call(spy, ctx, 1, '2', true)
      expect(spy.calledOn(ctx)).toBeTruthy()
      expect(spy.calledWith(1, '2', true)).toBeTruthy()
    })

    it('should invoke function with four args', () => {
      const spy = sinon.spy()
      const ctx = {}
      const obj = {}
      FunctionExt.call(spy, ctx, 1, '2', true, obj)
      expect(spy.calledOn(ctx)).toBeTruthy()
      expect(spy.calledWith(1, '2', true, obj)).toBeTruthy()
    })

    it('should invoke function with five args', () => {
      const spy = sinon.spy()
      const ctx = {}
      const obj = {}
      const reg = /a/g
      FunctionExt.call(spy, ctx, 1, '2', true, obj, reg)
      expect(spy.calledOn(ctx)).toBeTruthy()
      expect(spy.calledWith(1, '2', true, obj, reg)).toBeTruthy()
    })

    it('should invoke function with six args', () => {
      const spy = sinon.spy()
      const ctx = {}
      const obj = {}
      const reg = /a/g
      const arr = [1, 2, 3]
      FunctionExt.call(spy, ctx, 1, '2', true, obj, reg, arr)
      expect(spy.calledOn(ctx)).toBeTruthy()
      expect(spy.calledWith(1, '2', true, obj, reg, arr)).toBeTruthy()
    })

    it('should invoke function with more args', () => {
      const spy = sinon.spy()
      const ctx = {}
      const obj = {}
      const reg = /a/g
      const arr = [1, 2, 3]
      FunctionExt.call(spy, ctx, 1, '2', true, obj, reg, arr, 'more')
      expect(spy.calledOn(ctx)).toBeTruthy()
      expect(spy.calledWith(1, '2', true, obj, reg, arr, 'more')).toBeTruthy()
    })
  })

  describe('#apply', () => {
    it('should invoke function with empty args', () => {
      const spy = sinon.spy()
      const ctx = {}
      FunctionExt.apply(spy, ctx)
      expect(spy.calledOn(ctx)).toBeTruthy()
      expect(spy.calledWith()).toBeTruthy()
    })

    it('should invoke function with one args', () => {
      const spy = sinon.spy()
      const ctx = {}
      FunctionExt.apply(spy, ctx, [1])
      expect(spy.calledOn(ctx)).toBeTruthy()
      expect(spy.calledWith(1)).toBeTruthy()
    })

    it('should invoke function with two args', () => {
      const spy = sinon.spy()
      const ctx = {}
      FunctionExt.apply(spy, ctx, [1, '2'])
      expect(spy.calledOn(ctx)).toBeTruthy()
      expect(spy.calledWith(1, '2')).toBeTruthy()
    })

    it('should invoke function with three args', () => {
      const spy = sinon.spy()
      const ctx = {}
      FunctionExt.apply(spy, ctx, [1, '2', true])
      expect(spy.calledOn(ctx)).toBeTruthy()
      expect(spy.calledWith(1, '2', true)).toBeTruthy()
    })

    it('should invoke function with four args', () => {
      const spy = sinon.spy()
      const ctx = {}
      const obj = {}
      FunctionExt.apply(spy, ctx, [1, '2', true, obj])
      expect(spy.calledOn(ctx)).toBeTruthy()
      expect(spy.calledWith(1, '2', true, obj)).toBeTruthy()
    })

    it('should invoke function with five args', () => {
      const spy = sinon.spy()
      const ctx = {}
      const obj = {}
      const reg = /a/g
      FunctionExt.apply(spy, ctx, [1, '2', true, obj, reg])
      expect(spy.calledOn(ctx)).toBeTruthy()
      expect(spy.calledWith(1, '2', true, obj, reg)).toBeTruthy()
    })

    it('should invoke function with six args', () => {
      const spy = sinon.spy()
      const ctx = {}
      const obj = {}
      const reg = /a/g
      const arr = [1, 2, 3]
      FunctionExt.apply(spy, ctx, [1, '2', true, obj, reg, arr])
      expect(spy.calledOn(ctx)).toBeTruthy()
      expect(spy.calledWith(1, '2', true, obj, reg, arr)).toBeTruthy()
    })

    it('should invoke function with more args', () => {
      const spy = sinon.spy()
      const ctx = {}
      const obj = {}
      const reg = /a/g
      const arr = [1, 2, 3]
      FunctionExt.apply(spy, ctx, [1, '2', true, obj, reg, arr, 'more'])
      expect(spy.calledOn(ctx)).toBeTruthy()
      expect(spy.calledWith(1, '2', true, obj, reg, arr, 'more')).toBeTruthy()
    })
  })

  describe('#cacher', () => {
    it('shoule cache function results with same args', () => {
      let counter = 0
      const raw = (a: number, b: number) => {
        counter += 1
        return a + b
      }

      const fn = FunctionExt.cacher(raw)
      const ret1 = fn(1, 2)
      expect(counter).toBe(1)

      const ret2 = fn(1, 2)
      expect(counter).toBe(1)
      expect(ret1).toBe(ret2)

      fn(2, 3)
      expect(counter).toBe(2)
    })

    it('shoule remove cache when reach the max cache count', () => {
      let counter = 0
      const raw = (a: number, b: number) => {
        counter += 1
        return a + b
      }

      const fn = FunctionExt.cacher(raw)
      fn(1, 2)
      expect(counter).toBe(1)

      for (let i = 0; i < 1000; i += 1) {
        fn(i, i)
      }

      fn(1, 2)
      expect(counter).toBe(1002)
    })

    it('shoule cache function with specified context', () => {
      const ctx = {}
      const spy = sinon.spy()
      const fn = FunctionExt.cacher(spy, ctx)
      fn()
      expect(spy.calledOn(ctx)).toBeTruthy()
    })

    it('shoule return result processed by post processor', () => {
      let counter = 0
      const raw = (a: number, b: number) => {
        counter += 1
        return a + b
      }

      const processor = (v: number, hasCache: boolean) => {
        return hasCache ? -v : v
      }

      const fn = FunctionExt.cacher(raw, {}, processor)
      const ret1 = fn(1, 2)
      const ret2 = fn(1, 2)

      expect(counter).toBe(1)
      expect(ret1).toBe(3)
      expect(ret2).toBe(-3)
    })
  })
})
