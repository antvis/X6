import { Dom } from '../util'

export class GridCache {
  root: Element
  patterns: { [id: string]: Element }

  constructor() {
    this.patterns = {}
    this.root = Dom.createVector(
      Dom.createSvgDocument(),
      {
        width: '100%',
        height: '100%',
      },
      [Dom.createSvgElement('defs')],
    ).node
  }

  add(id: string, elem: Element) {
    const firstChild = this.root.childNodes[0]
    if (firstChild) {
      firstChild.appendChild(elem)
    }

    this.patterns[id] = elem
    this.root.append(
      Dom.createVector('rect', {
        width: '100%',
        height: '100%',
        fill: `url(#'${id}')`,
      }).node,
    )
  }

  get(id: string) {
    return this.patterns[id]
  }

  has(id: string) {
    return this.patterns[id] != null
  }
}
