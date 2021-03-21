import { DomUtil } from '../util/dom'
import { Global } from '../global'
import { Registry } from './registry'
import { Base } from './base'

export namespace Adopter {
  const cache: WeakMap<Node, Base> = new WeakMap()

  export function ref(node: Node, instance?: Base | null) {
    if (instance == null) {
      cache.delete(node)
    } else {
      cache.set(node, instance)
    }
  }

  export function adopt<TVector extends Base>(node: Node): TVector
  export function adopt<TVector extends Base>(
    node?: Node | null,
  ): TVector | null
  export function adopt<TVector extends Base>(
    node?: Node | null,
  ): TVector | null {
    if (node == null) {
      return null
    }

    // make sure a node isn't already adopted
    const instance = cache.get(node)
    if (instance != null && instance instanceof Base) {
      return instance as TVector
    }

    const cls = Registry.getClass(node)
    return new cls(node) // eslint-disable-line new-cap
  }

  let adopter = adopt

  export type Target<TVector extends Base = Base> = TVector | Node | string

  export function makeInstance<TVector extends Base>(
    node?: TVector | Node | string,
    isHTML = false,
  ): TVector {
    if (node == null) {
      const root = Registry.getRoot()
      return new root() // eslint-disable-line new-cap
    }

    if (node instanceof Base) {
      return node
    }

    if (typeof node === 'object') {
      return adopter(node)
    }

    if (typeof node === 'string' && node.charAt(0) !== '<') {
      return adopter(Global.document.querySelector(node)) as TVector
    }

    // Make sure, that HTML elements are created with the correct namespace
    const wrapper = isHTML
      ? Global.document.createElement('div')
      : DomUtil.createNode('svg')
    wrapper.innerHTML = node

    // We can use firstChild here because we know,
    // that the first char is < and thus an element
    const result = adopter(wrapper.firstChild)

    // make sure, that element doesnt have its wrapper attached
    wrapper.firstChild!.remove()

    return result as TVector
  }

  export function mock(instance = adopt) {
    adopter = instance
  }

  export function unmock() {
    adopter = adopt
  }
}
