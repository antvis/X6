import sinon from 'sinon'
import { applyMixins, call, apply, once, cacher } from './function'

describe('function', () => {
  describe('#applyMixins', () => {
    let count = 0
    function hook() {
      return (
        target: any,
        methodName: string,
        descriptor: PropertyDescriptor,
      ) => {
        const raw = descriptor.value
        descriptor.value = function(...args: any[]) {
          count += 1
          return raw.call(this, ...args)
        }
      }
    }

    class Disposable {
      isDisposed: boolean
      @hook()
      dispose() {
        this.isDisposed = true
      }
    }

    class Activatable {
      protected isActive: boolean
      activate() {
        this.isActive = true
      }
      deactivate() {
        this.isActive = false
      }
    }

    class SmartObject {}

    interface SmartObject extends Disposable, Activatable {}
    applyMixins(SmartObject, [Disposable, Activatable])

    const instance = new SmartObject()

    expect(instance.isDisposed).toBeFalsy()
    expect(count).toEqual(0)
    instance.dispose()
    expect(instance.isDisposed).toBeTruthy()
    expect(count).toEqual(1)
    instance.dispose()
    expect(instance.isDisposed).toBeTruthy()
    expect(count).toEqual(2)
  })

  describe('#call', () => {
    it('should invoke function with empty args', () => {
      const spy = sinon.spy()
      const ctx = {}
      call(spy, ctx)
      expect(spy.calledOn(ctx)).toBeTruthy()
      expect(spy.calledWith()).toBeTruthy()
    })

    it('should invoke function with one args', () => {
      const spy = sinon.spy()
      const ctx = {}
      call(spy, ctx, 1)
      expect(spy.calledOn(ctx)).toBeTruthy()
      expect(spy.calledWith(1)).toBeTruthy()
    })

    it('should invoke function with two args', () => {
      const spy = sinon.spy()
      const ctx = {}
      call(spy, ctx, 1, '2')
      expect(spy.calledOn(ctx)).toBeTruthy()
      expect(spy.calledWith(1, '2')).toBeTruthy()
    })

    it('should invoke function with three args', () => {
      const spy = sinon.spy()
      const ctx = {}
      call(spy, ctx, 1, '2', true)
      expect(spy.calledOn(ctx)).toBeTruthy()
      expect(spy.calledWith(1, '2', true)).toBeTruthy()
    })

    it('should invoke function with four args', () => {
      const spy = sinon.spy()
      const ctx = {}
      const obj = {}
      call(spy, ctx, 1, '2', true, obj)
      expect(spy.calledOn(ctx)).toBeTruthy()
      expect(spy.calledWith(1, '2', true, obj)).toBeTruthy()
    })

    it('should invoke function with five args', () => {
      const spy = sinon.spy()
      const ctx = {}
      const obj = {}
      const reg = /a/g
      call(spy, ctx, 1, '2', true, obj, reg)
      expect(spy.calledOn(ctx)).toBeTruthy()
      expect(spy.calledWith(1, '2', true, obj, reg)).toBeTruthy()
    })

    it('should invoke function with six args', () => {
      const spy = sinon.spy()
      const ctx = {}
      const obj = {}
      const reg = /a/g
      const arr = [1, 2, 3]
      call(spy, ctx, 1, '2', true, obj, reg, arr)
      expect(spy.calledOn(ctx)).toBeTruthy()
      expect(spy.calledWith(1, '2', true, obj, reg, arr)).toBeTruthy()
    })

    it('should invoke function with more args', () => {
      const spy = sinon.spy()
      const ctx = {}
      const obj = {}
      const reg = /a/g
      const arr = [1, 2, 3]
      call(spy, ctx, 1, '2', true, obj, reg, arr, 'more')
      expect(spy.calledOn(ctx)).toBeTruthy()
      expect(spy.calledWith(1, '2', true, obj, reg, arr, 'more')).toBeTruthy()
    })
  })

  describe('#apply', () => {
    it('should invoke function with empty args', () => {
      const spy = sinon.spy()
      const ctx = {}
      apply(spy, ctx)
      expect(spy.calledOn(ctx)).toBeTruthy()
      expect(spy.calledWith()).toBeTruthy()
    })

    it('should invoke function with one args', () => {
      const spy = sinon.spy()
      const ctx = {}
      apply(spy, ctx, [1])
      expect(spy.calledOn(ctx)).toBeTruthy()
      expect(spy.calledWith(1)).toBeTruthy()
    })

    it('should invoke function with two args', () => {
      const spy = sinon.spy()
      const ctx = {}
      apply(spy, ctx, [1, '2'])
      expect(spy.calledOn(ctx)).toBeTruthy()
      expect(spy.calledWith(1, '2')).toBeTruthy()
    })

    it('should invoke function with three args', () => {
      const spy = sinon.spy()
      const ctx = {}
      apply(spy, ctx, [1, '2', true])
      expect(spy.calledOn(ctx)).toBeTruthy()
      expect(spy.calledWith(1, '2', true)).toBeTruthy()
    })

    it('should invoke function with four args', () => {
      const spy = sinon.spy()
      const ctx = {}
      const obj = {}
      apply(spy, ctx, [1, '2', true, obj])
      expect(spy.calledOn(ctx)).toBeTruthy()
      expect(spy.calledWith(1, '2', true, obj)).toBeTruthy()
    })

    it('should invoke function with five args', () => {
      const spy = sinon.spy()
      const ctx = {}
      const obj = {}
      const reg = /a/g
      apply(spy, ctx, [1, '2', true, obj, reg])
      expect(spy.calledOn(ctx)).toBeTruthy()
      expect(spy.calledWith(1, '2', true, obj, reg)).toBeTruthy()
    })

    it('should invoke function with six args', () => {
      const spy = sinon.spy()
      const ctx = {}
      const obj = {}
      const reg = /a/g
      const arr = [1, 2, 3]
      apply(spy, ctx, [1, '2', true, obj, reg, arr])
      expect(spy.calledOn(ctx)).toBeTruthy()
      expect(spy.calledWith(1, '2', true, obj, reg, arr)).toBeTruthy()
    })

    it('should invoke function with more args', () => {
      const spy = sinon.spy()
      const ctx = {}
      const obj = {}
      const reg = /a/g
      const arr = [1, 2, 3]
      apply(spy, ctx, [1, '2', true, obj, reg, arr, 'more'])
      expect(spy.calledOn(ctx)).toBeTruthy()
      expect(spy.calledWith(1, '2', true, obj, reg, arr, 'more')).toBeTruthy()
    })
  })

  describe('#once', () => {
    const spy = sinon.spy()
    const ctx = {}
    const fn = once(spy, ctx)
    fn()
    expect(spy.calledOn(ctx)).toBeTruthy()
    expect(spy.calledOnce).toBeTruthy()
    fn()
    expect(spy.calledOnce).toBeTruthy()
  })

  describe('#cacher', () => {
    it('shoule cache function results with same args', () => {
      let counter = 0
      const raw = (a: number, b: number) => {
        counter += 1
        return a + b
      }

      const fn = cacher(raw)
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

      const fn = cacher(raw)
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
      const fn = cacher(spy, ctx)
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

      const fn = cacher(raw, {}, processor)
      const ret1 = fn(1, 2)
      const ret2 = fn(1, 2)

      expect(counter).toBe(1)
      expect(ret1).toBe(3)
      expect(ret2).toBe(-3)
    })
  })
})
