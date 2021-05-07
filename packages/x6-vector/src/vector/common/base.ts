import { namespaces } from '../../util/dom'
import { Registry } from '../../dom/common/registry'
import { Dom } from '../../dom/dom'
import type { Svg } from '../svg/svg'

export class Base<
  TSVGElement extends SVGElement = SVGElement
> extends Dom<TSVGElement> {
  root(): Svg | null {
    const parent = this.parent<Svg>(Registry.getClass('Svg'))
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
    return matches ? Base.findOne<T>(matches[1]) : null
  }

  svg(): string
  svg(outerXML: boolean): string
  svg(process: (dom: Dom) => false | Dom, outerXML?: boolean): string
  svg(content: string, outerXML?: boolean): string
  svg(arg1?: boolean | string | ((dom: Dom) => false | Dom), arg2?: boolean) {
    return this.xml(arg1, arg2, namespaces.svg)
  }
}
