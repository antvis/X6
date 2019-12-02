import { detector } from './detector'

export namespace DomEvent {
  type Handler = (e: Event) => any
  const LIST_KEY = 'LISTENER_LIST'

  function addToList(
    elem: HTMLElement | SVGElement | Document | Window,
    name: string,
    handler: Handler
  ) {
    const node = elem as any
    if (node[LIST_KEY] == null) {
      node[LIST_KEY] = []
    }
    node[LIST_KEY].push({ name, handler })
  }

  export const addListener = window.addEventListener
    ? (
        elem: HTMLElement | SVGElement | Document | Window,
        name: string,
        handler: Handler
      ) => {
        elem.addEventListener(name, handler, false)
        addToList(elem, name, handler)
      }
    : (
        elem: HTMLElement | SVGElement | Document | Window,
        name: string,
        handler: Handler
      ) => {
        ;(elem as any).attachEvent(`on${name}`, handler)
        addToList(elem, name, handler)
      }

  function removeFromList(
    elem: HTMLElement | SVGElement | Document | Window,
    name: string,
    handler: Handler
  ) {
    const list = (elem as any)[LIST_KEY]
    if (list != null) {
      for (let i = 0, ii = list.length; i < ii; i += 1) {
        const entry = list[i]
        if (entry.handler === handler) {
          list.splice(i, 1)
          break
        }
      }

      if (list.length === 0) {
        delete (elem as any)[LIST_KEY]
      }
    }
  }

  export const removeListener = window.removeEventListener
    ? (
        elem: HTMLElement | SVGElement | Document | Window,
        name: string,
        handler: Handler
      ) => {
        elem.removeEventListener(name, handler, false)
        removeFromList(elem, name, handler)
      }
    : (
        elem: HTMLElement | SVGElement | Document | Window,
        name: string,
        handler: Handler
      ) => {
        ;(elem as any).detachEvent(`on${name}`, handler)
        removeFromList(elem, name, handler)
      }

  export function removeAllListeners(elem: HTMLElement | SVGElement) {
    const list = (elem as any)[LIST_KEY]
    if (list != null) {
      while (list.length > 0) {
        const entry = list[0]
        removeListener(elem, entry.name, entry.handler)
      }
    }
  }

  export function addMouseListeners(
    elem: HTMLElement | SVGElement | Document | Window,
    startListener?: Handler | null,
    moveListener?: Handler | null,
    endListener?: Handler | null
  ) {
    if (startListener != null) {
      addListener(
        elem,
        detector.SUPPORT_POINTER ? 'pointerdown' : 'mousedown',
        startListener
      )
    }

    if (moveListener != null) {
      addListener(
        elem,
        detector.SUPPORT_POINTER ? 'pointermove' : 'mousemove',
        moveListener
      )
    }

    if (endListener != null) {
      addListener(
        elem,
        detector.SUPPORT_POINTER ? 'pointerup' : 'mouseup',
        endListener
      )
    }

    if (!detector.SUPPORT_POINTER && detector.SUPPORT_TOUCH) {
      if (startListener != null) {
        addListener(elem, 'touchstart', startListener)
      }

      if (moveListener != null) {
        addListener(elem, 'touchmove', moveListener)
      }

      if (endListener != null) {
        addListener(elem, 'touchend', endListener)
      }
    }
  }

  export function removeMouseListeners(
    elem: HTMLElement | SVGElement | Document | Window,
    startListener: Handler | null,
    moveListener: Handler | null,
    endListener: Handler | null
  ) {
    if (startListener != null) {
      removeListener(
        elem,
        detector.SUPPORT_POINTER ? 'pointerdown' : 'mousedown',
        startListener
      )
    }

    if (moveListener != null) {
      removeListener(
        elem,
        detector.SUPPORT_POINTER ? 'pointermove' : 'mousemove',
        moveListener
      )
    }

    if (endListener != null) {
      removeListener(
        elem,
        detector.SUPPORT_POINTER ? 'pointerup' : 'mouseup',
        endListener
      )
    }

    if (!detector.SUPPORT_POINTER && detector.SUPPORT_TOUCH) {
      if (startListener != null) {
        removeListener(elem, 'touchstart', startListener)
      }

      if (moveListener != null) {
        removeListener(elem, 'touchmove', moveListener)
      }

      if (endListener != null) {
        removeListener(elem, 'touchend', endListener)
      }
    }
  }

  /**
   * Removes the known listeners from the given DOM node and its descendants.
   */
  export function release(elem: HTMLElement | SVGElement) {
    try {
      if (elem != null) {
        removeAllListeners(elem)
        if (elem.childNodes) {
          elem.childNodes.forEach(child => release(child as HTMLElement))
        }
      }
    } catch (e) {}
  }

  export function addMouseWheelListener(
    func: (e: MouseWheelEvent, direction: boolean) => any,
    target?: HTMLElement
  ) {
    if (func != null) {
      const wheelHandler = function(e: MouseWheelEvent) {
        // IE does not give an event object but the
        // global event object is the mousewheel event
        // at this point in time.
        if (e == null) {
          // tslint:disable-next-line
          e = window.event as MouseWheelEvent
        }

        let delta = 0

        if (detector.IS_FIREFOX) {
          delta = -e.detail / 2
        } else {
          delta = (e as any).wheelDelta / 120
        }

        // Handles the event using the given function
        if (delta !== 0) {
          func(e, delta > 0)
        }
      }

      // Webkit has NS event API, but IE event name and details
      if (detector.IS_NETSCAPE && (document as any).documentMode == null) {
        const eventName =
          detector.IS_SAFARI || detector.IS_CHROME
            ? 'mousewheel'
            : 'DOMMouseScroll'
        const elem = detector.IS_CHROME && target != null ? target : window
        addListener(elem as any, eventName, wheelHandler)
      } else {
        addListener(document as any, 'mousewheel', wheelHandler)
      }
    }
  }

  export function disableContextMenu(elem: HTMLElement) {
    addListener(elem, 'contextmenu', e => {
      if (e.preventDefault) {
        e.preventDefault()
      }

      return false
    })
  }

  /**
   * Returns the event's target or srcElement depending on the browser.
   */
  export function getSource(e: Event) {
    return (e.srcElement || e.target) as Element
  }

  /**
   * Returns true if the event was generated using a touch device
   * (not a pen or mouse).
   */
  export function isTouchEvent(e: any) {
    return e.pointerType != null
      ? e.pointerType === 'touch' || e.pointerType === e.MSPOINTER_TYPE_TOUCH
      : e.mozInputSource != null
      ? e.mozInputSource === 5
      : e.type.indexOf('touch') === 0
  }

  /**
   * Returns true if the event was generated using a pen
   * (not a touch device or mouse).
   */
  export function isPenEvent(e: any) {
    return e.pointerType != null
      ? e.pointerType === 'pen' || e.pointerType === e.MSPOINTER_TYPE_PEN
      : e.mozInputSource != null
      ? e.mozInputSource === 2
      : e.type.indexOf('pen') === 0
  }

  export function isTouchOrPenEvent(e: any) {
    return isTouchEvent(e) || isPenEvent(e)
  }

  /**
   * Returns true if the event was generated using a touch device
   * (not a pen or mouse).
   */
  export function isMultiTouchEvent(e: any) {
    return (
      e.type != null &&
      e.type.indexOf('touch') === 0 &&
      e.touches != null &&
      e.touches.length > 1
    )
  }

  /**
   * Returns true if the event was generated using a mouse
   * (not a pen or touch device).
   */
  export function isMouseEvent(e: any) {
    return e.pointerType != null
      ? e.pointerType === 'mouse' || e.pointerType === e.MSPOINTER_TYPE_MOUSE
      : e.mozInputSource != null
      ? e.mozInputSource === 1
      : e.type.indexOf('mouse') === 0
  }

  export function isLeftMouseButton(e: any) {
    // Special case for mousemove and mousedown we check the buttons
    // if it exists because which is 0 even if no button is pressed
    if ('buttons' in e && (e.type === 'mousedown' || e.type === 'mousemove')) {
      return e.buttons === 1
    }

    if ('which' in e) {
      return e.which === 1
    }

    return e.button === 1
  }

  export function isMiddleMouseButton(e: any) {
    if ('which' in e) {
      return e.which === 2
    }

    return e.button === 4
  }

  export function isRightMouseButton(e: any) {
    if ('which' in e) {
      return e.which === 3
    }
    return e.button === 2
  }

  /**
   * Returns true if the event is a popup trigger. This implementation
   * returns true if the right button or the left button and control was
   * pressed on a Mac.
   */
  export function isPopupTrigger(e: MouseEvent) {
    return (
      isRightMouseButton(e) ||
      (detector.IS_MAC &&
        isControlDown(e) &&
        !isShiftDown(e) &&
        !isMetaDown(e) &&
        !isAltDown(e))
    )
  }

  export function isShiftDown(e: MouseEvent | KeyboardEvent) {
    return e != null ? e.shiftKey : false
  }

  export function isAltDown(e: MouseEvent | KeyboardEvent) {
    return e != null ? e.altKey : false
  }

  export function isControlDown(e: MouseEvent | KeyboardEvent) {
    return e != null ? e.ctrlKey : false
  }

  export function isMetaDown(e: MouseEvent | KeyboardEvent) {
    return e != null ? e.metaKey : false
  }

  export function getMainEvent(e: MouseEvent | TouchEvent) {
    if (
      (e.type === 'touchstart' || e.type === 'touchmove') &&
      (e as TouchEvent).touches != null &&
      (e as TouchEvent).touches[0] != null
    ) {
      return (e as TouchEvent).touches[0]
    }

    if (
      e.type === 'touchend' &&
      (e as TouchEvent).changedTouches != null &&
      (e as TouchEvent).changedTouches[0] != null
    ) {
      return (e as TouchEvent).changedTouches[0]
    }

    return e
  }

  export function getClientX(e: MouseEvent | TouchEvent) {
    return (getMainEvent(e) as MouseEvent).clientX
  }

  export function getClientY(e: MouseEvent | TouchEvent) {
    return (getMainEvent(e) as MouseEvent).clientY
  }

  /**
   * Returns true if the event has been consumed using `consume`.
   */
  export function isConsumed(e: Event) {
    return (e as any).isConsumed === true
  }

  export function consume(
    e: Event,
    preventDefault: boolean = true,
    stopPropagation: boolean = true
  ) {
    if (preventDefault) {
      if (e.preventDefault) {
        if (stopPropagation) {
          e.stopPropagation()
        }

        e.preventDefault()
      } else if (stopPropagation) {
        e.cancelBubble = true
      }
    }

    // Opera
    ;(e as any).isConsumed = true

    // Other browsers
    if (!e.preventDefault) {
      e.returnValue = false
    }
  }

  export const CLICK = 'click'
  export const DOUBLE_CLICK = 'doubleClick'
  export const MOUSE_DOWN = 'mouseDown'
  export const MOUSE_MOVE = 'mouseMove'
  export const MOUSE_UP = 'mouseUp'
  export const ESCAPE = 'escape'
  export const FIRE_MOUSE_EVENT = 'fireMouseEvent'
  export const START_EDITING = 'startEditing'
}
