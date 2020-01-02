import { detector } from '@antv/x6-detector'
import { getUrlWithoutHash } from '../url'

export function setAttributes(
  elem: Element | null,
  attrs: { [key: string]: any },
) {
  if (elem != null) {
    Object.keys(attrs).forEach(name => elem.setAttribute(name, attrs[name]))
  }
}

export function setAttributeWithAnchor(
  elem: SVGElement,
  attrName: string,
  id: string,
) {
  if (
    !detector.IS_IE &&
    !detector.IS_IE11 &&
    !detector.IS_EDGE &&
    !detector.IS_CHROME_APP &&
    elem.ownerDocument === document
  ) {
    const base = getUrlWithoutHash().replace(/([\\()])/g, '\\$1')
    elem.setAttribute(attrName, `url(${base}#${id})`)
  } else {
    elem.setAttribute(attrName, `url(#${id})`)
  }
}

export function getDocumentMode() {
  return (document as any).documentMode as number
}

export function getNodeName(node: Element, lowercase: boolean = true) {
  const nodeName = node.nodeName
  return lowercase ? nodeName.toLowerCase() : nodeName.toUpperCase()
}

export function getOwnerSVG(elem: SVGElement) {
  if (elem != null) {
    let result = elem
    while (result != null && getNodeName(elem) !== 'svg') {
      result = result.parentNode as SVGElement
    }
    return result as SVGSVGElement
  }
  return null
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
