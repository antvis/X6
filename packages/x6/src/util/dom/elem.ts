export function createElement(tagName: string, doc: Document = document) {
  return doc.createElement(tagName)
}

export function createSvgElement(tagName: string, doc: Document = document) {
  return (doc.createElementNS
    ? doc.createElementNS('http://www.w3.org/2000/svg', tagName)
    : createElement(tagName, doc)) as SVGElement
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

export function prepend(parent: Element, child: Element) {
  if (parent.firstChild != null) {
    parent.insertBefore(child, parent.firstChild)
  } else {
    parent.appendChild(child)
  }
}

export function appendText(parent: Element, text: string) {
  const doc = parent.ownerDocument!
  const node = doc.createTextNode(text)
  if (parent != null) {
    parent.appendChild(node)
  }

  return node
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

export function isVisible(elem: HTMLElement | SVGElement | null) {
  return (
    elem != null &&
    elem.style.display !== 'none' &&
    elem.style.visibility !== 'hidden'
  )
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
  attributeValue?: string
) {
  if (
    elem != null &&
    !isNaN(elem.nodeType) &&
    (nodeName == null || elem.nodeName.toLowerCase() === nodeName.toLowerCase())
  ) {
    return (
      attributeName == null ||
      elem.getAttribute(attributeName) === attributeValue
    )
  }

  return false
}

export function isSvgElem(elem: any) {
  return elem != null && (elem as SVGElement).ownerSVGElement != null
}

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

export function getChildNodes(node: HTMLElement, nodeType: number = 1) {
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
