import {
  RequiredKeys,
  OptionalKeys,
  PickByValue,
  OmitByValue,
} from 'utility-types'
import { FunctionExt } from '../util'

export class Events<M extends Events.EventArgs = any> {
  private listeners: { [name: string]: any[] } = {}

  on<N extends Events.EventKeys<M>>(
    name: N,
    handler: Events.Handler<M[N]>,
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

  once<N extends Events.EventKeys<M>>(
    name: N,
    handler: Events.Handler<M[N]>,
    context?: any,
  ) {
    const cb = (...args: any) => {
      this.off(name, cb as any)
      return Private.call([handler, context], args)
    }

    return this.on(name, cb as any, this)
  }

  off<N extends Events.EventKeys<M>>(
    name?: N | null,
    handler?: Events.Handler<M[N]> | null,
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

  trigger<N extends Events.OptionalNormalKeys<M>>(name: N): boolean
  trigger<N extends Events.RequiredNormalKeys<M>>(name: N, args: M[N]): boolean
  trigger<N extends Events.KeysWithArrayValue<M>>(
    name: N,
    ...args: M[N]
  ): boolean
  trigger<N extends Events.OtherKeys<M>>(name: N, args?: M[N]): boolean
  trigger<N extends Events.OtherKeys<M>>(name: N, ...args: M[N]): boolean
  trigger<N extends Events.EventKeys<M>>(name: N, ...args: M[N]) {
    const cache = this.listeners[name]
    if (cache != null) {
      return Private.call(cache, args)
    }

    return true
  }
}

export namespace Events {
  export type Handler<A> = A extends null | undefined
    ? () => any
    : A extends any[]
    ? (...args: A) => any
    : (args: A) => any

  export type EventArgs = { [key: string]: any }
  export type EventKeys<M extends EventArgs> = Extract<keyof M, string>

  /**
   * Get union type of keys from `M` that value matching `any[]`.
   */
  export type KeysWithArrayValue<M extends EventArgs> = RequiredKeys<
    PickByValue<M, any[]>
  >

  export type NotArrayValueMap<M extends EventArgs> = OmitByValue<M, any[]>

  export type OptionalNormalKeys<M extends EventArgs> = OptionalKeys<
    NotArrayValueMap<M>
  >

  export type RequiredNormalKeys<M extends EventArgs> = RequiredKeys<
    NotArrayValueMap<M>
  >

  export type OtherKeys<M extends EventArgs> = EventKeys<
    PickByValue<M, undefined>
  >
}

namespace Private {
  export function call<A>(list: any[], args?: A) {
    let pass = true

    for (let i = 0, l = list.length; i < l; i += 2) {
      const handler = list[i]
      const context = list[i + 1]
      const params = Array.isArray(args) ? args : [args]
      pass = FunctionExt.invoke(handler, params, context) !== false && pass
    }

    return pass
  }
}
