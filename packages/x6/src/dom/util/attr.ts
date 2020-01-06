import { Platform, Url } from '../../util'

export function setAttributes(
  elem: Element | null,
  attrs: { [key: string]: string | number },
) {
  if (elem != null) {
    Object.keys(attrs).forEach(name => {
      const value = attrs[name]
      const attr = typeof value === 'string' ? value : `${value}`
      elem.setAttribute(name, attr)
    })
  }
}

export function setAttributeWithAnchor(
  elem: SVGElement,
  attrName: string,
  id: string,
) {
  if (
    !Platform.IS_IE &&
    !Platform.IS_IE11 &&
    !Platform.IS_EDGE &&
    !Platform.IS_CHROME_APP &&
    elem.ownerDocument === document
  ) {
    const base = Url.getUrlWithoutHash().replace(/([\\()])/g, '\\$1')
    elem.setAttribute(attrName, `url(${base}#${id})`)
  } else {
    elem.setAttribute(attrName, `url(#${id})`)
  }
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

export function getTextContent(elem: HTMLElement): string {
  if (elem != null) {
    // Only IE10-
    if (Platform.IS_IE && elem.innerText !== undefined) {
      return elem.innerText
    }

    return elem.textContent || (elem as any).text || ''
  }

  return ''
}
