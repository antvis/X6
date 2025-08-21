import { FunctionExt } from '../function'

export function call(list: any[], args?: any[]) {
  const results: any[] = []
  for (let i = 0; i < list.length; i += 2) {
    const handler = list[i]
    const context = list[i + 1]
    const params = Array.isArray(args) ? args : [args]
    const ret = FunctionExt.apply(handler, context, params)
    results.push(ret)
  }

  return FunctionExt.toAsyncBoolean(results)
}
