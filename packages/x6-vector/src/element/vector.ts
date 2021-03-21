import { KeyValue, Attrs } from '../types'
import { Adopter } from './adopter'
import { Registry } from './registry'
import { Svg } from './container/svg'
import { Dom } from './dom'

const PERSIST_ATTR_NAME = 'vector:data'

export class Vector<TSVGElement extends SVGElement> extends Dom<TSVGElement> {
  public readonly node: TSVGElement
  protected assets: KeyValue

  constructor()
  constructor(attrs: Attrs | null)
  constructor(node?: TSVGElement | string | null, attrs?: Attrs | null)
  constructor(node?: TSVGElement | string | Attrs | null, attrs?: Attrs | null)
  constructor(
    node?: TSVGElement | string | Attrs | null,
    attrs?: Attrs | null,
  ) {
    super(node, attrs)
    this.restoreAssets()
    Adopter.ref(this.node, this)
  }

  root(): Svg | null {
    const parent = this.parent<Svg>(Registry.getRoot())
    return parent ? parent.root() : null
  }

  defs() {
    const root = this.root()
    return root ? root.defs() : null
  }

  parents(until: Adopter.Target<Svg> | null = this.root()) {
    const stop = until ? Adopter.makeInstance<Dom>(until) : null
    const parents: Dom[] = []
    let parent = this.parent()
    while (parent && !parent.isDocument() && !parent.isDocumentFragment()) {
      parents.push(parent)
      if (stop && parent.node === stop.node) {
        break
      }
      parent = parent.parent()
    }
    return parents
  }

  reference<T extends Dom>(attribute: string) {
    const value = this.attr(attribute)
    if (!value) {
      return null
    }

    // reference id
    const reg = /(#[_a-z][\w-]*)/i
    const matches = `${value}`.match(reg)
    return matches ? Adopter.makeInstance<T>(matches[1]) : null
  }

  getAssets<T>(): T
  getAssets<T>(key: string, defaultValue: T): T
  getAssets(key?: string, defaultValue?: any) {
    if (key == null) {
      return this.assets
    }

    const val = this.assets[key]
    return val === undefined ? defaultValue : val
  }

  resetAssets(data: KeyValue) {
    this.assets = data
    return this
  }

  restoreAssets() {
    const raw = this.node.getAttribute(PERSIST_ATTR_NAME)
    if (raw) {
      this.resetAssets(JSON.parse(raw) || {})
    } else {
      this.resetAssets({})
    }
    return this
  }

  storeAssets() {
    this.node.removeAttribute(PERSIST_ATTR_NAME)
    if (this.assets && Object.keys(this.assets).length > 0) {
      this.node.setAttribute(PERSIST_ATTR_NAME, JSON.stringify(this.assets))
    }

    return super.storeAssets()
  }
}
