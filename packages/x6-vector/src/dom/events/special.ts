import { isAncestorOf } from '../../util'
import { Util } from './util'
import { Hook } from './hook'
import { Core } from './core'
import { Store } from './store'

export namespace Special {
  // Prevent triggered image.load events from bubbling to window.load
  Hook.register('load', {
    noBubble: true,
  })

  Hook.register('beforeunload', {
    postDispatch(elem, event) {
      // Support: Chrome <=73+
      // Chrome doesn't alert on `event.preventDefault()`
      // as the standard mandates.
      if (event.result !== undefined && event.originalEvent) {
        event.originalEvent.returnValue = event.result
      }
    },
  })
}

export namespace Special {
  const events = {
    mouseenter: 'mouseover',
    mouseleave: 'mouseout',
    pointerenter: 'pointerover',
    pointerleave: 'pointerout',
  }
  Object.keys(events).forEach((type: keyof typeof events) => {
    const delegateType = events[type]
    Hook.register(type, {
      delegateType,
      bindType: delegateType,
      handle(target, event, ...args) {
        let ret
        const related = event.relatedTarget
        const handleObj = event.handleObj

        // For mouseenter/leave call the handler if related is outside the target.
        // NB: No relatedTarget if the mouse left/entered the browser window
        if (
          !related ||
          (related !== target &&
            !isAncestorOf(target as Element, related as Element))
        ) {
          event.type = handleObj.originType
          ret = handleObj.handler.call(this, event, ...args)
          event.type = delegateType
        }
        return ret
      },
    })
  })
}

export namespace Special {
  namespace State {
    type Item = boolean | any[] | { value: any }

    const cache: WeakMap<
      Store.EventTarget,
      Record<string, Item>
    > = new WeakMap()

    export function has(elem: Store.EventTarget, type: string) {
      return cache.has(elem) && cache.get(elem)![type] != null
    }

    export function get(elem: Store.EventTarget, type: string) {
      const item = cache.get(elem)
      if (item) {
        return item[type]
      }
      return null
    }

    export function set(elem: Store.EventTarget, type: string, val: Item) {
      if (!cache.has(elem)) {
        cache.set(elem, {})
      }
      const bag = cache.get(elem)!
      bag[type] = val
    }
  }

  // eslint-disable-next-line no-inner-declarations
  function leverageNative(
    elem: Store.EventTarget,
    type: string,
    isSync?: (taget: Store.EventTarget, t: string) => boolean,
  ) {
    if (!isSync) {
      if (!State.has(elem, type)) {
        Core.on(elem, type, Util.returnTrue)
      }
      return
    }

    // Register the controller as a special universal handler for all event namespaces
    State.set(elem, type, false)

    Core.on(elem, type, {
      namespace: false,
      handler(event, ...args) {
        const node = this as HTMLElement
        const nativeHandle = node[type as 'click']
        let saved = State.get(this, type)!

        // eslint-disable-next-line no-bitwise
        if (event.isTrigger & 1 && nativeHandle) {
          // Interrupt processing of the outer synthetic .trigger()ed event
          // Saved data should be false in such cases, but might be a leftover
          // capture object from an async native handler
          if (!Array.isArray(saved)) {
            // Store arguments for use when handling the inner native event
            // There will always be at least one argument (an event object),
            // so this array will not be confused with a leftover capture object.
            saved = [event, ...args]
            State.set(node, type, saved)

            // Trigger the native event and capture its result
            // Support: IE <=9 - 11+
            // focus() and blur() are asynchronous
            const notAsync = isSync(this, type)
            nativeHandle()
            let result = State.get(this, type)
            if (saved !== result || notAsync) {
              State.set(this, type, false)
            } else {
              result = { value: undefined }
            }

            if (saved !== result) {
              // Cancel the outer synthetic event
              event.stopImmediatePropagation()
              event.preventDefault()

              // Support: Chrome 86+
              // In Chrome, if an element having a focusout handler is blurred
              // by clicking outside of it, it invokes the handler synchronously.
              // If that handler calls `.remove()` on the element, the data is
              // cleared, leaving `result` undefined. We need to guard against
              // this.
              return result && (result as any).value
            }

            // If this is an inner synthetic event for an event with a bubbling
            // surrogate (focus or blur), assume that the surrogate already
            // propagated from triggering the native event and prevent that
            // from happening again here. This technically gets the ordering
            // wrong w.r.t. to `.trigger()` (in which the bubbling surrogate
            // propagates *after* the non-bubbling base), but that seems less
            // bad than duplication.
          } else if (Hook.get(type).delegateType) {
            event.stopPropagation()
          }

          // If this is a native event triggered above, everything is now in order
          // Fire an inner synthetic event with the original arguments
        } else if (saved && Array.isArray(saved)) {
          // ...and capture the result
          State.set(this, type, {
            value: Core.trigger(
              // Support: IE <=9 - 11+
              // Extend with the prototype to reset the above stopImmediatePropagation()
              jQuery.extend(saved[0], jQuery.Event.prototype),
              saved.slice(1),
              this,
            ),
          })

          // Abort handling of the native event
          event.stopImmediatePropagation()
        }

        return undefined
      },
    })
  }

  // Utilize native event to ensure correct state for checkable inputs
  Hook.register('click', {
    setup(elem) {
      if (Util.isCheckableInput(elem)) {
        leverageNative(elem, 'click', Util.returnTrue)
      }

      // Return false to allow normal processing in the caller
      return false
    },
    trigger(elem) {
      // Force setup before triggering a click
      if (Util.isCheckableInput(elem)) {
        leverageNative(elem, 'click')
      }

      // Return non-false to allow normal event-path propagation
      return true
    },

    // For cross-browser consistency, suppress native .click() on links
    // Also prevent it if we're currently inside a leveraged native-event stack
    default(elem, event) {
      const target = event.target
      return (
        (Util.isCheckableInput(elem) && State.get(target, 'click')) ||
        (target &&
          (target as Node).nodeName &&
          (target as Node).nodeName.toLowerCase() === 'a')
      )
    },
  })

  // focus/blur
  // ----------

  // Support: IE <=9 - 11+
  // focus() and blur() are asynchronous, except when they are no-op.
  // So expect focus to be synchronous when the element is already active,
  // and blur to be synchronous when the element is not already active.
  // (focus and blur are always synchronous in other supported browsers,
  // this just defines when we can count on it).
  // eslint-disable-next-line no-inner-declarations
  function expectSync(elem: Element, type: string) {
    return (elem === document.activeElement) === (type === 'focus')
  }

  const events = { focus: 'focusin', blur: 'focusout' }
  Object.keys(events).forEach((type: keyof typeof events) => {
    const delegateType = events[type]

    // Utilize native event if possible so blur/focus sequence is correct
    Hook.register(type, {
      delegateType,
      setup(elem) {
        // Claim the first handler
        // cache.set( elem, "focus", ... )
        // cache.set( elem, "blur", ... )
        leverageNative(elem, type, expectSync)

        // Return false to allow normal processing in the caller
        return false
      },
      trigger(elem) {
        // Force setup before trigger
        leverageNative(elem, type)

        // Return non-false to allow normal event-path propagation
        return true
      },

      // Suppress native focus or blur as it's already being fired
      // in leverageNative.
      default() {
        return true
      },
    })
  })
}
