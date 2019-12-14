import { invoke } from '../util/function'

export class Events<M extends Events.EventArgMap = any> {
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

  export type EventArgMap = { [key: string]: any }
  export type EventKeys<M extends EventArgMap> = Extract<keyof M, string>

  /**
   * Get union type of keys from `M` that value matching `any[]`.
   */
  export type KeysWithArrayValue<M extends EventArgMap> = RequiredKeys<
    PickByValue<M, any[]>
  >

  export type NotArrayValueMap<M extends EventArgMap> = OmitByValue<M, any[]>

  export type OptionalNormalKeys<M extends EventArgMap> = OptionalKeys<
    NotArrayValueMap<M>
  >

  export type RequiredNormalKeys<M extends EventArgMap> = RequiredKeys<
    NotArrayValueMap<M>
  >

  export type OtherKeys<M extends EventArgMap> = EventKeys<
    PickByValue<M, undefined>
  >

  /**
   * Get union type of keys that are required in object type `T`
   */
  type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? never : K
  }[keyof T]

  /**
   * Get union type of keys that are optional in object type `T`
   */
  type OptionalKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? K : never
  }[keyof T]

  /**
   * From `T` pick a set of properties by value matching `ValueType`.
   *
   * @see https://github.com/piotrwitek/utility-types/blob/master/src/mapped-types.ts#L197
   */
  type PickByValue<T, ValueType> = Pick<
    T,
    { [Key in keyof T]-?: T[Key] extends ValueType ? Key : never }[keyof T]
  >

  /**
   * From `T` remove a set of properties by value matching `ValueType`.
   */
  type OmitByValue<T, ValueType> = Pick<
    T,
    { [Key in keyof T]-?: T[Key] extends ValueType ? never : Key }[keyof T]
  >
}

namespace Private {
  export function call<A>(list: any[], args?: A) {
    let pass = true

    for (let i = 0, l = list.length; i < l; i += 2) {
      const handler = list[i]
      const context = list[i + 1]
      const params = Array.isArray(args) ? args : [args]
      pass = invoke(handler, params, context) !== false && pass
    }

    return pass
  }
}
