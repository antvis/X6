import { Attrs } from '../../types'
import { Vector } from '../vector'
import { A } from './a'

export class ContainerExtension<
  TSVGElement extends SVGElement
> extends Vector<TSVGElement> {
  link(): A
  link(attrs: Attrs): A
  link(url: string, attrs?: Attrs | null): A
  link(url?: string | Attrs | null, attrs?: Attrs | null) {
    return A.create(url, attrs).appendTo(this)
  }
}

export class ElementExtension<
  TSVGElement extends SVGElement
> extends Vector<TSVGElement> {
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

    if (!link.parent()) {
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
