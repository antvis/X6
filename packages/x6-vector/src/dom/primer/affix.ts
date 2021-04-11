import { Adopter } from '../common/adopter'
import { Base } from '../common/base'

export class Affix<TElement extends Element> extends Base<TElement> {
  protected affixes: Record<string, any>

  affix<T extends Record<string, any>>(): T
  affix<T>(key: string): T
  affix(data: Record<string, any>): this
  affix(key: string, value: any): this
  affix(key?: string | Record<string, any>, value?: any) {
    if (typeof key === 'undefined') {
      return this.affixes
    }

    if (key == null) {
      this.affixes = {}
      return this
    }

    if (typeof key === 'string') {
      if (typeof value === 'undefined') {
        return this.affixes[key]
      }

      if (value == null) {
        delete this.affixes[key]
      }
      this.affixes[key] = value
      return this
    }

    this.affixes = key
    return this
  }

  storeAffix(deep = false) {
    Affix.store(this.node, deep)
    return this
  }

  restoreAffix() {
    return this.affix(Affix.restore(this.node))
  }
}

export namespace Affix {
  const PERSIST_ATTR_NAME = 'vector:data'

  export function store<TElement extends Element>(
    node: TElement,
    deep: boolean,
  ) {
    node.removeAttribute(PERSIST_ATTR_NAME)
    const instance = Adopter.adopt(node)
    const affixes = instance.affix()
    if (affixes && Object.keys(affixes).length) {
      node.setAttribute(PERSIST_ATTR_NAME, JSON.stringify(affixes))
    }

    if (deep) {
      node.childNodes.forEach((child) => store(child as Element, deep))
    }
  }

  export function restore<TElement extends Element>(
    node: TElement,
  ): Record<string, any> {
    const raw = node.getAttribute(PERSIST_ATTR_NAME)
    if (raw) {
      return JSON.parse(raw)
    }
    return {}
  }
}
