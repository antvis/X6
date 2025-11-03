import {
  isValidTarget,
  removeHandlerId,
  addEventListener,
  ensureHandlerId,
  splitType,
  normalizeType,
  removeEventListener,
  getHandlerId,
  isWindow,
  setHandlerId,
  getHandlerQueue,
  stopPropagationCallback,
} from './util'
import { ensure, remove } from './store'
import { get } from './hook'
import { get as getStore } from './store'
import type { EventTarget, HandlerObject } from './store'
import { EventObject } from './object'
import { EventHandler } from './types'
import './special'

export namespace Core {
  let triggered: string | undefined

  export function on(
    elem: EventTarget,
    types: string,
    handler:
      | EventHandler<any, any>
      | ({
          handler: EventHandler<any, any>
          selector?: string
        } & Partial<HandlerObject>),
    data?: any,
    selector?: string,
  ) {
    if (!isValidTarget(elem)) {
      return
    }

    // Caller can pass in an object of custom data in lieu of the handler
    let handlerData: any
    if (typeof handler !== 'function') {
      const { handler: h, selector: s, ...others } = handler
      handler = h // eslint-disable-line
      selector = s // eslint-disable-line
      handlerData = others
    }

    // Ensure that invalid selectors throw exceptions at attach time
    // if (!isValidSelector(elem, selector)) {
    //   throw new Error('Delegate event with invalid selector.')
    // }

    const store = ensure(elem)

    // Ensure the main handle
    let mainHandler = store.handler
    if (mainHandler == null) {
      mainHandler = store.handler = function (e, ...args: any[]) {
        return triggered !== e.type ? dispatch(elem, e, ...args) : undefined
      }
    }

    // Make sure that the handler has a unique ID, used to find/remove it later
    const guid = ensureHandlerId(handler)

    // Handle multiple events separated by a space
    splitType(types).forEach((item) => {
      const { originType, namespaces } = normalizeType(item)

      // There *must* be a type, no attaching namespace-only handlers
      if (!originType) {
        return
      }

      let type = originType
      let hook = get(type)

      // If selector defined, determine special event type, otherwise given type
      type = (selector ? hook.delegateType : hook.bindType) || type

      // Update hook based on newly reset type
      hook = get(type)

      // handleObj is passed to all event handlers
      const handleObj: HandlerObject = {
        type,
        originType,
        data,
        selector,
        guid,
        handler: handler as EventHandler<any, any>,
        namespace: namespaces.join('.'),
        ...handlerData,
      }

      // Init the event handler queue if we're the first
      const events = store.events
      let bag = events[type]
      if (!bag) {
        bag = events[type] = { handlers: [], delegateCount: 0 }

        // Only use addEventListener if the `hook.steup` returns false
        if (
          !hook.setup ||
          hook.setup(elem, data, namespaces, mainHandler!) === false
        ) {
          addEventListener(
            elem as Element,
            type,
            mainHandler as any as EventListener,
          )
        }
      }

      if (hook.add) {
        removeHandlerId(handleObj.handler)
        hook.add(elem, handleObj)
        setHandlerId(handleObj.handler, guid)
      }

      // Add to the element's handler list, delegates in front
      if (selector) {
        bag.handlers.splice(bag.delegateCount, 0, handleObj)
        bag.delegateCount += 1
      } else {
        bag.handlers.push(handleObj)
      }
    })
  }

  export function off(
    elem: EventTarget,
    types: string,
    handler?: EventHandler<any, any>,
    selector?: string,
    mappedTypes?: boolean,
  ) {
    const store = getStore(elem)
    if (!store) {
      return
    }

    const events = store.events
    if (!events) {
      return
    }

    // Once for each type.namespace in types; type may be omitted
    splitType(types).forEach((item) => {
      const { originType, namespaces } = normalizeType(item)

      // Unbind all events (on this namespace, if provided) for the element
      if (!originType) {
        Object.keys(events).forEach((key) => {
          off(elem, key + item, handler, selector, true)
        })
        return
      }

      let type = originType
      const hook = get(type)
      type = (selector ? hook.delegateType : hook.bindType) || type
      const bag = events[type]
      if (!bag) {
        return
      }
      const rns =
        namespaces.length > 0
          ? new RegExp(`(^|\\.)${namespaces.join('\\.(?:.*\\.|)')}(\\.|$)`)
          : null

      // Remove matching events
      const originHandlerCount = bag.handlers.length
      for (let i = bag.handlers.length - 1; i >= 0; i -= 1) {
        const handleObj = bag.handlers[i]
        if (
          (mappedTypes || originType === handleObj.originType) &&
          (!handler || getHandlerId(handler) === handleObj.guid) &&
          (rns == null ||
            (handleObj.namespace && rns.test(handleObj.namespace))) &&
          (selector == null ||
            selector === handleObj.selector ||
            (selector === '**' && handleObj.selector))
        ) {
          bag.handlers.splice(i, 1)

          if (handleObj.selector) {
            bag.delegateCount -= 1
          }

          if (hook.remove) {
            hook.remove(elem, handleObj)
          }
        }
      }

      if (originHandlerCount && bag.handlers.length === 0) {
        if (
          !hook.teardown ||
          hook.teardown(elem, namespaces, store.handler!) === false
        ) {
          removeEventListener(
            elem as Element,
            type,
            store.handler as any as EventListener,
          )
        }

        delete events[type]
      }
    })

    // Remove data and the expando if it's no longer used
    if (Object.keys(events).length === 0) {
      remove(elem)
    }
  }

  export function dispatch(
    elem: EventTarget,
    evt: Event | EventObject | string,
    ...args: any[]
  ) {
    const event = EventObject.create(evt)
    event.delegateTarget = elem as Element

    const hook = get(event.type)
    if (hook.preDispatch && hook.preDispatch(elem, event) === false) {
      return
    }

    const handlerQueue = getHandlerQueue(elem, event)

    // Run delegates first; they may want to stop propagation beneath us
    for (
      let i = 0, l = handlerQueue.length;
      i < l && !event.isPropagationStopped();
      i += 1
    ) {
      const matched = handlerQueue[i]
      event.currentTarget = matched.elem

      for (
        let j = 0, k = matched.handlers.length;
        j < k && !event.isImmediatePropagationStopped();
        j += 1
      ) {
        const handleObj = matched.handlers[j]
        // If event is namespaced, then each handler is only invoked if it is
        // specially universal or its namespaces are a superset of the event's.
        if (
          event.rnamespace == null ||
          (handleObj.namespace && event.rnamespace.test(handleObj.namespace))
        ) {
          event.handleObj = handleObj
          event.data = handleObj.data

          const hookHandle = get(handleObj.originType).handle

          const result = hookHandle
            ? hookHandle(matched.elem as EventTarget, event, ...args)
            : handleObj.handler.call(matched.elem, event, ...args)
          if (result !== undefined) {
            event.result = result
            if (result === false) {
              event.preventDefault()
              event.stopPropagation()
            }
          }
        }
      }
    }

    // Call the postDispatch hook for the mapped type
    if (hook.postDispatch) {
      hook.postDispatch(elem, event)
    }

    return event.result
  }

  export function trigger(
    event:
      | (Partial<EventObject.Event> & { type: string })
      | EventObject
      | string,
    eventArgs: any,
    elem: EventTarget,
    onlyHandlers?: boolean,
  ) {
    let eventObj = event as EventObject
    let type = typeof event === 'string' ? event : event.type
    let namespaces =
      typeof event === 'string' || eventObj.namespace == null
        ? []
        : eventObj.namespace.split('.')

    const node = elem as HTMLElement

    // Don't do events on text and comment nodes
    if (node.nodeType === 3 || node.nodeType === 8) {
      return
    }

    if (type.indexOf('.') > -1) {
      // Namespaced trigger; create a regexp to match event type in handle()
      namespaces = type.split('.')
      type = namespaces.shift()!
      namespaces.sort()
    }
    const ontype = type.indexOf(':') < 0 && (`on${type}` as 'onclick')

    // Caller can pass in a EventObject, Object, or just an event type string
    eventObj =
      event instanceof EventObject
        ? event
        : new EventObject(type, typeof event === 'object' ? event : null)

    eventObj.namespace = namespaces.join('.')
    eventObj.rnamespace = eventObj.namespace
      ? new RegExp(`(^|\\.)${namespaces.join('\\.(?:.*\\.|)')}(\\.|$)`)
      : null

    // Clean up the event in case it is being reused
    eventObj.result = undefined
    if (!eventObj.target) {
      eventObj.target = node
    }

    const args: [EventObject, ...any[]] = [eventObj]
    if (Array.isArray(eventArgs)) {
      args.push(...eventArgs)
    } else {
      args.push(eventArgs)
    }

    const hook = get(type)
    if (
      !onlyHandlers &&
      hook.trigger &&
      hook.trigger(node, eventObj, eventArgs) === false
    ) {
      return
    }

    let bubbleType

    // Determine event propagation path in advance, per W3C events spec.
    // Bubble up to document, then to window; watch for a global ownerDocument
    const eventPath = [node]
    if (!onlyHandlers && !hook.noBubble && !isWindow(node)) {
      bubbleType = hook.delegateType || type

      let last: Document | HTMLElement = node
      let curr = node.parentNode as HTMLElement

      while (curr != null) {
        eventPath.push(curr)
        last = curr
        curr = curr.parentNode as HTMLElement
      }

      // Only add window if we got to document
      const doc = node.ownerDocument || document
      if ((last as any) === doc) {
        const win =
          (last as any).defaultView || (last as any).parentWindow || window
        eventPath.push(win)
      }
    }

    let lastElement = node
    // Fire handlers on the event path
    for (
      let i = 0, l = eventPath.length;
      i < l && !eventObj.isPropagationStopped();
      i += 1
    ) {
      const currElement = eventPath[i]
      lastElement = currElement

      eventObj.type = i > 1 ? (bubbleType as string) : hook.bindType || type

      // Custom handler
      const store = getStore(currElement as Element)
      if (store) {
        if (store.events[eventObj.type] && store.handler) {
          store.handler.call(currElement, ...args)
        }
      }

      // Native handler
      const handle = (ontype && currElement[ontype]) || null
      if (handle && isValidTarget(currElement)) {
        eventObj.result = handle.call(currElement, ...args)
        if (eventObj.result === false) {
          eventObj.preventDefault()
        }
      }
    }

    eventObj.type = type

    // If nobody prevented the default action, do it now
    if (!onlyHandlers && !eventObj.isDefaultPrevented()) {
      const preventDefault = hook.preventDefault
      if (
        (preventDefault == null ||
          preventDefault(eventPath.pop()!, eventObj, eventArgs) === false) &&
        isValidTarget(node)
      ) {
        // Call a native DOM method on the target with the same name as the
        // event. Don't do default actions on window.
        if (
          ontype &&
          typeof node[type as 'click'] === 'function' &&
          !isWindow(node)
        ) {
          // Don't re-trigger an onFOO event when we call its FOO() method
          const tmp = node[ontype]
          if (tmp) {
            node[ontype] = null
          }

          // Prevent re-triggering of the same event, since we already bubbled it above
          triggered = type

          if (eventObj.isPropagationStopped()) {
            lastElement.addEventListener(type, stopPropagationCallback)
          }

          node[type as 'click']()

          if (eventObj.isPropagationStopped()) {
            lastElement.removeEventListener(type, stopPropagationCallback)
          }

          triggered = undefined

          if (tmp) {
            node[ontype] = tmp
          }
        }
      }
    }

    return eventObj.result
  }
}
