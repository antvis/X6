import { Vector } from '../vector/vector'
import { Wrapper } from './wrapper'

export class Container<
  TSVGElement extends SVGElement = SVGElement
> extends Wrapper<TSVGElement> {
  flatten() {
    this.eachChild((child) => {
      if (child instanceof Container) {
        child.flatten().ungroup()
      }
    })

    return this
  }

  ungroup(parent?: Container, index?: number) {
    const ancestor = parent != null ? parent : this.parent<Vector>()
    if (ancestor) {
      let idx = index == null ? ancestor.indexOf(this) : index
      // when parent != this, we want append all elements to the end
      idx = idx === -1 ? ancestor.children().length : idx

      this.children<Vector>()
        .reverse()
        .forEach((child) => child.toParent(ancestor, idx))

      this.remove()
    }
    return this
  }
}
