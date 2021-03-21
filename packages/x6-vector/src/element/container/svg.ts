import { Attrs } from '../../types'
import { DomUtil } from '../../util/dom'
import { Global } from '../../global'
import { Adopter } from '../adopter'
import { Container } from './container'
import { Viewbox } from './container-viewbox'
import { Defs } from './defs'

@Svg.mixin(Viewbox)
@Svg.register('Svg', true)
export class Svg extends Container<SVGSVGElement> {
  constructor()
  constructor(attrs: Attrs | null)
  constructor(node: SVGSVGElement | null, attrs?: Attrs | null)
  constructor(node?: SVGSVGElement | Attrs | null, attrs?: Attrs | null) {
    super(DomUtil.ensureNode<SVGSVGElement>('svg', node), attrs)
    this.namespace()
  }

  isRoot() {
    const parentNode = this.node.parentNode
    return (
      !parentNode ||
      (!(parentNode instanceof Global.window.SVGElement) &&
        parentNode.nodeName !== '#document-fragment')
    )
  }

  root() {
    return this.isRoot() ? this : super.root()
  }

  defs(): Defs {
    if (!this.isRoot()) {
      const root = this.root()
      if (root) {
        return root.defs()
      }
    }

    const defs = this.node.querySelector('defs')
    if (defs) {
      return Adopter.adopt<Defs>(defs)
    }

    return this.put(new Defs())
  }

  namespace() {
    if (!this.isRoot()) {
      const root = this.root()
      if (root) {
        root.namespace()
        return this
      }
    }

    return this.attr({ xmlns: DomUtil.namespaces.svg, version: '1.1' }).attr(
      'xmlns:xlink',
      DomUtil.namespaces.xlink,
      DomUtil.namespaces.xmlns,
    )
  }

  removeNamespace() {
    return this.attr({ xmlns: null, version: null }).attr(
      'xmlns:xlink',
      null,
      DomUtil.namespaces.xmlns,
    )
  }
}

export interface Svg extends Viewbox<SVGSVGElement> {}

export namespace Svg {
  export function create(attrs?: Attrs | null) {
    const svg = new Svg()
    if (attrs) {
      svg.attr(attrs)
    }
    return svg
  }
}
