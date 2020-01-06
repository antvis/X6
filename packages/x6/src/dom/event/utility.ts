import { Platform } from '../../util'
import { addListener } from './listener'

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
    (Platform.IS_MAC &&
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
