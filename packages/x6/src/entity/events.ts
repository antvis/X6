import {
  RequiredKeys,
  OptionalKeys,
  PickByValue,
  OmitByValue,
} from 'utility-types'
import { FunctionExt } from '../util'

export class Events<EventArgs extends Events.EventArgs = any> {
  private listeners: { [name: string]: any[] } = {}

  on<Name extends Events.EventNames<EventArgs>>(
    name: Name,
    handler: Events.Handler<EventArgs[Name]>,
    context?: any,
  ): this
  on<Name extends Events.UnknownNames<EventArgs>>(
    name: Name,
    handler: Events.Handler<any>,
    context?: any,
  ): this
  on<Name extends Events.EventNames<EventArgs>>(
    name: Name,
    handler: Events.Handler<EventArgs[Name]>,
    context?: any,
  ) {
    if (handler == null) {
      return this
    }

    if (!this.listeners[name]) {
      this.listeners[name] = []
    }
    const cache = this.listeners[name]
    cache.push(handler, context)

    return this
  }

  once<Name extends Events.EventNames<EventArgs>>(
    name: Name,
    handler: Events.Handler<EventArgs[Name]>,
    context?: any,
  ): this
  once<Name extends Events.UnknownNames<EventArgs>>(
    name: Name,
    handler: Events.Handler<any>,
    context?: any,
  ): this
  once<Name extends Events.EventNames<EventArgs>>(
    name: Name,
    handler: Events.Handler<EventArgs[Name]>,
    context?: any,
  ) {
    const cb = (...args: any) => {
      this.off(name, cb as any)
      return Private.call([handler, context], args)
    }

    return this.on(name, cb as any, this)
  }

  off(): this
  off(name: null, handler: Events.Handler<any>): this
  off(name: null, handler: null, context: any): this
  off<Name extends Events.EventNames<EventArgs>>(name: Name): this
  off<Name extends Events.EventNames<EventArgs>>(
    name: Name,
    handler: Events.Handler<EventArgs[Name]>,
  ): this
  off<Name extends Events.EventNames<EventArgs>>(
    name: Name,
    handler: Events.Handler<EventArgs[Name]>,
    context: any,
  ): this
  off<Name extends Events.UnknownNames<EventArgs>>(name: Name): this
  off<Name extends Events.UnknownNames<EventArgs>>(
    name: Name,
    handler: Events.Handler<any>,
  ): this
  off<Name extends Events.UnknownNames<EventArgs>>(
    name: Name,
    handler: Events.Handler<any>,
    context: any,
  ): this
  off(
    name?: string | null,
    handler?: Events.Handler<any> | null,
    context?: any,
  ) {
    // remove all events.
    if (!(name || handler || context)) {
      this.listeners = {}
      return this
    }

    const listeners = this.listeners
    const names = name ? [name] : Object.keys(listeners)

    names.forEach(n => {
      const cache = listeners[n]
      if (!cache) {
        return
      }

      // remove all events with specified name.
      if (!(handler || context)) {
        delete listeners[n]
        return
      }

      for (let i = cache.length - 2; i >= 0; i -= 2) {
        if (
          !(
            (handler && cache[i] !== handler) ||
            (context && cache[i + 1] !== context)
          )
        ) {
          cache.splice(i, 2)
        }
      }
    })

    return this
  }

  trigger<Name extends Events.OptionalNormalNames<EventArgs>>(
    name: Name,
  ): Events.TriggerResult
  trigger<Name extends Events.RequiredNormalNames<EventArgs>>(
    name: Name,
    args: EventArgs[Name],
  ): Events.TriggerResult
  trigger<Name extends Events.NamesWithArrayArgs<EventArgs>>(
    name: Name,
    ...args: EventArgs[Name]
  ): Events.TriggerResult
  trigger<Name extends Events.OtherNames<EventArgs>>(
    name: Name,
    args?: EventArgs[Name],
  ): Events.TriggerResult
  trigger<Name extends Events.OtherNames<EventArgs>>(
    name: Name,
    ...args: EventArgs[Name]
  ): Events.TriggerResult
  trigger<Name extends Events.UnknownNames<EventArgs>>(
    name: Name,
    ...args: any[]
  ): Events.TriggerResult
  trigger<Name extends Events.EventNames<EventArgs>>(
    name: Name,
    ...args: any[]
  ) {
    let returned: Events.TriggerResult = true
    if (name !== '*') {
      const list = this.listeners[name]
      if (list != null) {
        returned = Private.call(list, args)
      }
    }

    const list = this.listeners['*']
    if (list != null) {
      return Private.combindResult([
        returned,
        Private.call(list, [name, ...args]),
      ])
    }

    return true
  }

  /**
   * Triggers event with specified event name. Unknown names
   * will cause a typescript type error.
   */
  protected emit<Name extends Events.OptionalNormalNames<EventArgs>>(
    name: Name,
  ): Events.TriggerResult
  protected emit<Name extends Events.RequiredNormalNames<EventArgs>>(
    name: Name,
    args: EventArgs[Name],
  ): Events.TriggerResult
  protected emit<Name extends Events.NamesWithArrayArgs<EventArgs>>(
    name: Name,
    ...args: EventArgs[Name]
  ): Events.TriggerResult
  protected emit<Name extends Events.OtherNames<EventArgs>>(
    name: Name,
    args?: EventArgs[Name],
  ): Events.TriggerResult
  protected emit<Name extends Events.OtherNames<EventArgs>>(
    name: Name,
    ...args: EventArgs[Name]
  ): Events.TriggerResult
  protected emit(name: any, ...args: any[]) {
    return this.trigger(name, ...args)
  }
}

export namespace Events {
  export type Handler<Args> = Args extends null | undefined
    ? () => any
    : Args extends any[]
    ? (...args: Args) => any
    : (args: Args) => any

  export type TriggerResult = boolean | Promise<boolean>

  export type EventArgs = { [key: string]: any }

  export type EventNames<M extends EventArgs> = Extract<keyof M, string>

  /**
   * Get union type of keys from `M` that value matching `any[]`.
   */
  export type NamesWithArrayArgs<M extends EventArgs> = RequiredKeys<
    PickByValue<M, any[]>
  >

  export type NotArrayValueMap<M extends EventArgs> = OmitByValue<M, any[]>

  export type OptionalNormalNames<M extends EventArgs> = OptionalKeys<
    NotArrayValueMap<M>
  >

  export type RequiredNormalNames<M extends EventArgs> = RequiredKeys<
    NotArrayValueMap<M>
  >

  export type OtherNames<M extends EventArgs> = EventNames<
    PickByValue<M, undefined>
  >

  export type UnknownNames<M extends EventArgs> = Exclude<string, EventNames<M>>
}

namespace Private {
  function isAsync(obj: any) {
    return obj != null && (obj instanceof Promise || isAsyncLink(obj))
  }

  function isAsyncLink(obj: any) {
    return typeof obj === 'object' && obj.then && typeof obj.then === 'function'
  }

  export function combindResult(results: any[]) {
    const hasAsync = results.some(res => isAsync(res))
    if (hasAsync) {
      const deferres = results.map(res =>
        isAsync(res) ? res : Promise.resolve(res !== false),
      )

      return Promise.all(deferres).then(arr =>
        arr.reduce<boolean>((memo, item) => item !== false && memo, true),
      )
    }

    return results.every(res => res !== false)
  }

  export function call<Args>(list: any[], args?: Args) {
    const results: any[] = []
    for (let i = 0, l = list.length; i < l; i += 2) {
      const handler = list[i]
      const context = list[i + 1]
      const params = Array.isArray(args) ? args : [args]
      const ret = FunctionExt.invoke<any>(handler, params, context)
      results.push(ret)
    }

    return combindResult(results)
  }
}
