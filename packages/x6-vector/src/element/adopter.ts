import { DomUtil } from '../util/dom'
import { Global } from '../global'
import type { Svg } from './container/svg'
import type { Dom } from './dom'
import { Registry } from './registry'
import { ElementMapping, HTMLTagMapping, SVGTagMapping } from './types'

export namespace Adopter {
  const store: WeakMap<Node, Dom> = new WeakMap()

  export function cache(node: Node, instance?: Dom | null) {
    if (instance == null) {
      store.delete(node)
    } else {
      store.set(node, instance)
    }
  }

  export function adopt(node: null): null
  export function adopt<T extends Node>(node: T): ElementMapping<T>
  export function adopt<T extends Dom>(node: Node | ChildNode): T
  export function adopt<T extends Dom>(node: Node | ChildNode | null): T | null
  export function adopt<T extends Node>(
    node?: T | null,
  ): ElementMapping<T> | null
  export function adopt<T extends Node>(
    node?: T | null,
  ): ElementMapping<T> | null {
    if (node == null) {
      return null
    }

    // make sure a node isn't already adopted
    const instance = store.get(node)
    if (instance != null) {
      return instance as ElementMapping<T>
    }

    const Type = Registry.getClass(node)
    return new Type(node) as ElementMapping<T>
  }

  let adopter = adopt

  export type Target<T extends Dom = Dom> = T | Node | string

  export function makeInstance(): Svg
  export function makeInstance(node: undefined | null): Svg
  export function makeInstance<T extends Dom>(instance: T): T
  export function makeInstance<T extends Dom>(target: Target<T>): T
  export function makeInstance<T extends Node>(node: T): ElementMapping<T>
  export function makeInstance<T extends keyof SVGTagMapping>(
    tagName: T,
  ): SVGTagMapping[T]
  export function makeInstance<T extends keyof SVGTagMapping>(
    tagName: T,
    isHTML: false,
  ): SVGTagMapping[T]
  export function makeInstance<T extends keyof HTMLTagMapping>(
    tagName: T,
    isHTML: true,
  ): HTMLTagMapping[T]
  export function makeInstance<T extends Dom>(
    tagName: string,
    isHTML: boolean,
  ): T
  export function makeInstance<T extends Dom>(
    node?: T | Node | string,
    isHTML = false,
  ): T {
    if (node == null) {
      const Root = Registry.getRoot()
      return new Root() as T
    }

    if (node instanceof Node) {
      return adopter(node) as T
    }

    if (typeof node === 'object') {
      return node
    }

    if (typeof node === 'string' && node.charAt(0) !== '<') {
      return adopter(Global.document.querySelector(node)) as T
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

    return result as T
  }

  export function mock(instance = adopt) {
    adopter = instance
  }

  export function unmock() {
    adopter = adopt
  }
}
