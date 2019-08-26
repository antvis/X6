import { Point, Rectangle } from '../struct'
import { detector, constants } from '../common'
import { getBaseUrl } from './bom'
import { ucFirst } from './string'

export function getDocumentMode() {
  return (document as any).documentMode as number
}

export function getNodeName(node: HTMLElement | SVGElement) {
  return node.nodeName.toLowerCase()
}

export function setAttributes(
  elem: HTMLElement | SVGElement,
  attrs: { [key: string]: any },
) {
  if (elem != null) {
    Object.keys(attrs).forEach(name => elem.setAttribute(name, attrs[name]))
  }
}

export function prepend(
  parent: HTMLElement | SVGElement,
  child: HTMLElement | SVGElement,
) {
  if (parent.firstChild != null) {
    parent.insertBefore(child, parent.firstChild)
  } else {
    parent.appendChild(child)
  }
}

export function createXmlDocument() {
  let doc = null
  if (document.implementation && document.implementation.createDocument) {
    doc = document.implementation.createDocument('', '', null)
  } else if ((window as any).ActiveXObject) {
    doc = new (window as any).ActiveXObject('Microsoft.XMLDOM')
  }
  return doc
}

/**
 * Parses the specified XML string into a new XML document and returns the
 * new document.
 */
export const parseXml = (window as any).DOMParser
  ? function (xml: string) {
    const parser = new DOMParser()
    return parser.parseFromString(xml, 'text/xml')
  }
  : function (xml: string) {
    const result = createXmlDocument()
    result.async = false
    result.validateOnParse = false
    result.resolveExternals = false
    result.loadXML(xml)
    return result
  }

/**
 * Creates a text node for the given string and appends it
 * to the given parent. Returns the text node.
 *
 * @param elem DOM node to append the text node to.
 * @param text String representing the text to be added.
 */
export function fillElementWithText(elem: Element, text: string) {
  const doc = elem.ownerDocument!
  const node = doc.createTextNode(text)
  if (elem != null) {
    elem.appendChild(node)
  }

  return node
}

/**
 * Returns true if the given value is an XML node with the node name
 * and if the optional attribute has the specified value.
 *
 * @param elem Object that should be examined as a node.
 * @param nodeName String that specifies the node name.
 * @param attributeName Optional attribute name to check.
 * @param attributeValue Optional attribute value to check.
 */
export function isHTMLNode(
  elem: any,
  nodeName?: string,
  attributeName?: string,
  attributeValue?: string,
) {
  if (
    elem != null && !isNaN(elem.nodeType) &&
    (
      nodeName == null ||
      elem.nodeName.toLowerCase() === nodeName.toLowerCase()
    )
  ) {
    return (
      attributeName == null ||
      elem.getAttribute(attributeName) === attributeValue
    )
  }

  return false
}

/**
* Returns true if the given ancestor is an ancestor of the
* given DOM node in the DOM. This also returns true if the
* child is the ancestor.
*
* @param ancestor DOM node that represents the ancestor.
* @param child DOM node that represents the child.
*/
export function isAncestorNode(ancestor: HTMLElement, child: HTMLElement) {
  let parent = child
  while (parent != null) {
    if (parent === ancestor) {
      return true
    }
    parent = parent.parentNode as HTMLElement
  }

  return false
}

export function getChildNodes(
  node: HTMLElement,
  nodeType: number = 1,
) {
  const children = []
  let tmp = node.firstChild
  while (tmp != null) {
    if (tmp.nodeType === nodeType) {
      children.push(tmp)
    }

    tmp = tmp.nextSibling
  }

  return children
}

export function getCurrentStyle(elem: HTMLElement, name?: string) {
  // IE9+
  const computed = (
    elem.ownerDocument &&
    elem.ownerDocument.defaultView &&
    elem.ownerDocument.defaultView.opener
  )
    ? elem.ownerDocument.defaultView.getComputedStyle(elem, null)
    : window.getComputedStyle(elem, null)

  if (computed && name) {
    return computed.getPropertyValue(name) || (computed as any)[name]
  }

  return computed
}

export function parseCssNumber(value: string) {
  if (value === 'thin') {
    return 2
  }

  if (value === 'medium') {
    return 4
  }

  if (value === 'thick') {
    return 6
  }

  const ret = parseFloat(value)
  return isNaN(ret) ? 0 : ret

}

/**
 * Returns the scroll origin of the given document or the current document
 * if no document is given.
 */
export function getDocumentScrollOrigin(doc: Document) {
  if (detector.IS_QUIRKS) {
    return new Point(doc.body.scrollLeft, doc.body.scrollTop)
  }

  const win = (doc.defaultView || (doc as any).parentWindow) as Window
  const root = document.documentElement || document.body.parentNode || document.body

  const x = (win != null && win.pageXOffset !== undefined)
    ? win.pageXOffset
    : root.scrollLeft

  const y = (win != null && win.pageYOffset !== undefined)
    ? win.pageYOffset
    : root.scrollTop

  return new Point(x, y)
}

/**
 * Returns the top, left corner of the viewrect as an <mxPoint>.
 *
 * Parameters:
 *
 * node - DOM node whose scroll origin should be returned.
 * includeAncestors - Whether the scroll origin of the ancestors should be
 * included. Default is false.
 * includeDocument - Whether the scroll origin of the document should be
 * included. Default is true.
 */
export function getScrollOrigin(
  node: HTMLElement,
  includeAncestors: boolean = false,
  includeDocument: boolean = true,
) {
  const doc = (node != null) ? node.ownerDocument! : document
  const b = doc.body
  const d = doc.documentElement
  const result = new Point()

  let fixed = false
  let elem: HTMLElement | null = node

  while (elem != null && elem !== b && elem !== d) {
    if (!isNaN(elem.scrollLeft) && !isNaN(elem.scrollTop)) {
      result.x += elem.scrollLeft
      result.y += elem.scrollTop
    }

    const style = getCurrentStyle(elem)
    if (style != null) {
      fixed = fixed || style.position === 'fixed'
    }

    // tslint:disable-next-line
    elem = (includeAncestors) ? elem.parentNode as HTMLDivElement : null
  }

  if (!fixed && includeDocument) {
    const origin = getDocumentScrollOrigin(doc)
    result.x += origin.x
    result.y += origin.y
  }

  return result
}

/**
 * Returns the offset for the specified container as an `Point`. The
 * offset is the distance from the top left corner of the container to the
 * top left corner of the document.
 */
export function getOffset(
  container: HTMLElement,
  scrollOffset: boolean = false,
) {
  let offsetLeft = 0
  let offsetTop = 0

  // Ignores document scroll origin for fixed elements
  let fixed = false
  let elem = container
  const b = document.body
  const d = document.documentElement

  while (elem != null && elem !== b && elem !== d && !fixed) {
    const style = getCurrentStyle(elem)
    if (style != null) {
      fixed = fixed || style.position === 'fixed'
    }

    elem = elem.parentNode as HTMLDivElement
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

  return new Point(offsetLeft, offsetTop)
}

export function getTextContent(elem: HTMLElement) {
  if (elem != null) {
    // Only IE10-
    if (detector.IS_IE && elem.innerText !== undefined) {
      return elem.innerText
    }

    return elem.textContent || (elem as any).text
  }

  return ''
}

export function evalString(exp: string) {
  let result = null

  if (exp.indexOf('function') >= 0) {
    try {
      eval('var __EvalFunctionResult__=' + exp) // tslint:disable-line
      result = (window as any).__EvalFunctionResult__
      delete (window as any).__EvalFunctionResult__
    } catch (e) { }
  } else {
    try {
      result = eval(exp) // tslint:disable-line
    } catch (e) { }
  }

  return result
}

export function setAttributeWithAnchor(
  elem: SVGElement,
  attrName: string,
  id: string,
) {
  if (
    !detector.IS_CHROME_APP &&
    !detector.IS_IE &&
    !detector.IS_IE11 &&
    !detector.IS_EDGE &&
    this.root.ownerDocument === document
  ) {
    const base = getBaseUrl().replace(/([\(\)])/g, '\\$1')
    elem.setAttribute(attrName, `url(${base}#${id})`)
  } else {
    elem.setAttribute(attrName, `url(#${id})`)
  }
}

export const setPrefixedStyle = function () {
  let prefix: string | null = null

  if (detector.IS_OT) {
    prefix = 'O'
  } else if (detector.IS_SAFARI || detector.IS_CHROME) {
    prefix = 'Webkit'
  } else if (detector.IS_MT) {
    prefix = 'Moz'
  } else if (
    detector.IS_IE &&
    (document as any).documentMode >= 9 &&
    (document as any).documentMode < 10
  ) {
    prefix = 'ms'
  }

  return function (style: any, name: string, value: string) {
    style[name] = value
    if (prefix != null && name.length > 0) {
      const prefixedName = prefix + ucFirst(name)
      style[prefixedName] = value
    }
  }
}()

export function hasScrollbars(container: HTMLElement) {
  const style = getCurrentStyle(container)
  return style != null && (
    style.overflow === 'scroll' ||
    style.overflow === 'auto'
  )
}

export function getSizeForString(
  text: string,
  fontSize: number = constants.DEFAULT_FONTSIZE,
  fontFamily: string = constants.DEFAULT_FONTFAMILY,
  textWidth?: number,
) {
  const div = document.createElement('div')

  div.style.fontFamily = fontFamily
  div.style.fontSize = `${Math.round(fontSize)}px`
  div.style.lineHeight = `${Math.round(fontSize * constants.LINE_HEIGHT)}`

  // Disables block layout and outside wrapping and hides the div
  div.style.position = 'absolute'
  div.style.visibility = 'hidden'
  div.style.display = (detector.IS_QUIRKS) ? 'inline' : 'inline-block'
  div.style.zoom = '1'

  if (textWidth != null) {
    div.style.width = `${textWidth}px`
    div.style.whiteSpace = 'normal'
  } else {
    div.style.whiteSpace = 'nowrap'
  }

  // Adds the text and inserts into DOM for updating of size
  div.innerHTML = text
  document.body.appendChild(div)

  // Gets the size and removes from DOM
  const size = new Rectangle(0, 0, div.offsetWidth, div.offsetHeight)
  document.body.removeChild(div)

  return size
}

export function toPx(px: number) {
  return `${px}px`
}
