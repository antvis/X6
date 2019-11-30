import { Dnd } from '.'

export function getParents(elem: HTMLElement) {
  let parent = elem
  const result: HTMLElement[] = []
  while (parent != null) {
    result.push(parent)
    parent = parent.parentNode as HTMLElement
  }
  return result
}

export function getDndElement(
  instance: Dnd,
  trigger: HTMLElement,
  elem: Dnd.HTMLElementOrFunc | undefined,
  fallback: HTMLElement | (() => HTMLElement),
): HTMLElement {
  if (elem != null) {
    if (typeof elem === 'function') {
      return elem.call(instance, trigger)
    }
    return elem
  }

  if (typeof fallback === 'function') {
    return fallback()
  }

  return fallback
}

export function getOffset(elem: HTMLElement | null) {
  let left = 0
  let top = 0
  if (elem != null) {
    const docElem = document.documentElement
    const box = elem.getBoundingClientRect()
    left =
      box.left +
      (window.pageXOffset || docElem.scrollLeft) -
      (docElem.clientLeft || 0)
    top =
      box.top +
      (window.pageYOffset || docElem.scrollTop) -
      (docElem.clientTop || 0)
  }
  return { left, top }
}

export function outerWidth(elem: HTMLElement) {
  return elem.offsetWidth || elem.clientWidth
}

export function outerHeight(elem: HTMLElement) {
  return elem.offsetHeight || elem.clientHeight
}

export function isContained(
  container: HTMLElement,
  target: HTMLElement,
  fully?: boolean,
) {
  const offset1 = getOffset(container)
  const offset2 = getOffset(target)

  const cw = outerWidth(container)
  const ch = outerHeight(container)
  const tw = outerWidth(target)
  const th = outerHeight(target)

  if (fully) {
    return (
      offset1.left <= offset2.left &&
      offset1.top <= offset2.top &&
      offset1.left + cw >= offset2.left + tw &&
      offset1.top + ch >= offset2.top + th
    )
  }

  const x1 = Math.max(offset1.left, offset2.left)
  const y1 = Math.max(offset1.top, offset2.top)
  const x2 = Math.min(offset1.left + cw, offset2.left + tw)
  const y2 = Math.min(offset1.top + ch, offset2.top + th)

  return x1 <= x2 && y1 <= y2
}
