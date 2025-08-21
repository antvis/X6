/* eslint-disable no-param-reassign */

import { Core } from './core'
import { Util } from './util'
import { EventObject } from './object'
import { TypeEventHandler, TypeEventHandlers } from './types'

export namespace Event {
  export function on<TType extends string>(
    elem: Element,
    events: TType,
    selector: string,
    handler: TypeEventHandler<Element, undefined, any, any, TType> | false,
  ): Element
  export function on<TType extends string, TData>(
    elem: Element,
    events: TType,
    selector: string | null | undefined,
    data: TData,
    handler: TypeEventHandler<Element, TData, Element, Element, TType> | false,
  ): Element
  export function on<TType extends string, TData>(
    elem: Element,
    events: TType,
    data: TData,
    handler: TypeEventHandler<Element, TData, Element, Element, TType> | false,
  ): Element
  export function on<TType extends string, TData>(
    elem: Element,
    events: TType,
    data: TData,
    handlerObject: {
      handler: TypeEventHandler<Element, TData, Element, Element, TType>
      selector?: string
      [key: string]: any
    },
  ): Element
  export function on<TType extends string>(
    elem: Element,
    events: TType,
    handler:
      | TypeEventHandler<Element, undefined, Element, Element, TType>
      | false,
  ): Element
  export function on<TType extends string>(
    elem: Element,
    events: TType,
    handlerObject: {
      handler: TypeEventHandler<Element, undefined, Element, Element, TType>
      selector?: string
      [key: string]: any
    },
  ): Element
  export function on<TData>(
    elem: Element,
    events: TypeEventHandlers<Element, TData, any, any>,
    selector: string | null | undefined,
    data: TData,
  ): Element
  export function on(
    elem: Element,
    events: TypeEventHandlers<Element, undefined, any, any>,
    selector: string,
  ): Element
  export function on<TData>(
    elem: Element,
    events: TypeEventHandlers<Element, TData, Element, Element>,
    data: TData,
  ): Element
  export function on(
    elem: Element,
    events: TypeEventHandlers<Element, undefined, Element, Element>,
  ): void
  export function on(
    elem: Element,
    events: any,
    selector?: any,
    data?: any,
    handler?: any,
  ) {
    Private.on(elem, events, selector, data, handler)
    return elem
  }

  export function once<TType extends string>(
    elem: Element,
    events: TType,
    selector: string,
    handler: TypeEventHandler<Element, undefined, any, any, TType> | false,
  ): Element
  export function once<TType extends string, TData>(
    elem: Element,
    events: TType,
    selector: string | null | undefined,
    data: TData,
    handler: TypeEventHandler<Element, TData, Element, Element, TType> | false,
  ): Element
  export function once<TType extends string, TData>(
    elem: Element,
    events: TType,
    data: TData,
    handler: TypeEventHandler<Element, TData, Element, Element, TType> | false,
  ): Element
  export function once<TType extends string, TData>(
    elem: Element,
    events: TType,
    data: TData,
    handlerObject: {
      handler: TypeEventHandler<Element, TData, Element, Element, TType>
      selector?: string
      [key: string]: any
    },
  ): Element
  export function once<TType extends string>(
    elem: Element,
    events: TType,
    handler:
      | TypeEventHandler<Element, undefined, Element, Element, TType>
      | false,
  ): Element
  export function once<TType extends string>(
    elem: Element,
    events: TType,
    handlerObject: {
      handler: TypeEventHandler<Element, undefined, Element, Element, TType>
      selector?: string
      [key: string]: any
    },
  ): Element
  export function once<TData>(
    elem: Element,
    events: TypeEventHandlers<Element, TData, any, any>,
    selector: string | null | undefined,
    data: TData,
  ): Element
  export function once(
    elem: Element,
    events: TypeEventHandlers<Element, undefined, any, any>,
    selector: string,
  ): Element
  export function once<TData>(
    elem: Element,
    events: TypeEventHandlers<Element, TData, Element, Element>,
    data: TData,
  ): Element
  export function once(
    elem: Element,
    events: TypeEventHandlers<Element, undefined, Element, Element>,
  ): Element
  export function once(
    elem: Element,
    events: any,
    selector?: any,
    data?: any,
    handler?: any,
  ) {
    Private.on(elem as any, events, selector, data, handler, true)
    return elem
  }

  export function off<TType extends string>(
    elem: Element,
    events: TType,
    selector: string,
    handler: TypeEventHandler<Element, any, any, any, TType> | false,
  ): Element
  export function off<TType extends string>(
    elem: Element,
    events: TType,
    handler: TypeEventHandler<Element, any, any, any, TType> | false,
  ): Element
  export function off<TType extends string>(
    elem: Element,
    events: TType,
    selector_handler?:
      | string
      | TypeEventHandler<Element, any, any, any, TType>
      | false,
  ): Element
  export function off(
    elem: Element,
    events: TypeEventHandlers<Element, any, any, any>,
    selector?: string,
  ): Element
  export function off(elem: Element, event?: EventObject<Element>): Element
  export function off<TType extends string>(
    elem: Element,
    events?:
      | TType
      | TypeEventHandlers<Element, any, any, any>
      | EventObject<Element>,
    selector?: string | TypeEventHandler<Element, any, any, any, TType> | false,
    handler?: TypeEventHandler<Element, any, any, any, TType> | false,
  ) {
    Private.off(elem, events, selector, handler)
    return elem
  }

  export function trigger(
    elem: Element,
    event:
      | string
      | EventObject
      | (Partial<EventObject.Event> & { type: string }),
    args?: any[] | Record<string, any> | string | number | boolean,
    /**
     * When onlyHandlers is `true`
     * - Will not call `.event()` on the element it is triggered on. This means
     *   `.trigger('submit', [], true)` on a form will not call `.submit()` on
     *   the form.
     * - Events will not bubble up the DOM hierarchy; if they are not handled
     *   by the target element directly, they do nothing.
     */
    onlyHandlers?: boolean,
  ) {
    Core.trigger(event, args, elem, onlyHandlers)
    return elem
  }
}

namespace Private {
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
        Private.off(elem, event)
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
