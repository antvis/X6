export { isFunction, once, noop, debounce, defer } from 'lodash-es'

export function invoke<T>(
  func: (...args: any[]) => T,
  args: any[],
  ctx: any,
): T {
  switch (args.length) {
    case 0:
      return func.call(ctx)
    case 1:
      return func.call(ctx, args[0])
    case 2:
      return func.call(ctx, args[0], args[1])
    case 3:
      return func.call(ctx, args[0], args[1], args[2])
    case 4:
      return func.call(ctx, args[0], args[1], args[2], args[3])
    case 5:
      return func.call(ctx, args[0], args[1], args[2], args[3], args[4])
    case 6:
      return func.call(
        ctx,
        args[0],
        args[1],
        args[2],
        args[3],
        args[4],
        args[5],
      )
    default:
      return func.apply(ctx, args)
  }
}

export function apply<T>(
  func: (...args: any[]) => T,
  ctx: any,
  args: any[] = [],
): T {
  return invoke(func, args, ctx)
}

export function call<T>(
  func: (...args: any[]) => T,
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
