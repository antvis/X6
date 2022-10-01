export function offset(elem: Element) {
  const rect = elem.getBoundingClientRect()
  const win = elem.ownerDocument.defaultView!

  return {
    top: rect.top + win.pageYOffset,
    left: rect.left + win.pageXOffset,
  }
}

export function width(elem: Element) {
  const rect = elem.getBoundingClientRect()
  return rect.width
}

export function height(elem: Element) {
  const rect = elem.getBoundingClientRect()
  return rect.height
}
