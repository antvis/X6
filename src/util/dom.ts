import { Point, Rectangle } from '../struct'
import { detector, constants } from '../common'
import { getBaseUrl } from './bom'
import { ucFirst } from './string'

const rclass = /[\t\r\n\f]/g
const rnotwhite = (/\S+/g)

const fillSpaces = (str: string) => ` ${str} `

export function getClassName(elem: Element) {
  return elem && elem.getAttribute && elem.getAttribute('class') || ''
}

export function hasClass(elem: Element | null, selector: string | null) {
  if (elem == null || selector == null) {
    return false
  }

  const classNames = fillSpaces(getClassName(elem))
  const className = fillSpaces(selector)

  return elem.nodeType === 1
    ? classNames.replace(rclass, ' ').includes(className)
    : false
}

export function addClass(
  elem: Element | null,
  selector: ((cls: string) => string) | string | null,
): void {
  if (elem == null || selector == null) {
    return
  }

  if (typeof selector === 'function') {
    return addClass(elem, selector(getClassName(elem)))
  }

  if (typeof selector === 'string' && elem.nodeType === 1) {
    const classes = selector.match(rnotwhite) || []
    const oldValue = fillSpaces(getClassName(elem)).replace(rclass, ' ')
    let newValue = classes.reduce(
      (memo, cls) => {
        if (memo.indexOf(fillSpaces(cls)) < 0) {
          return `${memo}${cls} `
        }
        return memo
      },
      oldValue,
    )

    newValue = newValue.trim()

    if (oldValue !== newValue) {
      elem.setAttribute('class', newValue)
    }
  }
}

export function removeClass(
  elem: Element | null,
  selector: ((cls: string) => string) | string | null,
): void {
  if (elem == null) {
    return
  }

  if (typeof selector === 'function') {
    return removeClass(elem, selector(getClassName(elem)))
  }

  if ((!selector || typeof selector === 'string') && elem.nodeType === 1) {
    const classes = (selector || '').match(rnotwhite) || []
    const oldValue = fillSpaces(getClassName(elem)).replace(rclass, ' ')
    let newValue = classes.reduce(
      (memo, cls) => {
        const className = fillSpaces(cls)
        if (memo.indexOf(className) > -1) {
          return memo.replace(className, ' ')
        }

        return memo

      },
      oldValue,
    )

    newValue = selector ? newValue.trim() : ''

    if (oldValue !== newValue) {
      elem.setAttribute('class', newValue)
    }
  }
}

export function toggleClass(
  elem: Element | null,
  selector: ((cls: string, state?: boolean) => string) | string | null,
  stateVal?: boolean,
): void {
  if (elem == null || selector == null) {
    return
  }

  if (stateVal != null && typeof selector === 'string') {
    stateVal
      ? addClass(elem, selector)
      : removeClass(elem, selector)

    return
  }

  if (typeof selector === 'function') {
    return toggleClass(elem, selector(getClassName(elem), stateVal), stateVal)
  }

  if (typeof selector === 'string') {
    (selector.match(rnotwhite) || []).forEach((cls) => {
      hasClass(elem, cls)
        ? removeClass(elem, cls)
        : addClass(elem, cls)
    })
  }
}

export function getDocumentMode() {
  return (document as any).documentMode as number
}

export function getNodeName(node: Element, lowercase: boolean = true) {
  const nodeName = node.nodeName
  return lowercase
    ? nodeName.toLowerCase()
    : nodeName.toUpperCase()
}

export function setAttributes(
  elem: Element | null,
  attrs: { [key: string]: any },
) {
  if (elem != null) {
    Object.keys(attrs).forEach(name => elem.setAttribute(name, attrs[name]))
  }
}

export function createElement(tagName: string, doc: Document = document) {
  return doc.createElement(tagName)
}

export function createSvgElement(tagName: string, doc: Document = document) {
  return (doc.createElementNS
    ? doc.createElementNS('http://www.w3.org/2000/svg', tagName)
    : createElement(tagName, doc)
  ) as SVGElement
}

export function removeElement(elem: Element | null) {
  if (elem && elem.parentNode) {
    elem.parentNode.removeChild(elem)
  }
}

export function emptyElement(elem: Element | null) {
  if (elem != null) {
    while (elem.firstChild) {
      elem.removeChild(elem.firstChild)
    }
  }
}

export function isHiddenElement(elem: HTMLElement | SVGElement | null) {
  if (elem) {
    return elem.style.display === 'none'
  }
  return false
}

export function hideElement(elem: HTMLElement | SVGElement | null) {
  if (elem) {
    elem.style.display = 'none'
  }
}

export function showElement(elem: HTMLElement | SVGElement | null) {
  if (elem) {
    elem.style.display = ''
  }
}

export function prepend(parent: Element, child: Element) {
  if (parent.firstChild != null) {
    parent.insertBefore(child, parent.firstChild)
  } else {
    parent.appendChild(child)
  }
}

export function toBack(elem: Element | null) {
  if (elem && elem.parentNode && elem.parentNode.firstChild !== elem) {
    elem.parentNode.insertBefore(elem, elem.parentNode.firstChild)
  }
}

export function toFront(elem: Element | null) {
  if (elem && elem.parentNode) {
    elem.parentNode.appendChild(elem)
  }
}

export function isVisible(elem: HTMLElement | SVGElement | null) {
  return (
    elem != null &&
    elem.style.display !== 'none' &&
    elem.style.visibility !== 'hidden'
  )
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
export function isHtmlElem(
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

export function isSvgElem(elem: any) {
  return (
    elem != null &&
    (elem as SVGElement).ownerSVGElement != null
  )
}

/**
* Returns true if the given ancestor is an ancestor of the
* given DOM node in the DOM. This also returns true if the
* child is the ancestor.
*
* @param ancestor DOM node that represents the ancestor.
* @param child DOM node that represents the child.
*/
export function isAncestorNode(ancestor: Element, child: Element) {
  let parent = child
  while (parent != null) {
    if (parent === ancestor) {
      return true
    }
    parent = parent.parentNode as Element
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

export function getCurrentStyle(elem: Element, name?: string) {
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
 * offset is the distance from the top left corner of the container
 * to the top left corner of the document.
 */
export function getOffset(
  container: Element,
  scrollOffset: boolean = false,
) {

  const b = document.body
  const d = document.documentElement

  let offsetLeft = 0
  let offsetTop = 0

  // Ignores document scroll origin for fixed elements
  let fixed = false
  let elem = container
  while (elem != null && elem !== b && elem !== d && !fixed) {
    const style = getCurrentStyle(elem)
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

const evalKey = '__EvalFunctionResult__'
export function evalString(exp: string) {
  let result = null

  if (exp.indexOf('function') >= 0) {
    try {
      const tmp = (window as any)[evalKey]
      eval(`var ${evalKey}=${exp}`) // tslint:disable-line:no-eval
      result = (window as any)[evalKey]
      if (tmp != null) {
        (window as any)[evalKey] = tmp
      } else {
        delete (window as any)[evalKey]
      }
    } catch (e) { }
  } else {
    try {
      result = eval(exp) // tslint:disable-line:no-eval
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
    elem.ownerDocument === document
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

export function getDocumentSize() {
  const b = document.body
  const d = document.documentElement

  try {
    return new Rectangle(
      0,
      0,
      b.clientWidth || d.clientWidth,
      Math.max(b.clientHeight || 0, d.clientHeight),
    )
  } catch (e) {
    return new Rectangle()
  }
}

export const clearSelection = function () {
  if ((document as any).selection) {
    return function () {
      (document as any).selection.empty()
    }
  }

  if (window.getSelection) {
    return function () {
      const selection = window.getSelection()
      if (selection) {
        if (selection.empty) {
          selection.empty()
        } else if (selection.removeAllRanges) {
          selection.removeAllRanges()
        }
      }
    }
  }

  return function () { }
}()

export function extractTextWithWhitespace(elems: Element[]) {
  const blocks = [
    'BLOCKQUOTE', 'DIV',
    'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
    'OL', 'P', 'PRE', 'TABLE', 'UL',
  ]
  const ret: string[] = []

  function doExtract(elts: Element[]) {
    // Single break should be ignored
    if (
      elts.length === 1 &&
      (getNodeName(elts[0]) === 'br' || elts[0].innerHTML === '\n')
    ) {
      return
    }

    for (let i = 0, ii = elts.length; i < ii; i += 1) {
      const elem = elts[i]
      const nodeName = getNodeName(elem).toUpperCase()

      // DIV with a br or linefeed forces a linefeed
      if (
        nodeName === 'BR' ||
        elem.innerHTML === '\n' ||
        (
          (elts.length === 1 || i === 0) &&
          (nodeName === 'DIV' && elem.innerHTML.toLowerCase() === '<br>')
        )
      ) {
        ret.push('\n')
      } else {
        if (elem.nodeType === 3 || elem.nodeType === 4) {
          if (elem.nodeValue != null && elem.nodeValue.length > 0) {
            ret.push(elem.nodeValue)
          }
        } else if (elem.nodeType !== 8 && elem.childNodes.length > 0) {
          doExtract(elem.childNodes as any)
        }

        if (
          i < elts.length - 1 &&
          blocks.includes(getNodeName(elts[i + 1]).toUpperCase())
        ) {
          ret.push('\n')
        }
      }
    }
  }

  doExtract(elems)

  return ret.join('')
}
