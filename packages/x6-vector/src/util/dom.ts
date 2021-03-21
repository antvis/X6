import { Box } from '../struct/box'
import { Global } from '../global'

export namespace DomUtil {
  export const namespaces = {
    svg: 'http://www.w3.org/2000/svg',
    html: 'http://www.w3.org/1999/xhtml',
    xmlns: 'http://www.w3.org/2000/xmlns/',
    xlink: 'http://www.w3.org/1999/xlink',
  }

  export function createNode<TElement extends Element = Element>(
    name: string,
    ns = namespaces.svg,
  ): TElement {
    return Global.document.createElementNS(ns, name) as TElement
  }

  export function ensureNode<TElement extends Element = Element>(
    name: string,
    node?: any,
  ): TElement {
    return isNode(node) ? (node as TElement) : createNode<TElement>(name)
  }
}

export namespace DomUtil {
  let seed = 0

  export function createNodeId() {
    seed += 1
    return `vector${seed}`
  }

  export function assignNewId(node: Node, deep = true) {
    const elem = toElement(node)

    if (deep) {
      const children = elem.children || elem.childNodes
      for (let i = children.length - 1; i >= 0; i -= 1) {
        assignNewId(children[i], true)
      }
    }

    if (elem.id) {
      elem.id = createNodeId()
    }

    return node
  }
}

export namespace DomUtil {
  export function toElement<TElement extends Element = Element>(node: Node) {
    return (node as any) as TElement
  }

  export function isIE() {
    return (Global.document as any).documentMode != null
  }

  export function isNode(node: any): node is Node {
    return node != null && node instanceof Global.window.Node
  }

  export function isWindow(obj: any): obj is Window {
    return obj != null && obj === obj.window
  }

  export function isDocument(node: any): node is Document {
    return node != null && node === Global.document
  }

  export function isSVGSVGElement(node: any) {
    return node != null && node instanceof Global.window.SVGSVGElement
  }

  export function isDocumentFragment(node: any) {
    return isNode(node) && node.nodeName === '#document-fragment'
  }

  export function isNodeName(elem: Element, name: string) {
    return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase()
  }

  export function contains(a: Node, b: Node) {
    const adown = a.nodeType === 9 ? (a as any).documentElement : a
    const bup = b && b.parentNode

    return (
      a === bup ||
      !!(
        bup &&
        bup.nodeType === 1 &&
        // Support: IE 9 - 11+
        // IE doesn't have `contains` on SVG.
        (adown.contains
          ? adown.contains(bup)
          : // eslint-disable-next-line no-bitwise
            a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16)
      )
    )
  }

  const documentElement = Global.document.documentElement

  export const isAttached =
    documentElement.getRootNode != null
      ? (elem: Element) =>
          contains(elem.ownerDocument, elem) ||
          elem.getRootNode({ composed: true }) === elem.ownerDocument
      : (elem: Element) => contains(elem.ownerDocument, elem)
}

export namespace DomUtil {
  export function addEventListener(
    elem: Element,
    type: string,
    handler: EventListener,
  ) {
    if (elem.addEventListener != null) {
      elem.addEventListener(type, handler as any)
    }
  }

  export function removeEventListener(
    elem: Element,
    type: string,
    handler: EventListener,
  ) {
    if (elem.removeEventListener != null) {
      elem.removeEventListener(type, handler as any)
    }
  }
}

export namespace DomUtil {
  export function getComputedStyle(elem: Element) {
    const view = elem.ownerDocument.defaultView || Global.window
    return view.getComputedStyle(elem)
  }

  export function getBox(
    elem: SVGGraphicsElement,
    getBBox: (elem: SVGGraphicsElement) => DOMRect,
    retry: (elem: SVGGraphicsElement) => DOMRect,
  ) {
    let box
    try {
      box = getBBox(elem)
      if (Box.isNull(box) && !DomUtil.isAttached(elem)) {
        throw new Error('Element not in the dom')
      }
    } catch {
      box = retry(elem)
    }

    return box
  }
}

export namespace DomUtil {
  export function withSvgContext<T>(callback: (svg: SVGSVGElement) => T) {
    const svg = createNode<SVGSVGElement>('svg')

    svg.setAttribute('width', '2')
    svg.setAttribute('height', '0')
    svg.setAttribute('focusable', 'false')
    svg.setAttribute('aria-hidden', 'true')

    const style = svg.style
    style.opacity = '0'
    style.position = 'absolute'
    style.left = '-100%'
    style.top = '-100%'
    style.overflow = 'hidden'

    const wrap = Global.document.body || Global.document.documentElement
    wrap.appendChild(svg)
    const ret = callback(svg)
    wrap.removeChild(svg)
    return ret
  }

  export function withPathContect<T>(callback: (path: SVGPathElement) => T) {
    return withSvgContext<T>((svg) => {
      const path = createNode<SVGPathElement>('path')
      svg.appendChild(path)
      return callback(path)
    })
  }
}
