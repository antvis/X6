import { Global } from '../global'

export const namespaces = {
  svg: 'http://www.w3.org/2000/svg',
  html: 'http://www.w3.org/1999/xhtml',
  xmlns: 'http://www.w3.org/2000/xmlns/',
  xlink: 'http://www.w3.org/1999/xlink',
}

export function createNode<TElement extends Element = Element>(
  tagName: string,
  ns: string,
): TElement {
  return Global.document.createElementNS(ns, tagName) as TElement
}

export function createHTMLNode<TElement extends HTMLElement = HTMLElement>(
  tagName: string,
) {
  return createNode<TElement>(tagName, namespaces.html)
}

export function createSVGNode<TElement extends SVGElement = SVGElement>(
  tagName: string,
) {
  return createNode<TElement>(tagName, namespaces.svg)
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

export function isAncestorOf(a: Node, b: Node) {
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

export const isInDocument =
  Global.document.documentElement.getRootNode != null
    ? (elem: Element) =>
        isAncestorOf(elem.ownerDocument, elem) ||
        elem.getRootNode({ composed: true }) === elem.ownerDocument
    : (elem: Element) => isAncestorOf(elem.ownerDocument, elem)
