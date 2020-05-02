import { getVendorPrefixedName } from './prefix'

export function toPx(px: number) {
  return `${px}px`
}

export function setPrefixedStyle(style: any, name: string, value: string) {
  const vendor = getVendorPrefixedName(name)
  if (vendor != null) {
    style[vendor] = value
  }
  style[name] = value
}

export function getComputedStyle(elem: Element, name?: string) {
  // IE9+
  const computed =
    elem.ownerDocument &&
    elem.ownerDocument.defaultView &&
    elem.ownerDocument.defaultView.opener
      ? elem.ownerDocument.defaultView.getComputedStyle(elem, null)
      : window.getComputedStyle(elem, null)

  if (computed && name) {
    return computed.getPropertyValue(name) || (computed as any)[name]
  }

  return computed
}

export function hasScrollbars(container: HTMLElement) {
  const style = getComputedStyle(container)
  return (
    style != null && (style.overflow === 'scroll' || style.overflow === 'auto')
  )
}

/**
 * Returns the scroll origin of the given document or the current
 * document if no document is given.
 */
export function getDocumentScrollOrigin(doc: Document) {
  const win = (doc.defaultView || (doc as any).parentWindow) as Window
  const root =
    document.documentElement || document.body.parentNode || document.body

  const x =
    win != null && win.pageXOffset !== undefined
      ? win.pageXOffset
      : root.scrollLeft

  const y =
    win != null && win.pageYOffset !== undefined
      ? win.pageYOffset
      : root.scrollTop

  return { x, y }
}

/**
 * Returns the top, left corner of the viewrect.
 */
export function getScrollOrigin(
  node: HTMLElement | null,
  includeAncestors: boolean = false,
  includeDocument: boolean = true,
) {
  const doc = node != null ? node.ownerDocument! : document
  const b = doc.body
  const d = doc.documentElement
  const result = { x: 0, y: 0 }

  let fixed = false
  let elem: HTMLElement | null = node

  while (elem != null && elem !== b && elem !== d) {
    if (!isNaN(elem.scrollLeft) && !isNaN(elem.scrollTop)) {
      result.x += elem.scrollLeft
      result.y += elem.scrollTop
    }

    const style = getComputedStyle(elem)
    if (style != null) {
      fixed = fixed || style.position === 'fixed'
    }

    elem = includeAncestors ? (elem.parentNode as HTMLDivElement) : null
  }

  if (!fixed && includeDocument) {
    const origin = getDocumentScrollOrigin(doc)
    result.x += origin.x
    result.y += origin.y
  }

  return result
}

/**
 * Returns the offset for the specified container as an `Point`.
 * The offset is the distance from the top left corner of the
 * container to the top left corner of the document.
 */
export function getOffset(container: Element, scrollOffset: boolean = false) {
  const b = document.body
  const d = document.documentElement

  let offsetLeft = 0
  let offsetTop = 0

  // Ignores document scroll origin for fixed elements
  let fixed = false
  let elem = container
  while (elem != null && elem !== b && elem !== d && !fixed) {
    const style = getComputedStyle(elem)
    if (style != null) {
      fixed = fixed || style.position === 'fixed'
    }

    elem = elem.parentNode as Element
  }

  if (!scrollOffset && !fixed) {
    const offset = getDocumentScrollOrigin(container.ownerDocument!)
    offsetLeft += offset.x
    offsetTop += offset.y
  }

  const rect = container.getBoundingClientRect()
  if (rect != null) {
    offsetLeft += rect.left
    offsetTop += rect.top
  }

  return { x: offsetLeft, y: offsetTop }
}
