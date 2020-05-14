import { Attr } from './index'

export const title: Attr.Definition = {
  qualify(title, { elem }) {
    // HTMLElement title is specified via an attribute (i.e. not an element)
    return elem instanceof SVGElement
  },
  set(val, { view, elem }) {
    const cacheName = 'x6-title'
    const title = `${val}`
    const $elem = view.$(elem)
    const cache = $elem.data(cacheName)
    if (cache == null || cache !== title) {
      $elem.data(cacheName, title)
      // Generally SVGTitleElement should be the first child
      // element of its parent.
      const firstChild = elem.firstChild as Element
      if (firstChild && firstChild.tagName.toUpperCase() === 'TITLE') {
        // Update an existing title
        const titleElem = firstChild as SVGTitleElement
        titleElem.textContent = title
      } else {
        // Create a new title
        const titleNode = document.createElementNS(
          elem.namespaceURI,
          'title',
        ) as SVGTitleElement
        titleNode.textContent = title
        elem.insertBefore(titleNode, firstChild)
      }
    }
  },
}
