import { NodeType, shapes } from '@antv/x6'

export namespace StencilRegistry {
  const packages: { [url: string]: XMLDocument } = {}

  function loadStencil(url: string) {
    return fetch(url)
      .then((response) => response.text())
      .then((str) => new window.DOMParser().parseFromString(str, 'text/xml'))
  }

  export function loadStencilSet(
    url: string,
    force: boolean = false,
    callback: ParseStencilCallback | null = null,
  ) {
    var xmlDoc = packages[url]
    if (force || xmlDoc == null) {
      let install = false
      if (xmlDoc == null) {
        return loadStencil(url).then((doc) => {
          packages[url] = doc
          install = true
          parseStencilSet(doc.documentElement, install, callback)
        })
      }

      if (xmlDoc != null && xmlDoc.documentElement != null) {
        parseStencilSet(xmlDoc.documentElement, install, callback)
      }
    }

    return Promise.resolve()
  }

  export function parseStencilSets(stencils: string[]) {
    stencils.forEach((stencil) => {
      const parser = new DOMParser()
      const doc = parser.parseFromString(stencil, 'text/xml')
      parseStencilSet(doc.documentElement)
    })
  }

  export type ParseStencilCallback = (
    packageName: string,
    stencilName: string,
    name: string,
    w: number,
    h: number,
  ) => void

  export function getShapeName(packageName: string, stencilName: string) {
    return packageName + stencilName.toLowerCase()
  }

  export function parseStencilSet(
    root: Element,
    install: boolean = true,
    callback: ParseStencilCallback | null = null,
  ) {
    if (root.nodeName == 'stencils') {
      let shapes = root.firstChild as Element
      while (shapes != null) {
        if (shapes.nodeName == 'shapes') {
          parseStencilSet(shapes, install, callback)
        }
        shapes = shapes.nextSibling as Element
      }
    } else {
      let name = root.getAttribute('name')
      let packageName = ''

      if (name != null) {
        packageName = `${name}.`.toLowerCase()
      }

      let shape = root.firstChild as Element
      while (shape != null) {
        if (shape.nodeType === NodeType.element) {
          name = shape.getAttribute('name')
          if (name != null) {
            const stencilName = name.replace(/ /g, '_')
            if (install) {
              shapes.Stencil.addStencil(getShapeName(packageName, stencilName), new shapes.Stencil(shape))
            }

            if (callback != null) {
              const ww = shape.getAttribute('w')
              const hh = shape.getAttribute('h')
              const w = ww == null ? 80 : parseInt(ww, 10)
              const h = hh == null ? 80 : parseInt(hh, 10)
              callback(packageName, stencilName, name, w, h)
            }
          }
        }

        shape = shape.nextSibling as Element
      }
    }
  }
}
