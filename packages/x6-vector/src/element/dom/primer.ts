import { Attr } from '../../util/attr'
import { DomUtil } from '../../util/dom'
import { Attrs } from '../../types'
import { Color } from '../../struct/color'
import { NumberArray } from '../../struct/number-array'
import { Registry } from '../registry'
import { Base } from '../base'

export abstract class Primer<TNode extends Node> extends Base {
  public readonly node: TNode

  public get type() {
    return this.node.nodeName
  }

  constructor(node?: TNode | string | Attrs | null, attrs?: Attrs | null) {
    super()

    let attributes: Attrs | null | undefined
    if (DomUtil.isNode(node)) {
      this.node = node
      attributes = attrs
    } else {
      const ctor = this.constructor as Registry.Definition
      const name = typeof node === 'string' ? node : Registry.getTagName(ctor)
      if (name) {
        this.node = DomUtil.createNode<any>(name)
        attributes = node != null && typeof node !== 'string' ? node : attrs
      } else {
        throw new Error(
          `Can not initialize "${ctor.name}" with unknown node name`,
        )
      }
    }

    if (attributes) {
      this.attr(attributes)
    }
  }

  attr(): Attrs
  attr(names: string[]): Attrs
  attr<T extends string | number = string>(name: string): T
  attr(name: string, value: null): this
  attr(name: string, value: string | number, ns?: string): this
  attr(attrs: Attrs): this
  attr<T extends string | number>(
    name?: string,
    value?: string | number | null,
    ns?: string,
  ): T | this
  attr(
    attr?: string | string[] | Attrs,
    value?: string | number | null,
    ns?: string,
  ): Attrs | string | number | this
  attr(
    attr?: string | string[] | Attrs,
    val?: string | number | null,
    ns?: string,
  ) {
    const node = DomUtil.toElement(this.node)

    // get all attributes
    if (attr == null) {
      const result: Attrs = {}
      const attrs = node.attributes
      if (attrs) {
        for (let index = 0, l = attrs.length; index < l; index += 1) {
          const item = attrs.item(index)
          if (item && item.nodeValue) {
            result[item.nodeName] = Attr.parseValue(item.nodeValue)
          }
        }
      }
      return result
    }

    // get attributes by specified attribute names
    if (Array.isArray(attr)) {
      return attr.reduce<Attrs>((memo, name) => {
        memo[name] = this.attr(name)
        return memo
      }, {})
    }

    if (typeof attr === 'object') {
      Object.keys(attr).forEach((key) => this.attr(key, attr[key]))
      return this
    }

    if (val === null) {
      node.removeAttribute(attr)
      return this
    }

    if (val == null) {
      const raw = node.getAttribute(attr)
      return raw == null
        ? Attr.defaults[attr as keyof typeof Attr.defaults]
        : Attr.parseValue(raw)
    }

    const value = this.applyAttrHooks(attr, val)
    typeof ns === 'string'
      ? node.setAttributeNS(ns, attr, value.toString())
      : node.setAttribute(attr, value.toString())

    return this
  }

  protected applyAttrHooks(attr: string, val: string | number) {
    const value = Attr.applyHooks(attr, val, this as any)
    if (typeof value === 'number') {
      return value
    }

    if (Color.isColor(value)) {
      return new Color(value)
    }

    if (Array.isArray(value)) {
      return new NumberArray(value)
    }

    return value
  }

  round(precision = 2, names?: string[]) {
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
