import { Util } from './util'
import { Store } from './store'
import { EventRaw } from './alias'

export class EventObject<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
  TEvent extends Event = Event,
> implements EventObject.Event
{
  isDefaultPrevented: () => boolean = Util.returnFalse
  isPropagationStopped: () => boolean = Util.returnFalse
  isImmediatePropagationStopped: () => boolean = Util.returnFalse

  type: string
  originalEvent: TEvent

  target: TTarget | null
  currentTarget: TCurrentTarget | null
  delegateTarget: TDelegateTarget | null
  relatedTarget?: EventTarget | null

  data: TData
  result: any

  timeStamp: number
  handleObj: Store.HandlerObject
  namespace?: string
  rnamespace?: RegExp | null
  isSimulated = false

  constructor(e: TEvent | string, props?: Record<string, any> | null) {
    if (typeof e === 'string') {
      this.type = e
    } else if (e.type) {
      this.originalEvent = e
      this.type = e.type

      // Events bubbling up the document may have been marked as prevented
      // by a handler lower down the tree; reflect the correct value.
      this.isDefaultPrevented = e.defaultPrevented
        ? Util.returnTrue
        : Util.returnFalse

      // Create target properties
      this.target = e.target as any as TTarget
      this.currentTarget = e.currentTarget as any as TCurrentTarget
      this.relatedTarget = (e as any as MouseEvent).relatedTarget
      this.timeStamp = e.timeStamp
    }

    // Put explicitly provided properties onto the event object
    if (props) {
      Object.assign(this, props)
    }

    // Create a timestamp if incoming event doesn't have one
    if (!this.timeStamp) {
      this.timeStamp = Date.now()
    }
  }

  preventDefault = () => {
    const e = this.originalEvent

    this.isDefaultPrevented = Util.returnTrue

    if (e && !this.isSimulated) {
      e.preventDefault()
    }
  }

  stopPropagation = () => {
    const e = this.originalEvent

    this.isPropagationStopped = Util.returnTrue

    if (e && !this.isSimulated) {
      e.stopPropagation()
    }
  }

  stopImmediatePropagation = () => {
    const e = this.originalEvent

    this.isImmediatePropagationStopped = Util.returnTrue

    if (e && !this.isSimulated) {
      e.stopImmediatePropagation()
    }

    this.stopPropagation()
  }
}

export interface EventObject extends EventObject.Event {}

export namespace EventObject {
  export function create(originalEvent: EventRaw | EventObject | string) {
    return originalEvent instanceof EventObject
      ? originalEvent
      : new EventObject(originalEvent)
  }
}

export namespace EventObject {
  export function addProperty(
    name: string,
    hook?: any | ((e: EventRaw) => any),
  ) {
    Object.defineProperty(EventObject.prototype, name, {
      enumerable: true,
      configurable: true,
      get:
        typeof hook === 'function'
          ? // eslint-disable-next-line
            function (this: EventObject) {
              if (this.originalEvent) {
                return (hook as any)(this.originalEvent)
              }
            }
          : // eslint-disable-next-line
            function (this: EventObject) {
              if (this.originalEvent) {
                return this.originalEvent[name as 'type']
              }
            },
      set(value) {
        Object.defineProperty(this, name, {
          enumerable: true,
          configurable: true,
          writable: true,
          value,
        })
      },
    })
  }
}

export namespace EventObject {
  // Common event props including KeyEvent and MouseEvent specific props.
  const commonProps = {
    bubbles: true,
    cancelable: true,
    eventPhase: true,

    detail: true,
    view: true,

    button: true,
    buttons: true,
    clientX: true,
    clientY: true,
    offsetX: true,
    offsetY: true,
    pageX: true,
    pageY: true,
    screenX: true,
    screenY: true,
    toElement: true,

    pointerId: true,
    pointerType: true,

    char: true,
    code: true,
    charCode: true,
    key: true,
    keyCode: true,

    touches: true,
    changedTouches: true,
    targetTouches: true,

    which: true,
    altKey: true,
    ctrlKey: true,
    metaKey: true,
    shiftKey: true,
  }

  Object.keys(commonProps).forEach((name: keyof typeof commonProps) =>
    EventObject.addProperty(name, commonProps[name]),
  )
}

export namespace EventObject {
  export interface Event {
    // Event

    bubbles: boolean | undefined
    cancelable: boolean | undefined
    eventPhase: number | undefined

    // UIEvent

    detail: number | undefined
    view: Window | undefined

    // MouseEvent

    button: number | undefined
    buttons: number | undefined
    clientX: number | undefined
    clientY: number | undefined
    offsetX: number | undefined
    offsetY: number | undefined
    pageX: number | undefined
    pageY: number | undefined
    screenX: number | undefined
    screenY: number | undefined
    /** @deprecated */
    toElement: Element | undefined

    // PointerEvent

    pointerId: number | undefined
    pointerType: string | undefined

    // KeyboardEvent

    /** @deprecated */
    char: string | undefined
    /** @deprecated */
    charCode: number | undefined
    key: string | undefined
    /** @deprecated */
    keyCode: number | undefined

    // TouchEvent

    touches: TouchList | undefined
    targetTouches: TouchList | undefined
    changedTouches: TouchList | undefined

    // MouseEvent, KeyboardEvent

    which: number | undefined

    // MouseEvent, KeyboardEvent, TouchEvent

    altKey: boolean | undefined
    ctrlKey: boolean | undefined
    metaKey: boolean | undefined
    shiftKey: boolean | undefined

    type: string
    timeStamp: number

    isDefaultPrevented(): boolean
    isImmediatePropagationStopped(): boolean
    isPropagationStopped(): boolean
    preventDefault(): void
    stopImmediatePropagation(): void
    stopPropagation(): void
  }
}
