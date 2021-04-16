import { Global } from '../../global'
import { namespaces } from '../../util'
import { Adopter } from '../../dom/common/adopter'
import { Container } from '../container/container'
import { Viewbox } from '../container/viewbox'
import { Defs } from '../defs/defs'
import { SVGSVGAttributes } from './types'

@Svg.mixin(Viewbox)
@Svg.register('Svg')
export class Svg extends Container<SVGSVGElement> {
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

    return this.attr({ xmlns: namespaces.svg, version: '1.1' }).attr(
      'xmlns:xlink',
      namespaces.xlink,
    )
  }

  removeNamespace() {
    return this.attr({ xmlns: null, version: null }).attr('xmlns:xlink', null)
  }
}

export interface Svg extends Viewbox<SVGSVGElement> {}

export namespace Svg {
  export function create<Attributes extends SVGSVGAttributes>(
    attrs?: Attributes | null,
  ) {
    const svg = new Svg()
    if (attrs) {
      svg.attr(attrs)
    }
    return svg
  }
}
