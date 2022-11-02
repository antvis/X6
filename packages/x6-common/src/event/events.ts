import { call } from './util'
import { FunctionExt } from '../function'
import {
  Handler,
  EventArgs,
  EventNames,
  OtherNames,
  UnknownNames,
  OptionalNormalNames,
  RequiredNormalNames,
  NamesWithArrayArgs,
} from './types'

export class Events<Args extends EventArgs = any> {
  private listeners: { [name: string]: any[] } = {}

  on<Name extends EventNames<Args>>(
    name: Name,
    handler: Handler<Args[Name]>,
    context?: any,
  ): this
  on<Name extends UnknownNames<Args>>(
    name: Name,
    handler: Handler<any>,
    context?: any,
  ): this
  on<Name extends EventNames<Args>>(
    name: Name,
    handler: Handler<Args[Name]>,
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

  once<Name extends EventNames<Args>>(
    name: Name,
    handler: Handler<Args[Name]>,
    context?: any,
  ): this
  once<Name extends UnknownNames<Args>>(
    name: Name,
    handler: Handler<any>,
    context?: any,
  ): this
  once<Name extends EventNames<Args>>(
    name: Name,
    handler: Handler<Args[Name]>,
    context?: any,
  ) {
    const cb = (...args: any) => {
      this.off(name, cb as any)
      return call([handler, context], args)
    }

    return this.on(name, cb as any, this)
  }

  off(): this
  off(name: null, handler: Handler<any>): this
  off(name: null, handler: null, context: any): this
  off<Name extends EventNames<Args>>(
    name: Name,
    handler?: Handler<Args[Name]>,
    context?: any,
  ): this
  off<Name extends UnknownNames<Args>>(
    name: Name,
    handler?: Handler<any>,
    context?: any,
  ): this
  off(name?: string | null, handler?: Handler<any> | null, context?: any) {
    // remove all events.
    if (!(name || handler || context)) {
      this.listeners = {}
      return this
    }

    const listeners = this.listeners
    const names = name ? [name] : Object.keys(listeners)

    names.forEach((n) => {
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

  trigger<Name extends OptionalNormalNames<Args>>(
    name: Name,
  ): FunctionExt.AsyncBoolean
  trigger<Name extends RequiredNormalNames<Args>>(
    name: Name,
    args: Args[Name],
  ): FunctionExt.AsyncBoolean
  trigger<Name extends NamesWithArrayArgs<Args>>(
    name: Name,
    ...args: Args[Name]
  ): FunctionExt.AsyncBoolean
  trigger<Name extends OtherNames<Args>>(
    name: Name,
    args?: Args[Name],
  ): FunctionExt.AsyncBoolean
  trigger<Name extends OtherNames<Args>>(
    name: Name,
    ...args: Args[Name]
  ): FunctionExt.AsyncBoolean
  trigger<Name extends UnknownNames<Args>>(
    name: Name,
    ...args: any[]
  ): FunctionExt.AsyncBoolean
  trigger<Name extends EventNames<Args>>(name: Name, ...args: any[]) {
    let returned: FunctionExt.AsyncBoolean = true
    if (name !== '*') {
      const list = this.listeners[name]
      if (list != null) {
        returned = call([...list], args)
      }
    }

    const list = this.listeners['*']
    if (list != null) {
      return FunctionExt.toAsyncBoolean([
        returned,
        call([...list], [name, ...args]),
      ])
    }

    return returned
  }

  /**
   * Triggers event with specified event name. Unknown names
   * will cause a typescript type error.
   */
  protected emit<Name extends OptionalNormalNames<Args>>(
    name: Name,
  ): FunctionExt.AsyncBoolean
  protected emit<Name extends RequiredNormalNames<Args>>(
    name: Name,
    args: Args[Name],
  ): FunctionExt.AsyncBoolean
  protected emit<Name extends NamesWithArrayArgs<Args>>(
    name: Name,
    ...args: Args[Name]
  ): FunctionExt.AsyncBoolean
  protected emit<Name extends OtherNames<Args>>(
    name: Name,
    args?: Args[Name],
  ): FunctionExt.AsyncBoolean
  protected emit<Name extends OtherNames<Args>>(
    name: Name,
    ...args: Args[Name]
  ): FunctionExt.AsyncBoolean
  protected emit(name: any, ...args: any[]) {
    return this.trigger(name, ...args)
  }
}
