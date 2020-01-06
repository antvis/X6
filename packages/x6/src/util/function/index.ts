import { Lang } from '../lang'

export namespace FunctionExt {
  export const isFunction = Lang.isFunction

  export function invoke<T>(
    func: ((...args: any[]) => T) | null | undefined,
    args: any[],
    ctx: any,
  ): T {
    let ret

    if (func != null && isFunction(func)) {
      const fn = func as Function
      const len = args.length

      if (len === 0) {
        ret = fn.call(ctx)
      } else if (len === 1) {
        ret = fn.call(ctx, args[0])
      } else if (len === 2) {
        ret = fn.call(ctx, args[0], args[1])
      } else if (len === 3) {
        ret = fn.call(ctx, args[0], args[1], args[2])
      } else if (len === 4) {
        ret = fn.call(ctx, args[0], args[1], args[2], args[3])
      } else if (len === 5) {
        ret = fn.call(ctx, args[0], args[1], args[2], args[3], args[4])
      } else if (len === 6) {
        ret = fn.call(ctx, args[0], args[1], args[2], args[3], args[4], args[5])
      } else {
        ret = fn.apply(ctx, args)
      }
    }

    return ret
  }

  export function apply<T>(
    func: ((...args: any[]) => T) | null | undefined,
    ctx: any,
    args: any[] = [],
  ): T {
    return invoke(func, args, ctx)
  }

  export function call<T>(
    func: ((...args: any[]) => T) | null | undefined,
    ctx: any,
    ...args: any[]
  ): T {
    return invoke(func, args, ctx)
  }

  function repush<T>(array: T[], item: T) {
    for (let i = 0, ii = array.length; i < ii; i += 1) {
      if (array[i] === item) {
        return array.push(array.splice(i, 1)[0])
      }
    }
  }

  export function cacher<T extends Function>(
    fn: T,
    ctx?: any,
    postProcessor?: (v: any, hasCache?: boolean) => any,
  ): T {
    const keys: string[] = []
    const cache: { [kry: string]: any } = {}
    const f = (...args: any[]) => {
      let hasCache = false
      const key = args.join('\u2400')
      if (key in cache) {
        hasCache = true
        repush(keys, key)
      } else {
        if (keys.length >= 1000) {
          delete cache[keys.shift()!]
        }
        keys.push(key)
        cache[key] = invoke(fn as any, args, ctx)
      }

      return postProcessor ? postProcessor(cache[key], hasCache) : cache[key]
    }

    return (f as any) as T
  }

  export function once<T extends Function>(fn: T, ctx?: any): T {
    let called = false
    let result: any

    return (function(...args: any[]) {
      if (called) {
        return result
      }

      called = true
      result = invoke(fn as any, args, ctx)

      return result
    } as any) as T
  }
}
