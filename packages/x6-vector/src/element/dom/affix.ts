import { DomUtil } from '../../util/dom'
import { Adopter } from '../adopter'
import { Primer } from './primer'

export class Affix<TNode extends Node> extends Primer<TNode> {
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

  restoreAffix() {
    return this.affix(Affix.restore(DomUtil.toElement(this.node)))
  }

  storeAffix(deep = false) {
    Affix.store(DomUtil.toElement(this.node), deep)
    return this
  }
}

export namespace Affix {
  const PERSIST_ATTR_NAME = 'vector:data'

  export function store(node: Element, deep: boolean) {
    node.removeAttribute(PERSIST_ATTR_NAME)
    const elem = Adopter.adopt(node)
    const affixes = elem.affix()
    if (affixes && Object.keys(affixes).length) {
      node.setAttribute(PERSIST_ATTR_NAME, JSON.stringify(affixes))
    }

    if (deep) {
      node.childNodes.forEach((child: Element) => {
        store(child, deep)
      })
    }
  }

  export function restore(node: Element): Record<string, any> {
    const raw = node.getAttribute(PERSIST_ATTR_NAME)
    if (raw) {
      return JSON.parse(raw)
    }
    return {}
  }
}
