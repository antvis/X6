import { createHTMLNode, createSVGNode } from '../../util/dom'
import { Global } from '../../global'
import { Registry } from './registry'
import type { Base } from './base'
import type { Dom } from '../dom'
import type { Svg } from '../../vector'
import type { ElementMap } from '../../types'
import type { HTMLAttributesTagNameMap } from '../types'
import type { SVGAttributesTagNameMap } from '../../vector/types'

export namespace Adopter {
  const store: WeakMap<Node, Base> = new WeakMap()

  export function cache(node: Node, instance?: Base | null) {
    if (typeof instance === 'undefined') {
      return store.get(node)
    }

    if (instance === null) {
      store.delete(node)
    } else {
      store.set(node, instance)
    }
  }

  export function adopt(node: null): null
  export function adopt<T extends Node>(node: T): ElementMap<T>
  export function adopt<T extends Dom>(node: Node | ChildNode): T
  export function adopt<T extends Dom>(node: Node | ChildNode | null): T | null
  export function adopt<T extends Node>(node?: T | null): ElementMap<T> | null
  export function adopt<T extends Node>(node?: T | null): ElementMap<T> | null {
    if (node == null) {
      return null
    }

    // make sure a node isn't already adopted
    const instance = store.get(node)
    if (instance != null) {
      return instance as ElementMap<T>
    }

    const Type = Registry.getClass(node)
    return new Type(node) as ElementMap<T>
  }

  const adopter = adopt

  export type Target<T extends Dom = Dom> = T | Node | string

  export function makeInstance(): Svg
  export function makeInstance(node: undefined | null): Svg
  export function makeInstance<T extends Dom>(instance: T): T
  export function makeInstance<T extends Dom>(target: Target<T>): T
  export function makeInstance<T extends Node>(node: T): ElementMap<T>
  export function makeInstance<T extends keyof SVGAttributesTagNameMap>(
    tagName: T,
  ): SVGAttributesTagNameMap[T]
  export function makeInstance<T extends keyof SVGAttributesTagNameMap>(
    tagName: T,
    isHTML: false,
  ): SVGAttributesTagNameMap[T]
  export function makeInstance<T extends keyof HTMLAttributesTagNameMap>(
    tagName: T,
    isHTML: true,
  ): HTMLAttributesTagNameMap[T]
  export function makeInstance<T extends Dom>(
    tagName: string,
    isHTML: boolean,
  ): T
  export function makeInstance<T extends Dom>(
    node?: T | Node | string,
    isHTML = false,
  ): T {
    if (node == null) {
      const Root = Registry.getClass('Svg')
      return new Root() as T
    }

    if (node instanceof Global.window.Node) {
      return adopter(node) as T
    }

    if (typeof node === 'object') {
      return node
    }

    if (typeof node === 'string') {
      node = node.trim() // eslint-disable-line
    }

    if (node.charAt(0) !== '<') {
      return adopter(createNode(node)) as T
    }

    // Make sure, that HTML elements are created with the correct namespace
    const wrapper = isHTML ? createHTMLNode('div') : createSVGNode('svg')
    wrapper.innerHTML = node

    // We can use firstChild here because we know,
    // that the first char is < and thus an element
    const result = adopter(wrapper.firstChild)

    // make sure, that element doesnt have its wrapper attached
    wrapper.firstChild!.remove()

    return result as T
  }

  export function createNode<TElement extends Element>(tagName: string) {
    const lower = tagName.toLowerCase()
    const isSVG = lower !== 'dom' && Registry.isRegisted(lower)
    const node = isSVG ? createSVGNode(tagName) : createHTMLNode(tagName)
    return node as any as TElement
  }

  // export function mock(instance = adopt) {
  //   adopter = instance
  // }

  // export function unmock() {
  //   adopter = adopt
  // }
}
