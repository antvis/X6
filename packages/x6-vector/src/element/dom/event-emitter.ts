/* eslint-disable no-param-reassign */

import { Primer } from './primer'
import { Core } from './event-core'
import { Util } from './event-util'
import { Hook } from './event-hook'
import { EventRaw } from './event-alias'
import { EventObject } from './event-object'
import { TypeEventHandler, TypeEventHandlers } from './event-types'

export class EventEmitter<TElement extends Node> extends Primer<TElement> {
  on<TType extends string>(
    events: TType,
    selector: string,
    handler: TypeEventHandler<TElement, undefined, any, any, TType> | false,
  ): this
  on<TType extends string, TData>(
    events: TType,
    selector: string | null | undefined,
    data: TData,
    handler:
      | TypeEventHandler<TElement, TData, TElement, TElement, TType>
      | false,
  ): this
  on<TType extends string, TData>(
    events: TType,
    data: TData,
    handler:
      | TypeEventHandler<TElement, TData, TElement, TElement, TType>
      | false,
  ): this
  on<TType extends string>(
    events: TType,
    handler:
      | TypeEventHandler<TElement, undefined, TElement, TElement, TType>
      | false,
  ): this
  on<TData>(
    events: TypeEventHandlers<TElement, TData, any, any>,
    selector: string | null | undefined,
    data: TData,
  ): this
  on(
    events: TypeEventHandlers<TElement, undefined, any, any>,
    selector: string,
  ): this
  on<TData>(
    events: TypeEventHandlers<TElement, TData, TElement, TElement>,
    data: TData,
  ): this
  on(events: TypeEventHandlers<TElement, undefined, TElement, TElement>): this
  on(events: any, selector?: any, data?: any, handler?: any) {
    EventEmitter.on(this.node as any, events, selector, data, handler)
    return this
  }

  once<TType extends string>(
    events: TType,
    selector: string,
    handler: TypeEventHandler<TElement, undefined, any, any, TType> | false,
  ): this
  once<TType extends string, TData>(
    events: TType,
    selector: string | null | undefined,
    data: TData,
    handler:
      | TypeEventHandler<TElement, TData, TElement, TElement, TType>
      | false,
  ): this
  once<TType extends string, TData>(
    events: TType,
    data: TData,
    handler:
      | TypeEventHandler<TElement, TData, TElement, TElement, TType>
      | false,
  ): this
  once<TType extends string>(
    events: TType,
    handler:
      | TypeEventHandler<TElement, undefined, TElement, TElement, TType>
      | false,
  ): this
  once<TData>(
    events: TypeEventHandlers<TElement, TData, any, any>,
    selector: string | null | undefined,
    data: TData,
  ): this
  once(
    events: TypeEventHandlers<TElement, undefined, any, any>,
    selector: string,
  ): this
  once<TData>(
    events: TypeEventHandlers<TElement, TData, TElement, TElement>,
    data: TData,
  ): this
  once(events: TypeEventHandlers<TElement, undefined, TElement, TElement>): this
  once(events: any, selector?: any, data?: any, handler?: any) {
    EventEmitter.on(this.node as any, events, selector, data, handler, true)
    return this
  }

  off<TType extends string>(
    events: TType,
    selector: string,
    handler: TypeEventHandler<TElement, any, any, any, TType> | false,
  ): this

  off<TType extends string>(
    events: TType,
    handler: TypeEventHandler<TElement, any, any, any, TType> | false,
  ): this
  off<TType extends string>(
    events: TType,
    selector_handler?:
      | string
      | TypeEventHandler<TElement, any, any, any, TType>
      | false,
  ): this
  off(
    events: TypeEventHandlers<TElement, any, any, any>,
    selector?: string,
  ): this
  off(event?: EventObject<TElement>): this
  off<TType extends string>(
    events?:
      | TType
      | TypeEventHandlers<TElement, any, any, any>
      | EventObject<TElement>,
    selector?:
      | string
      | TypeEventHandler<TElement, any, any, any, TType>
      | false,
    handler?: TypeEventHandler<TElement, any, any, any, TType> | false,
  ) {
    EventEmitter.off(this.node, events, selector, handler)
    return this
  }

  trigger(
    event: string | EventObject | EventRaw | EventObject.Event,
    data?: any[] | Record<string, any> | string | number | boolean,
    onlyHandlers?: boolean,
  ) {
    Core.trigger(event, data, this.node as any, onlyHandlers)
    return this
  }
}

export namespace EventEmitter {
  type EventHandler = false | ((...args: any[]) => any)

  export function on(
    elem: Element,
    types: any,
    selector?: string | EventHandler | null,
    data?: any | EventHandler | null,
    fn?: EventHandler | null,
    once?: boolean,
  ) {
    // Types can be a map of types/handlers
    if (typeof types === 'object') {
      // ( types-Object, selector, data )
      if (typeof selector !== 'string') {
        // ( types-Object, data )
        data = data || selector
        selector = undefined
      }

      Object.keys(types).forEach((type) =>
        on(elem, type, selector, data, types[type], once),
      )
      return
    }

    if (data == null && fn == null) {
      // ( types, fn )
      fn = selector as EventHandler
      data = selector = undefined
    } else if (fn == null) {
      if (typeof selector === 'string') {
        // ( types, selector, fn )
        fn = data
        data = undefined
      } else {
        // ( types, data, fn )
        fn = data
        data = selector
        selector = undefined
      }
    }

    if (fn === false) {
      fn = Util.returnFalse
    } else if (!fn) {
      return
    }

    if (once) {
      const originHandler = fn
      fn = function (event, ...args: any[]) {
        // Can use an empty set, since event contains the info
        EventEmitter.off(elem, event)
        return originHandler.call(this, event, ...args)
      }

      // Use same guid so caller can remove using origFn
      Util.setHandlerId(fn, Util.ensureHandlerId(originHandler))
    }

    Core.on(elem, types as string, fn, data, selector as string)
  }

  export function off<TType extends string, TElement>(
    elem: TElement,
    events?:
      | TType
      | TypeEventHandlers<TElement, any, any, any>
      | EventObject<TElement>,
    selector?:
      | string
      | TypeEventHandler<TElement, any, any, any, TType>
      | false,
    fn?: TypeEventHandler<TElement, any, any, any, TType> | false,
  ) {
    const evt = events as EventObject
    if (evt && evt.preventDefault != null && evt.handleObj != null) {
      const obj = evt.handleObj
      off(
        evt.delegateTarget,
        obj.namespace ? `${obj.originType}.${obj.namespace}` : obj.originType,
        obj.selector,
        obj.handler,
      )

      return
    }

    if (typeof events === 'object') {
      // ( types-object [, selector] )
      const types = events as TypeEventHandlers<TElement, any, any, any>
      Object.keys(types).forEach((type) =>
        off(elem, type, selector, types[type] as any),
      )
      return
    }

    if (selector === false || typeof selector === 'function') {
      // ( types [, fn] )
      fn = selector
      selector = undefined
    }

    if (fn === false) {
      fn = Util.returnFalse
    }

    Core.off(elem as any, events as string, fn, selector)
  }
}

export namespace EventEmitter {
  export const registerHook = Hook.add
}
