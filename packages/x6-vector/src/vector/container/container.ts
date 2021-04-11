import { Vector } from '../vector/vector'
import { AttributesMap } from '../../dom/attributes'

export class Container<TSVGElement extends SVGElement = SVGElement>
  extends Vector<TSVGElement>
  implements Container.IContainer {
  constructor()
  constructor(attrs: AttributesMap<TSVGElement> | null)
  constructor(
    node: TSVGElement | null,
    attrs?: AttributesMap<TSVGElement> | null,
  )
  constructor(
    node?: TSVGElement | AttributesMap<TSVGElement> | null,
    attrs?: AttributesMap<TSVGElement> | null,
  )
  // eslint-disable-next-line no-useless-constructor
  constructor(
    node?: TSVGElement | AttributesMap<TSVGElement> | null,
    attrs?: AttributesMap<TSVGElement> | null,
  ) {
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
    const p = parent != null ? parent : this.parent<Vector>()
    if (p) {
      let idx = index == null ? p.indexOf(this) : index
      // when parent != this, we want append all elements to the end
      idx = idx === -1 ? p.children().length : idx

      this.children<Vector>()
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
