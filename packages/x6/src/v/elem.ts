import { toNode } from './ctor'
import { hasClass } from './class'
import { Vectorizer } from './vectorizer'

export const ns = {
  svg: 'http://www.w3.org/2000/svg',
  xmlns: 'http://www.w3.org/2000/xmlns/',
  xml: 'http://www.w3.org/XML/1998/namespace',
  xlink: 'http://www.w3.org/1999/xlink',
  xhtml: 'http://www.w3.org/1999/xhtml',
}

export const svgVersion = '1.1'

export function createElement(tagName: string, doc: Document = document) {
  return doc.createElement(tagName)
}

export function createSvgElement(tagName: string, doc: Document = document) {
  return (doc.createElementNS
    ? doc.createElementNS(ns.svg, tagName)
    : createElement(tagName, doc)) as SVGElement
}

export function createSvgDocument(content?: string) {
  if (content) {
    const xml = `<svg xmlns="${ns.svg}" xmlns:xlink="${ns.xlink}" version="${svgVersion}">${content}</svg>`
    const { documentElement } = parseXML(xml, { async: false })
    return (documentElement as any) as SVGSVGElement
  }

  const svg = document.createElementNS(ns.svg, 'svg')
  svg.setAttributeNS(ns.xmlns, 'xmlns:xlink', ns.xlink)
  svg.setAttribute('version', svgVersion)
  return svg as SVGSVGElement
}

export function parseXML(data: string, options: { async?: boolean } = {}) {
  let xml

  try {
    const parser = new DOMParser()
    if (options.async != null) {
      const tmp = parser as any
      tmp.async = options.async
    }
    xml = parser.parseFromString(data, 'text/xml')
  } catch (error) {
    xml = undefined
  }

  if (!xml || xml.getElementsByTagName('parsererror').length) {
    throw new Error(`Invalid XML: ${data}`)
  }

  return xml
}

export function tagName(node: Element, lowercase: boolean = true) {
  const nodeName = node.nodeName
  return lowercase ? nodeName.toLowerCase() : nodeName.toUpperCase()
}

export function index(elem: Element) {
  let index = 0
  let node = elem.previousSibling
  while (node) {
    if (node.nodeType === 1) {
      index += 1
    }
    node = node.previousSibling
  }
  return index
}

export function find(elem: Element, selector: string) {
  return elem.querySelectorAll(selector)
}

export function findOne(elem: Element, selector: string) {
  return elem.querySelector(selector)
}

export function findParentByClass(
  elem: Element,
  className: string,
  terminator?: Element,
) {
  const ownerSVGElement = (elem as SVGElement).ownerSVGElement
  let node = elem.parentNode
  while (node && node !== terminator && node !== ownerSVGElement) {
    if (hasClass(node as Element, className)) {
      return node
    }
    node = node.parentNode
  }

  return null
}

export function contains(elem: Element, child: Element | Vectorizer) {
  const a = elem
  const b = toNode(child)
  const bup = b && b.parentNode

  return (
    a === bup ||
    !!(bup && bup.nodeType === 1 && a.compareDocumentPosition(bup) & 16)
  )
}

export function remove(elem: SVGElement | HTMLElement) {
  if (elem.parentNode) {
    elem.parentNode.removeChild(elem)
  }
}

export function empty(elem: SVGElement | HTMLElement) {
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild)
  }
}

export function append(
  elem: SVGElement | HTMLElement,
  elems:
    | SVGElement
    | HTMLElement
    | Vectorizer
    | (SVGElement | Vectorizer | HTMLElement)[],
) {
  const arr = Array.isArray(elems) ? elems : [elems]
  arr.forEach(node => {
    const el = toNode(node)
    if (el != null) {
      elem.appendChild(el)
    }
  })
}

export function prepend(
  elem: SVGElement | HTMLElement,
  elems:
    | SVGElement
    | HTMLElement
    | Vectorizer
    | (SVGElement | Vectorizer | HTMLElement)[],
) {
  const child = elem.firstChild
  return child ? before(child as HTMLElement, elems) : append(elem, elems)
}

export function before(
  elem: SVGElement | HTMLElement,
  elems:
    | SVGElement
    | HTMLElement
    | Vectorizer
    | (SVGElement | Vectorizer | HTMLElement)[],
) {
  const parent = elem.parentNode
  if (parent) {
    const arr = Array.isArray(elems) ? elems : [elems]
    arr.forEach(node => {
      const el = toNode(node)
      if (el != null) {
        parent.insertBefore(el, elem)
      }
    })
  }
}

export function appendTo(
  elem: SVGElement | HTMLElement,
  target: SVGElement | HTMLElement | Vectorizer,
) {
  const ref = toNode(target)
  if (ref != null) {
    ref.appendChild(elem)
  }
}
