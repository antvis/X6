import { namespaces } from '../../util'
import { Adopter } from '../../dom/common/adopter'
import { Registry } from '../../dom/common/registry'
import { Dom } from '../../dom/dom'
import type { Svg } from '../svg/svg'

export class Base<
  TSVGElement extends SVGElement = SVGElement
> extends Dom<TSVGElement> {
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
    const matches = `${value}`.match(/(#[_a-z][\w-]*)/i)
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

  svg(): string
  svg(outerXML: boolean): string
  svg(process: (dom: Dom) => false | Dom, outerXML?: boolean): string
  svg(content: string, outerXML?: boolean): string
  svg(arg1?: boolean | string | ((dom: Dom) => false | Dom), arg2?: boolean) {
    return this.xml(arg1, arg2, namespaces.svg)
  }
}
