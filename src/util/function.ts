import { isFunction } from './lang'

export function invoke(
  fn: (...a: any[]) => any,
  args: any[],
  context: any,
) {
  let ret
  if (isFunction(fn)) {
    const len = args.length
    if (len === 0) {
      ret = fn.call(context)
    } else if (len === 1) {
      ret = fn.call(context, args[0])
    } else if (len === 2) {
      ret = fn.call(context, args[0], args[1])
    } else if (len === 3) {
      ret = fn.call(context, args[0], args[1], args[2])
    } else if (len === 4) {
      ret = fn.call(context, args[0], args[1], args[2], args[3])
    } else if (len === 5) {
      ret = fn.call(context, args[0], args[1], args[2], args[3], args[4])
    } else if (len === 6) {
      ret = fn.call(context, args[0], args[1], args[2], args[3], args[4], args[5])
    } else {
      ret = fn.apply(context, args)
    }
  }
  return ret
}
