import { Adopter } from './adopter'
import { Registry } from './registry'
import { Svg } from './container/svg'
import { Dom } from './dom'

export class Vector<TSVGElement extends SVGElement> extends Dom<TSVGElement> {
  root(): Svg | null {
    const parent = this.parent<Svg>(Registry.getRoot())
    return parent ? parent.root() : null
  }

  defs() {
    const root = this.root()
    return root ? root.defs() : null
  }

  reference<T extends Dom>(attr: string): T | null {
    const value = this.attr(attr)
    if (!value) {
      return null
    }

    // reference id
    const reg = /(#[_a-z][\w-]*)/i
    const matches = `${value}`.match(reg)
    return matches ? Adopter.makeInstance<T>(matches[1]) : null
  }

  parents<T extends Dom = Dom>(): T[]
  parents<T extends Dom = Dom>(until: null): T[]
  parents<T extends Dom = Dom>(untilElement: Dom): T[]
  parents<T extends Dom = Dom>(untilNode: Node): T[]
  parents<T extends Dom = Dom>(untilSelector: string): T[]
  parents<T extends Dom = Dom>(until: Adopter.Target<Dom> | null): T[]
  parents<T extends Dom = Dom>(
    until: Adopter.Target<Dom> | null = this.root(),
  ) {
    return super.parents<T>(until)
  }
}
