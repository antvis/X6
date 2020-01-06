import { Platform } from '../../util'

type Handler = (e: Event) => any
const LIST_KEY = 'x6-listener-list'

function addToList(
  elem: HTMLElement | SVGElement | Document | Window,
  name: string,
  handler: Handler,
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
      handler: Handler,
      passive: boolean = false,
    ) => {
      if (Platform.SUPPORT_PASSIVE) {
        elem.addEventListener(name, handler, { passive, capture: false })
      } else {
        elem.addEventListener(name, handler, false)
      }
      addToList(elem, name, handler)
    }
  : (
      elem: HTMLElement | SVGElement | Document | Window,
      name: string,
      handler: Handler,
    ) => {
      const node = elem as any
      node.attachEvent(`on${name}`, handler)
      addToList(elem, name, handler)
    }

function removeFromList(
  elem: HTMLElement | SVGElement | Document | Window,
  name: string,
  handler: Handler,
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
      handler: Handler,
    ) => {
      elem.removeEventListener(name, handler, false)
      removeFromList(elem, name, handler)
    }
  : (
      elem: HTMLElement | SVGElement | Document | Window,
      name: string,
      handler: Handler,
    ) => {
      const node = elem as any
      node.detachEvent(`on${name}`, handler)
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
  endListener?: Handler | null,
) {
  if (startListener != null) {
    addListener(
      elem,
      Platform.SUPPORT_POINTER ? 'pointerdown' : 'mousedown',
      startListener,
    )
  }

  if (moveListener != null) {
    addListener(
      elem,
      Platform.SUPPORT_POINTER ? 'pointermove' : 'mousemove',
      moveListener,
    )
  }

  if (endListener != null) {
    addListener(
      elem,
      Platform.SUPPORT_POINTER ? 'pointerup' : 'mouseup',
      endListener,
    )
  }

  if (!Platform.SUPPORT_POINTER && Platform.SUPPORT_TOUCH) {
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
  endListener: Handler | null,
) {
  if (startListener != null) {
    removeListener(
      elem,
      Platform.SUPPORT_POINTER ? 'pointerdown' : 'mousedown',
      startListener,
    )
  }

  if (moveListener != null) {
    removeListener(
      elem,
      Platform.SUPPORT_POINTER ? 'pointermove' : 'mousemove',
      moveListener,
    )
  }

  if (endListener != null) {
    removeListener(
      elem,
      Platform.SUPPORT_POINTER ? 'pointerup' : 'mouseup',
      endListener,
    )
  }

  if (!Platform.SUPPORT_POINTER && Platform.SUPPORT_TOUCH) {
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
