export { debounce, throttle } from 'lodash-es'

type Fn = (...args: any[]) => any

export function apply<T extends Fn>(
  fn: T,
  ctx: ThisParameterType<T>,
  args?: Parameters<T>,
): ReturnType<T> {
  if (args) {
    switch (args.length) {
      case 0:
        return fn.call(ctx)
      case 1:
        return fn.call(ctx, args[0])
      case 2:
        return fn.call(ctx, args[0], args[1])
      case 3:
        return fn.call(ctx, args[0], args[1], args[2])
      case 4:
        return fn.call(ctx, args[0], args[1], args[2], args[3])
      case 5:
        return fn.call(ctx, args[0], args[1], args[2], args[3], args[4])
      case 6:
        return fn.call(
          ctx,
          args[0],
          args[1],
          args[2],
          args[3],
          args[4],
          args[5],
        )
      default:
        return fn.apply(ctx, args)
    }
  }

  return fn.call(ctx)
}

export function call<T extends Fn>(
  fn: T,
  ctx: ThisParameterType<T>,
  ...args: Parameters<T>
): ReturnType<T> {
  return apply(fn, ctx, args)
}
