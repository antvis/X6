import { Store } from './store'
import { EventObject } from './object'
import { EventHandler } from './types'

export namespace EventHook {
  const cache: { [type: string]: EventHook } = {}

  export function get(type: string) {
    return cache[type] || {}
  }

  export function register(type: string, hook: EventHook) {
    cache[type] = hook
  }

  export function unregister(type: string) {
    delete cache[type]
  }
}

export interface EventHook {
  /**
   * Indicates whether this event type should be bubbled when the `.trigger()`
   * method is called; by default it is `false`, meaning that a triggered event
   * will bubble to the element's parents up to the document (if attached to a
   * document) and then to the window. Note that defining `noBubble` on an event
   * will effectively prevent that event from being used for delegated events
   * with `.trigger()`.
   */
  noBubble?: boolean

  /**
   * When defined, these string properties specify that a special event should
   * be handled like another event type until the event is delivered.
   *
   * The `bindType` is used if the event is attached directly, and the
   * `delegateType` is used for delegated events. These types are generally DOM
   * event types, and should not be a special event themselves.
   */
  bindType?: string

  /**
   * When defined, these string properties specify that a special event should
   * be handled like another event type until the event is delivered.
   *
   * The `bindType` is used if the event is attached directly, and the
   * `delegateType` is used for delegated events. These types are generally DOM
   * event types, and should not be a special event themselves.
   */
  delegateType?: string

  /**
   * The setup hook is called the first time an event of a particular type is
   * attached to an element; this provides the hook an opportunity to do
   * processing that will apply to all events of this type on the element.
   *
   * The `elem` is the reference to the element where the event is being
   * attached and `eventHandle` is the event handler function. In most cases
   * the `namespaces` argument should not be used, since it only represents the
   * namespaces of the first event being attached; subsequent events may not
   * have this same namespaces.
   *
   * This hook can perform whatever processing it desires, including attaching
   * its own event handlers to the element or to other elements and recording
   * setup information on the element using the `.data()` method. If the
   * setup hook wants me to add a browser event (via `addEventListener` or
   * `attachEvent`, depending on browser) it should return `false`. In all
   * other cases, me will not add the browser event, but will continue all its
   * other bookkeeping for the event. This would be appropriate, for example,
   * if the event was never fired by the browser but invoked by `.trigger()`.
   * To attach the me event handler in the setup hook, use the `eventHandle`
   * argument.
   *
   */
  setup?: (
    elem: Store.EventTarget,
    data: any,
    namespaces: string[],
    eventHandle: EventHandler<Store.EventTarget, any>,
  ) => any | false

  /**
   * The teardown hook is called when the final event of a particular type is
   * removed from an element. The `elem` is the reference to the element where
   * the event is being cleaned up. This hook should return `false` if it wants
   * me to remove the event from the browser's event system (via
   * `removeEventListener` or `detachEvent`). In most cases, the setup and
   * teardown hooks should return the same value.
   *
   * If the setup hook attached event handlers or added data to an element
   * through a mechanism such as `.data()`, the teardown hook should reverse
   * the process and remove them. me will generally remove the data and events
   * when an element is totally removed from the document, but failing to remove
   * data or events on teardown will cause a memory leak if the element stays in
   * the document.
   *
   */
  teardown?: (
    elem: Store.EventTarget,
    namespaces: string[],
    eventHandle: EventHandler<Store.EventTarget, any>,
  ) => any | false

  /**
   * Each time an event handler is added to an element through an API such as
   * `.on()`, me calls this hook. The `elem` is the element to which the event
   * handler is being added, and the `handleObj` argument is as described in the
   * section above. The return value of this hook is ignored.
   */
  add?: (elem: Store.EventTarget, handleObj: Store.HandlerObject) => void

  /**
   * When an event handler is removed from an element using an API such as
   * `.off()`, this hook is called. The `elem` is the element where the handler
   * is being removed, and the `handleObj` argument is as described in the
   * section above. The return value of this hook is ignored.
   *
   */
  remove?: (elem: Store.EventTarget, handleObj: Store.HandlerObject) => void

  /**
   * The handle hook is called when the event has occurred and me would
   * normally call the user's event handler specified by `.on()` or another
   * event binding method. If the hook exists, me calls it instead of that
   * event handler, passing it the event and any data passed from `.trigger()`
   * if it was not a native event. The `elem` argument is the DOM element being
   * handled, and `event.handleObj` property has the detailed event information.
   *
   */
  handle?: (elem: Store.EventTarget, event: EventObject, ...args: any[]) => void

  /**
   * Called when the `.trigger()` method is used to trigger an event for the
   * special type from code, as opposed to events that originate from within
   * the browser. The `elem` argument will be the element being triggered, and
   * the `event` argument will be a `EventObject` object constructed from the
   * caller's input. At minimum, the event type, data, namespace, and target
   * properties are set on the event. The data argument represents additional
   * data passed by `.trigger()` if present.
   *
   */
  trigger?: (
    elem: Store.EventTarget,
    event: EventObject,
    data: any,
  ) => any | false

  /**
   * When the `.trigger()` method finishes running all the event handlers for
   * an event, it also looks for and runs any method on the target object by
   * the same name unless of the handlers called `event.preventDefault()`. So,
   * `.trigger("submit")` will execute the `submit()` method on the element if
   * one exists. When a `preventDefault` hook is specified, the hook is called
   * just prior to checking for and executing the element's default method. If
   * this hook returns the value `false` the element's default method will be
   * called; otherwise it is not.
   */
  preventDefault?: (
    elem: Store.EventTarget,
    event: EventObject,
    data: any,
  ) => any | false

  preDispatch?: (elem: Store.EventTarget, event: EventObject) => void | false

  postDispatch?: (elem: Store.EventTarget, event: EventObject) => void
}
