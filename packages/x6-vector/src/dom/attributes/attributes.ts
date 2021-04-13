import { Base } from '../common/base'
import { Core } from './core'
import { CSSProperties } from '../style'
import { AttributesMap } from './types'
import { AttributesBase } from './base'

export class Attributes<
    TElement extends Element,
    Attributes extends AttributesMap<TElement> = AttributesMap<TElement>,
    Keys extends keyof Attributes = keyof Attributes
  >
  extends Base<TElement>
  implements AttributesBase {
  attr(): Record<string, string | number | boolean | undefined | null> & {
    style: CSSProperties
  }
  attr<K extends Keys>(
    names: K[],
  ): Record<string, string | number | boolean | undefined | null> & {
    style?: CSSProperties
  }
  attr(
    names: string[],
  ): Record<string, string | number | boolean | undefined | null> & {
    style?: CSSProperties
  }

  attr(attrs: Attributes): this
  attr(attrs: { [name: string]: any }): this
  attr<K extends Keys>(name: K, value: Exclude<Attributes[K], undefined>): this
  attr<K extends Keys>(name: K, value: null): this
  attr<K extends Keys>(name: K, value: string | number | boolean): this
  attr(name: string, value: null): this
  attr(name: string, value: string | number | boolean | null): this
  attr(name: 'style', style: CSSProperties | string): this
  attr(name: 'style'): CSSProperties
  attr<T extends Attributes[K], K extends Keys>(name: K): T
  attr<T extends string | number | boolean>(name: string): T

  attr<T extends Attributes[K], K extends Keys>(
    name: K,
    value?: Attributes[K] | null,
  ): T | this

  attr(
    attr?: string | string[] | Record<string, any>,
    value?: string | number | boolean | null,
  ): Record<string, any> | string | number | this
  attr(
    attr?: string | string[] | Record<string, any>,
    val?: string | number | boolean | null | CSSProperties,
  ) {
    const node = this.node

    // get all attributes
    if (attr == null) {
      const result: Record<string, any> = {}
      const attrs = node.attributes
      if (attrs) {
        for (let index = 0, l = attrs.length; index < l; index += 1) {
          const item = attrs.item(index)
          if (item && item.nodeValue) {
            const name = Core.getAttributeNameInResult(item.nodeName)
            result[name] = this.attr(item.nodeName)
          }
        }
      }
      return result
    }

    // get attributes by specified attribute names
    if (Array.isArray(attr)) {
      return attr.reduce<Record<string, any>>((memo, name) => {
        // keep the given names
        memo[name] = this.attr(name)
        return memo
      }, {})
    }

    if (typeof attr === 'object') {
      Object.keys(attr).forEach((key) => this.attr(key, attr[key]))
      return this
    }

    // get attribute by name
    if (val === undefined) {
      const attrName = Core.getAttributeNameInElement(attr)
      const attrValue = node.getAttribute(attrName) || undefined
      return Core.getAttribute(
        node,
        Core.getAttributeNameInResult(attr),
        attrValue,
      )
    }

    // remove attribute
    if (Core.shouldRemoveAttribute(attr, val)) {
      node.removeAttribute(attr)
      return this
    }

    // set attribute by k-v
    Core.setAttribute(node, attr, val)

    return this
  }

  round<K extends Keys>(precision = 2, names?: K[]) {
    const factor = 10 ** precision
    const attrs = names ? this.attr(names) : this.attr()
    Object.keys(attrs).forEach((key) => {
      const value = attrs[key]
      if (typeof value === 'number') {
        attrs[key] = Math.round(value * factor) / factor
      }
    })

    this.attr(attrs)

    return this
  }
}
