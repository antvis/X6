import { EventHandler } from './types'

export namespace Store {
  export type EventTarget = Element | Record<string, unknown>

  export interface HandlerObject {
    type: string
    originType: string
    data?: any
    handler: EventHandler<any, any>
    guid: number
    selector?: string
    namespace: string | false
    needsContext: boolean
  }

  export interface Data {
    handler?: EventHandler<any, any>
    events: {
      [type: string]: {
        handlers: HandlerObject[]
        delegateCount: number
      }
    }
  }

  const cache: WeakMap<EventTarget, Data> = new WeakMap()

  export function ensure(target: EventTarget) {
    if (!cache.has(target)) {
      cache.set(target, { events: Object.create(null) })
    }
    return cache.get(target)!
  }

  export function get(target: EventTarget) {
    return cache.get(target)
  }

  export function remove(target: EventTarget) {
    return cache.delete(target)
  }
}
