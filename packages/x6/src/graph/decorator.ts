import { FunctionExt, StringExt } from '../util'
import { BaseGraph } from './base-graph'

export function hook(
  hookName?: string | null,
  ignoreNullResult: boolean = false,
) {
  return (
    target: BaseGraph,
    methodName: string,
    descriptor: PropertyDescriptor,
  ) => {
    const raw = descriptor.value
    const name = hookName || methodName

    descriptor.value = function(this: BaseGraph, ...args: any[]) {
      const hook = (this.options as any)[name]
      if (hook != null) {
        this.getNativeValue = raw.bind(this, ...args)
        const ret = FunctionExt.call(hook, this, ...args)
        delete this.getNativeValue

        if (ret != null || ignoreNullResult) {
          return ret
        }
      }

      return raw.call(this, ...args)
    }
  }
}

export function afterCreate(aopName?: string | null) {
  return (
    target: BaseGraph,
    methodName: string,
    descriptor: PropertyDescriptor,
  ) => {
    const raw = descriptor.value
    const name = aopName || `on${StringExt.ucFirst(methodName)}`

    descriptor.value = function(this: BaseGraph, ...args: any[]) {
      const instance = raw.call(this, ...args)
      const aop = (this.options as any)[name]
      if (aop != null) {
        args.unshift(instance)
        const restult = FunctionExt.apply(aop, this, args)
        if (restult != null) {
          return restult
        }
      }

      return instance
    }
  }
}
