import { isFunction } from './lang'

export function invoke<T>(
  func: ((...args: any[]) => T) | null | undefined,
  args: any[],
  ctx: any,
): T {
  let ret

  if (isFunction(func)) {
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
  args: any[],
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
