import { Attributes } from './attr'
import { Vectorizer } from './vectorizer'
import { createSvgDocument } from './elem'

let idCounter = 0
export function uniqueId() {
  idCounter += 1
  return `v${idCounter}`
}

export function ensureId(elem: Element | Vectorizer) {
  const node = toNode(elem)!
  if (node.id == null) {
    node.id = uniqueId()
  }
  return node.id
}

export function toNode(elem: any) {
  if (elem != null) {
    if (isVectorizer(elem)) {
      return elem.node
    }
    return ((elem.nodeName && elem) || elem[0]) as SVGElement
  }
  return null
}

export function create(
  elem: Vectorizer | SVGElement | string,
  attrs?: Attributes,
  children?: Element | Vectorizer | (Element | Vectorizer)[],
) {
  return new Vectorizer(elem, attrs, children)
}

export function batch(markup: string) {
  if (markup[0] === '<') {
    const svgDoc = createSvgDocument(markup)
    const vels: Vectorizer[] = []
    for (let i = 0, ii = svgDoc.childNodes.length; i < ii; i += 1) {
      const childNode = svgDoc.childNodes[i]!
      vels.push(create(document.importNode(childNode, true) as SVGElement))
    }

    return vels
  }

  return [create(markup)]
}

export function isVectorizer(o: any): o is Vectorizer {
  return o instanceof Vectorizer
}

/**
 * Returns true if object is an instance of SVGGraphicsElement.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGGraphicsElement
 */
export function isSVGGraphicsElement(
  elem?: any | null,
): elem is SVGGraphicsElement {
  if (elem == null) {
    return false
  }

  const node = toNode(elem) as any
  return typeof node.getScreenCTM === 'function' && node instanceof SVGElement
}
