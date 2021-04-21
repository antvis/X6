import { Base } from '../common/base'
import { A } from './a'
import { SVGAAttributes } from './types'

export class ContainerExtension<
  TSVGElement extends SVGElement
> extends Base<TSVGElement> {
  link(): A
  link<Attributes extends SVGAAttributes>(attrs: Attributes): A
  link<Attributes extends SVGAAttributes>(
    url: string,
    attrs?: Attributes | null,
  ): A
  link<Attributes extends SVGAAttributes>(
    url?: string | Attributes | null,
    attrs?: Attributes | null,
  ) {
    return A.create<Attributes>(url, attrs).appendTo(this)
  }
}

export class ElementExtension<
  TSVGElement extends SVGElement
> extends Base<TSVGElement> {
  unlink() {
    const link = this.linker()
    if (!link) {
      return this
    }

    const parent = link.parent()
    if (!parent) {
      return this.remove()
    }

    const index = parent.indexOf(link)
    parent.add(this, index)
    link.remove()
    return this
  }

  linkTo(url: string | ((this: A, a: A) => void)) {
    const link = this.linker() || new A()

    if (typeof url === 'function') {
      url.call(link, link)
    } else {
      link.to(url)
    }

    if (this.parent() !== link) {
      this.wrap(link)
    }

    return this
  }

  linker() {
    const link = this.parent<A>()
    if (link && link.node.nodeName.toLowerCase() === 'a') {
      return link
    }
    return null
  }
}
