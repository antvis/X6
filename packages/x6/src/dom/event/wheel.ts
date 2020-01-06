import { Platform } from '../../util'
import { addListener, removeListener } from './listener'

type Callback = (e: WheelEvent) => void
type WheelCache = WeakMap<WheelHandler, Callback>
const CACHE_KEY = 'x6-mousewheel-cache'

function cacheWheelCallback(
  target: any,
  callback: (e: WheelEvent) => void,
  handler: WheelHandler,
) {
  if (target[CACHE_KEY] == null) {
    target[CACHE_KEY] = new WeakMap<WheelHandler, Callback>()
  }

  const cache = target[CACHE_KEY] as WheelCache
  cache.set(handler, callback)
}

function deleteWheelCallback(target: any, handler: WheelHandler) {
  const cache = target[CACHE_KEY] as WheelCache
  if (cache != null) {
    const cb = cache.get(handler)
    if (cb != null) {
      cache.delete(handler)
    }
    return cb
  }

  return null
}

function isSpecialWheel() {
  return Platform.IS_NETSCAPE && (document as any).documentMode == null
}

function getWheelEventName() {
  return Platform.IS_SAFARI || Platform.IS_CHROME
    ? 'mousewheel'
    : 'DOMMouseScroll'
}

function getWheelEventTarget(target?: HTMLElement) {
  return Platform.IS_CHROME && target != null ? target : window
}

export type WheelHandler = (e: WheelEvent, direction: boolean) => any

export function addWheelListener(handler: WheelHandler, target?: HTMLElement) {
  if (handler != null) {
    const callback = function(e: WheelEvent) {
      // IE does not give an event object but the
      // global event object is the mousewheel event
      // at this point in time.
      if (e == null) {
        // tslint:disable-next-line
        e = window.event as WheelEvent
      }

      let delta = 0

      if (Platform.IS_FIREFOX) {
        delta = -e.detail / 2
      } else {
        delta = (e as any).wheelDelta / 120
      }

      // Handles the event using the given function
      if (delta !== 0) {
        handler(e, delta > 0)
      }
    }

    // Webkit has NS event API, but IE event name and details
    if (isSpecialWheel()) {
      const name = getWheelEventName()
      const elem = getWheelEventTarget()
      addListener(elem, name, callback, false)
      cacheWheelCallback(elem, callback, handler)
    } else {
      addListener(document, 'mousewheel', callback, false)
      cacheWheelCallback(document, callback, handler)
    }
  }
}

export function removeWheelListener(
  handler: WheelHandler,
  target?: HTMLElement,
) {
  if (handler != null) {
    if (isSpecialWheel()) {
      const elem = getWheelEventTarget(target)
      const callback = deleteWheelCallback(elem, handler)
      if (callback != null) {
        const name = getWheelEventName()
        removeListener(elem, name, callback)
      }
    } else {
      const callback = deleteWheelCallback(document, handler)
      if (callback != null) {
        removeListener(document, 'mousewheel', callback)
      }
    }
  }
}
