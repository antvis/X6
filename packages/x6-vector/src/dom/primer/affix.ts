import { Adopter } from '../common/adopter'
import { Base } from '../common/base'

export class Affix<TElement extends Element = Element> extends Base<TElement> {
  protected affixes: Record<string, any> | undefined

  affix<T extends Record<string, any>>(): T
  affix<T>(key: string): T
  affix(data: Record<string, any>): this
  affix(data: null): this
  affix(key: string, value: any): this
  affix(key: string, value: null): this
  affix(key?: string | Record<string, any> | null, value?: any) {
    const bag = Affix.get(this)

    if (typeof key === 'undefined') {
      return bag
    }

    if (key == null) {
      Affix.set(this, {})
      return this
    }

    if (typeof key === 'string') {
      if (typeof value === 'undefined') {
        return bag[key]
      }

      if (value == null) {
        delete bag[key]
      } else {
        bag[key] = value
      }

      return this
    }

    Affix.set(this, key)
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
  const cache: WeakMap<Affix, Record<string, any>> = new WeakMap()

  export function get<T extends Affix>(instance: T): Record<string, any> {
    return cache.get(instance)!
  }

  export function set<T extends Affix>(instance: T, item: Record<string, any>) {
    cache.set(instance, item)
  }
}

export namespace Affix {
  export const PERSIST_ATTR_NAME = 'vector:data'

  export function store<TElement extends Element>(
    node: TElement,
    deep: boolean,
  ) {
    if (node.removeAttribute) {
      node.removeAttribute(PERSIST_ATTR_NAME)
      const instance = Adopter.adopt(node)
      const affixes = instance.affix()
      if (affixes && Object.keys(affixes).length) {
        node.setAttribute(PERSIST_ATTR_NAME, JSON.stringify(affixes))
      }
    }

    if (deep) {
      node.childNodes.forEach((child) => store(child as Element, deep))
    }
  }

  export function restore<TElement extends Element>(
    node: TElement,
  ): Record<string, any> {
    try {
      const raw = node.getAttribute(PERSIST_ATTR_NAME)
      if (raw) {
        return JSON.parse(raw)
      }
    } catch (error) {
      // pass
    }

    return {}
  }
}
