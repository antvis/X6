import { detector } from './detector'

export namespace DomEvent {
  type Handler = (e: Event) => any
  const LIST_KEY = 'LISTENER_LIST'

  function addToList(
    elem: HTMLElement | SVGElement | Document | Window,
    name: string,
    handler: Handler,
  ) {
    if ((elem as any)[LIST_KEY] == null) {
      (elem as any)[LIST_KEY] = []
    }
    (elem as any)[LIST_KEY].push({ name, handler })
  }

  export const addListener = window.addEventListener
    ? (
      elem: HTMLElement | SVGElement | Document | Window,
      name: string,
      handler: Handler,
    ) => {
      elem.addEventListener(name, handler, false)
      addToList(elem, name, handler)
    }
    : (
      elem: HTMLElement | SVGElement | Document | Window,
      name: string,
      handler: Handler,
    ) => {
      (elem as any).attachEvent(`on${name}`, handler)
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
      (elem as any).detachEvent(`on${name}`, handler)
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
        detector.SUPPORT_POINTER ? 'pointerdown' : 'mousedown',
        startListener,
      )
    }

    if (moveListener != null) {
      addListener(
        elem,
        detector.SUPPORT_POINTER ? 'pointermove' : 'mousemove',
        moveListener,
      )
    }

    if (endListener != null) {
      addListener(
        elem,
        detector.SUPPORT_POINTER ? 'pointerup' : 'mouseup',
        endListener,
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
    endListener: Handler | null,
  ) {
    if (startListener != null) {
      removeListener(
        elem,
        detector.SUPPORT_POINTER ? 'pointerdown' : 'mousedown',
        startListener,
      )
    }

    if (moveListener != null) {
      removeListener(
        elem,
        detector.SUPPORT_POINTER ? 'pointermove' : 'mousemove',
        moveListener,
      )
    }

    if (endListener != null) {
      removeListener(
        elem,
        detector.SUPPORT_POINTER ? 'pointerup' : 'mouseup',
        endListener,
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
    } catch (e) { }
  }

  export function addMouseWheelListener(
    func: (e: MouseWheelEvent, direction: boolean) => any,
    target?: HTMLElement,
  ) {
    if (func != null) {
      const wheelHandler = function (e: MouseWheelEvent) {
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
        const eventName = (detector.IS_SAFARI || detector.IS_CHROME)
          ? 'mousewheel'
          : 'DOMMouseScroll'
        const elem = (detector.IS_CHROME && target != null) ? target : window
        addListener(elem as any, eventName, wheelHandler)
      } else {
        addListener(document as any, 'mousewheel', wheelHandler)
      }
    }
  }

  export function disableContextMenu(elem: HTMLElement) {
    addListener(elem, 'contextmenu', (e) => {
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
    return (
      (e.pointerType != null)
        ? (e.pointerType === 'touch' || e.pointerType === e.MSPOINTER_TYPE_TOUCH)
        : ((e.mozInputSource != null)
          ? e.mozInputSource === 5
          : e.type.indexOf('touch') === 0)
    )
  }

  /**
	 * Returns true if the event was generated using a pen
   * (not a touch device or mouse).
	 */
  export function isPenEvent(e: any) {
    return (
      (e.pointerType != null)
        ? (e.pointerType === 'pen' || e.pointerType === e.MSPOINTER_TYPE_PEN)
        : ((e.mozInputSource != null)
          ? e.mozInputSource === 2
          : e.type.indexOf('pen') === 0)
    )
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
    return (
      (e.pointerType != null)
        ? (e.pointerType === 'mouse' || e.pointerType === e.MSPOINTER_TYPE_MOUSE)
        : ((e.mozInputSource != null)
          ? e.mozInputSource === 1
          : e.type.indexOf('mouse') === 0)
    )
  }

  export function isLeftMouseButton(e: any) {
    // Special case for mousemove and mousedown we check the buttons
    // if it exists because which is 0 even if no button is pressed
    if (
      ('buttons' in e) &&
      (e.type === 'mousedown' || e.type === 'mousemove')
    ) {
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
      (
        detector.IS_MAC &&
        isControlDown(e) &&
        !isShiftDown(e) &&
        !isMetaDown(e) &&
        !isAltDown(e)
      )
    )
  }

  export function isShiftDown(e: MouseEvent | KeyboardEvent) {
    return (e != null) ? e.shiftKey : false
  }

  export function isAltDown(e: MouseEvent | KeyboardEvent) {
    return (e != null) ? e.altKey : false
  }

  export function isControlDown(e: MouseEvent | KeyboardEvent) {
    return (e != null) ? e.ctrlKey : false
  }

  export function isMetaDown(e: MouseEvent | KeyboardEvent) {
    return (e != null) ? e.metaKey : false
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
    return (e as any).isConsumed != null && (e as any).isConsumed
  }

  export function consume(
    e: Event,
    preventDefault: boolean = true,
    stopPropagation: boolean = true,
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
    (e as any).isConsumed = true

    // Other browsers
    if (!e.preventDefault) {
      e.returnValue = false
    }
  }

  /**
    * Index for the label handle in an MouseEvent. This should be a negative
    * value that does not interfere with any possible handle indices.
    *
    * Default is -1.
    */
  export const LABEL_HANDLE = -1

  /**
    * Index for the rotation handle in an MouseEvent. This should be a
    * negative value that does not interfere with any possible handle indices.
    *
    * Default is -2.
    */
  export const ROTATION_HANDLE = -2

  /**
   * Start index for the custom handles in an MouseEvent. This should be a
   * negative value and is the start index which is decremented for each
   * custom handle.
   *
   * Default is -100.
   */
  export const CUSTOM_HANDLE = -100

  /**
   * Start index for the virtual handles in an MouseEvent. This should be a
   * negative value and is the start index which is decremented for each
   * virtual handle.
   *
   * Default is -100000. This assumes that there are no more
   * than VIRTUAL_HANDLE - CUSTOM_HANDLE custom handles.
   */
  export const VIRTUAL_HANDLE = -100000

  export const MOUSE_DOWN = 'mouseDown'
  export const MOUSE_MOVE = 'mouseMove'
  export const MOUSE_UP = 'mouseUp'
  export const ACTIVATE = 'activate'
  export const RESIZE_START = 'resizeStart'
  export const RESIZE = 'resize'
  export const RESIZE_END = 'resizeEnd'
  export const MOVE_START = 'moveStart'
  export const MOVE = 'move'
  export const MOVE_END = 'moveEnd'
  export const PAN_START = 'panStart'
  export const PAN = 'pan'
  export const PAN_END = 'panEnd'
  export const MINIMIZE = 'minimize'
  export const NORMALIZE = 'normalize'
  export const MAXIMIZE = 'maximize'
  export const HIDE = 'hide'
  export const SHOW = 'show'
  export const CLOSE = 'close'
  export const DESTROY = 'destroy'
  export const REFRESH = 'refresh'
  export const SIZE = 'size'
  export const SELECT = 'select'
  export const FIRED = 'fired'
  export const FIRE_MOUSE_EVENT = 'fireMouseEvent'
  export const GESTURE = 'gesture'
  export const TAP_AND_HOLD = 'tapAndHold'
  export const GET = 'get'
  export const RECEIVE = 'receive'
  export const CONNECT = 'connect'
  export const DISCONNECT = 'disconnect'
  export const SUSPEND = 'suspend'
  export const RESUME = 'resume'
  export const MARK = 'mark'
  export const ROOT = 'root'
  export const POST = 'post'
  export const OPEN = 'open'
  export const SAVE = 'save'
  export const BEFORE_ADD_VERTEX = 'beforeAddVertex'
  export const ADD_VERTEX = 'addVertex'
  export const AFTER_ADD_VERTEX = 'afterAddVertex'
  export const DONE = 'done'
  export const EXECUTE = 'execute'
  export const EXECUTED = 'executed'
  export const BEGIN_UPDATE = 'beginUpdate'
  export const START_EDIT = 'startEdit'
  export const END_UPDATE = 'endUpdate'
  export const END_EDIT = 'endEdit'
  export const BEFORE_UNDO = 'beforeUndo'
  export const UNDO = 'undo'
  export const REDO = 'redo'
  export const CHANGE = 'change'
  export const NOTIFY = 'notify'
  export const LAYOUT_CELLS = 'layoutCells'
  export const CLICK = 'click'
  export const SCALE = 'scale'
  export const TRANSLATE = 'translate'
  export const SCALE_AND_TRANSLATE = 'scaleAndTranslate'
  export const UP = 'up'
  export const DOWN = 'down'
  export const ADD = 'add'
  export const REMOVE = 'remove'
  export const CLEAR = 'clear'
  export const ADD_CELLS = 'addCells'
  export const CELLS_ADDED = 'cellsAdded'
  export const MOVE_CELLS = 'moveCells'
  export const CELLS_MOVED = 'cellsMoved'
  export const RESIZE_CELLS = 'resizeCells'
  export const CELLS_RESIZED = 'cellsResized'
  export const TOGGLE_CELLS = 'toggleCells'
  export const CELLS_TOGGLED = 'cellsToggled'
  export const ORDER_CELLS = 'orderCells'
  export const CELLS_ORDERED = 'cellsOrdered'
  export const REMOVE_CELLS = 'removeCells'
  export const CELLS_REMOVED = 'cellsRemoved'
  export const GROUP_CELLS = 'groupCells'
  export const UNGROUP_CELLS = 'ungroupCells'
  export const REMOVE_CELLS_FROM_PARENT = 'removeCellsFromParent'
  export const FOLD_CELLS = 'foldCells'
  export const CELLS_FOLDED = 'cellsFolded'
  export const ALIGN_CELLS = 'alignCells'
  export const LABEL_CHANGED = 'labelChanged'
  export const CONNECT_CELL = 'connectCell'
  export const CELL_CONNECTED = 'cellConnected'
  export const SPLIT_EDGE = 'splitEdge'
  export const FLIP_EDGE = 'flipEdge'
  export const START_EDITING = 'startEditing'
  export const EDITING_STARTED = 'editingStarted'
  export const EDITING_STOPPED = 'editingStopped'
  export const ADD_OVERLAY = 'addOverlay'
  export const REMOVE_OVERLAY = 'removeOverlay'
  export const UPDATE_CELL_SIZE = 'updateCellSize'
  export const ESCAPE = 'escape'
  export const DOUBLE_CLICK = 'doubleClick'
  export const START = 'start'
  export const RESET = 'reset'
}
