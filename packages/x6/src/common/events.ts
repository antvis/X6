import { split } from '../util/string'
import { invoke } from '../util/function'

export class Events {
  private eventListeners: { [name: string]: any[] } = {}

  on(eventName: string, handler: Events.Handler, context?: any) {
    if (handler == null) {
      return this
    }

    split(eventName).forEach(name => {
      if (!this.eventListeners[name]) {
        this.eventListeners[name] = []
      }
      const cache = this.eventListeners[name]
      cache.push(handler, context)
    })

    return this
  }

  once(eventName: string, handler: Events.Handler, context?: any) {
    const cb = (...args: any[]) => {
      this.off(eventName, cb)
      Events.trigger([handler, context], args)
    }

    return this.on(eventName, cb, this)
  }

  off(
    eventName?: string | null,
    handler?: Events.Handler | null,
    context?: any
  ) {
    // removing *all* events.
    if (!(eventName || handler || context)) {
      this.eventListeners = {}
      return this
    }

    const eventListeners = this.eventListeners
    const eventNames = eventName
      ? split(eventName)
      : Object.keys(eventListeners)

    eventNames.forEach(name => {
      const cache = eventListeners[name]
      if (!cache) {
        return
      }

      // remove all event.
      if (!(handler || context)) {
        delete eventListeners[name]
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

  trigger(eventName: string, ...args: any[]) {
    let pass = true
    const any = this.eventListeners['*']
    split(eventName).forEach(name => {
      let callbacks

      if (name !== '*') {
        callbacks = this.eventListeners[name]
        if (callbacks) {
          pass = Events.trigger(callbacks, args) && pass
        }
      }

      if (any) {
        pass = Events.trigger(any, [name].concat(args)) && pass
      }
    })

    return pass
  }
}

export namespace Events {
  export type Handler = (...args: any[]) => void

  export function trigger(list: any[], args: any[]) {
    let pass = true

    for (let i = 0, l = list.length; i < l; i += 2) {
      pass = invoke(list[i], args, list[i + 1]) !== false && pass
    }

    return pass
  }
}
