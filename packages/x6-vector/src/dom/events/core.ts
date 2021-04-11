import { isWindow } from '../../util'
import { Global } from '../../global'
import { Util } from './util'
import { Hook } from './hook'
import { Store } from './store'
import { EventRaw } from './alias'
import { EventObject } from './object'
import { EventHandler } from './types'

export namespace Core {
  let triggered: string | undefined

  export function on(
    elem: Store.EventTarget,
    types: string,
    handler:
      | EventHandler<any, any>
      | ({
          handler: EventHandler<any, any>
          selector?: string
        } & Partial<Store.HandlerObject>),
    data?: any,
    selector?: string,
  ) {
    if (!Util.isValidTarget(elem)) {
      return
    }

    // Caller can pass in an object of custom data in lieu of the handler
    if (typeof handler !== 'function') {
      const temp = handler
      handler = temp.handler // eslint-disable-line
      selector = temp.selector // eslint-disable-line
    }

    // Ensure that invalid selectors throw exceptions at attach time
    if (!Util.isValidSelector(elem, selector)) {
      throw new Error('Delegate event with invalid selector.')
    }

    const store = Store.ensure(elem)

    // Ensure the main handle
    let mainHandler = store.handler
    if (mainHandler == null) {
      mainHandler = store.handler = function (e, ...args: any[]) {
        return triggered !== e.type ? dispatch(elem, e, ...args) : undefined
      }
    }

    // Make sure that the handler has a unique ID, used to find/remove it later
    const guid = Util.ensureHandlerId(handler)

    // Handle multiple events separated by a space
    Util.splitType(types).forEach((item) => {
      const { originType, namespaces } = Util.normalizeType(item)

      // There *must* be a type, no attaching namespace-only handlers
      if (!originType) {
        return
      }

      let type = originType
      let hook = Hook.get(type)

      // If selector defined, determine special event type, otherwise given type
      type = (selector ? hook.delegateType : hook.bindType) || type

      // Update hook based on newly reset type
      hook = Hook.get(type)

      // handleObj is passed to all event handlers
      const others = typeof handler === 'function' ? undefined : handler
      const handleObj: Store.HandlerObject = {
        type,
        originType,
        data,
        selector,
        guid,
        handler: handler as EventHandler<any, any>,
        namespace: namespaces.join('.'),
        needsContext: Util.needsContext(selector),
        ...others,
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
          Util.addEventListener(
            elem as Element,
            type,
            (mainHandler as any) as EventListener,
          )
        }
      }

      if (hook.add) {
        Util.removeHandlerId(handleObj.handler)
        hook.add(elem, handleObj)
        Util.setHandlerId(handleObj.handler, guid)
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
    elem: Store.EventTarget,
    types: string,
    handler?: EventHandler<any, any>,
    selector?: string,
    mappedTypes?: boolean,
  ) {
    const store = Store.get(elem)
    if (!store) {
      return
    }

    const events = store.events
    if (!events) {
      return
    }

    // Once for each type.namespace in types; type may be omitted
    Util.splitType(types).forEach((item) => {
      const { originType, namespaces } = Util.normalizeType(item)

      // Unbind all events (on this namespace, if provided) for the element
      if (!originType) {
        Object.keys(events).forEach((key) => {
          off(elem, key + item, handler, selector, true)
        })
        return
      }

      let type = originType
      const hook = Hook.get(type)
      type = (selector ? hook.delegateType : hook.bindType) || type
      const bag = events[type] || {}
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
          (!handler || Util.getHandlerId(handler) === handleObj.guid) &&
          (!rns || !handleObj.namespace || rns.test(handleObj.namespace)) &&
          (!selector ||
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
          Util.removeEventListener(
            elem as Element,
            type,
            (store.handler as any) as EventListener,
          )
        }

        delete events[type]
      }
    })

    // Remove data and the expando if it's no longer used
    if (Object.keys(events).length === 0) {
      Store.remove(elem)
    }
  }

  export function dispatch(
    elem: Store.EventTarget,
    evt: Event | EventObject | string,
    ...args: any[]
  ) {
    const event = EventObject.create(evt)
    event.delegateTarget = elem as Element

    const hook = Hook.get(event.type)
    if (hook.preDispatch && hook.preDispatch(elem, event) === false) {
      return undefined
    }

    const handlerQueue = Util.getHandlerQueue(elem, event)

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
          !handleObj.namespace ||
          event.rnamespace.test(handleObj.namespace)
        ) {
          event.handleObj = handleObj
          event.data = handleObj.data

          const hookHandle = Hook.get(handleObj.originType).handle

          const result = hookHandle
            ? hookHandle(matched.elem as Store.EventTarget, event, ...args)
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
    event: EventObject.Event | EventObject | EventRaw | string,
    data: any,
    elem?: Store.EventTarget,
    onlyHandlers?: boolean,
  ) {
    let eventObj = event as EventObject
    let type = typeof event === 'string' ? event : event.type
    let namespaces =
      typeof event === 'string' || eventObj.namespace == null
        ? []
        : eventObj.namespace.split('.')

    const node = (elem || Global.document) as HTMLElement

    // Don't do events on text and comment nodes
    if (node.nodeType === 3 || node.nodeType === 8) {
      return undefined
    }

    // focus/blur morphs to focusin/out; ensure we're not firing them right now
    const rfocusMorph = /^(?:focusinfocus|focusoutblur)$/
    if (rfocusMorph.test(type + triggered)) {
      return undefined
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

    // Trigger bitmask: & 1 for native handlers; & 2 for custom (always true)
    eventObj.isTrigger = onlyHandlers ? 2 : 3
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
    if (Array.isArray(data)) {
      args.push(...data)
    } else {
      args.push(data)
    }

    const hook = Hook.get(type)
    if (
      !onlyHandlers &&
      hook.trigger &&
      hook.trigger(node, eventObj, data) === false
    ) {
      return undefined
    }

    let bubbleType

    // Determine event propagation path in advance, per W3C events spec.
    // Bubble up to document, then to window; watch for a global ownerDocument
    const eventPath = [node]
    if (!onlyHandlers && !hook.noBubble && !isWindow(node)) {
      bubbleType = hook.delegateType || type

      let curr = node
      let last = node

      if (!rfocusMorph.test(bubbleType + type)) {
        curr = curr.parentNode as HTMLElement
      }

      for (; curr != null; curr = curr.parentNode as HTMLElement) {
        eventPath.push(curr)
        last = curr
      }

      // Only add window if we got to document (e.g., not plain obj or detached DOM)
      const doc = node.ownerDocument || Global.document
      if ((last as any) === doc) {
        const win =
          (last as any).defaultView ||
          (last as any).parentWindow ||
          Global.window
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
      const curr = eventPath[i]
      lastElement = curr

      eventObj.type = i > 1 ? (bubbleType as string) : hook.bindType || type

      // custom handler
      const store = Store.get(curr as Element)
      if (store) {
        if (store.events[eventObj.type] && store.handler) {
          store.handler.call(curr, ...args)
        }
      }

      // Native handler
      const handle = ontype ? curr[ontype] : null
      if (handle && handle.apply && Util.isValidTarget(curr)) {
        eventObj.result = handle.call(curr, ...args)
        if (eventObj.result === false) {
          eventObj.preventDefault()
        }
      }
    }

    eventObj.type = type

    // If nobody prevented the default action, do it now
    if (!onlyHandlers && !eventObj.isDefaultPrevented()) {
      if (
        (!hook.default ||
          hook.default(eventPath.pop()!, eventObj, data) === false) &&
        Util.isValidTarget(node)
      ) {
        // Call a native DOM method on the target with the same name as the event.
        // Don't do default actions on window, that's where global variables be (#6170)
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
            lastElement.addEventListener(type, Util.stopPropagationCallback)
          }

          node[type as 'click']()

          if (eventObj.isPropagationStopped()) {
            lastElement.removeEventListener(type, Util.stopPropagationCallback)
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
