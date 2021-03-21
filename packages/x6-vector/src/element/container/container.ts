import { Attrs } from '../../types'
import { VectorElement } from '../element'

@Container.register('Container')
export class Container<TSVGElement extends SVGElement = SVGElement>
  extends VectorElement<TSVGElement>
  implements Container.IContainer {
  constructor()
  constructor(attrs: Attrs | null)
  constructor(node: TSVGElement | null, attrs?: Attrs | null)
  constructor(node?: TSVGElement | Attrs | null, attrs?: Attrs | null)
  // eslint-disable-next-line no-useless-constructor
  constructor(node?: TSVGElement | Attrs | null, attrs?: Attrs | null) {
    super(node, attrs)
  }

  flatten() {
    this.eachChild((child) => {
      if (child instanceof Container) {
        child.flatten().ungroup()
      }
    })

    return this
  }

  ungroup(parent?: Container, index?: number) {
    const p = parent != null ? parent : this.parent<VectorElement>()
    if (p) {
      let idx = index == null ? p.indexOf(this) : index
      // when parent != this, we want append all elements to the end
      idx = idx === -1 ? p.children().length : idx

      this.children<VectorElement>()
        .reverse()
        .forEach((child) => child.toParent(p, idx))

      this.remove()
    }
    return this
  }
}

export namespace Container {
  export interface IContainer {
    flatten(): this
    ungroup(): this
  }
}
