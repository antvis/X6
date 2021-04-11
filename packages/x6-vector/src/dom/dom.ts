import { Global } from '../global'
import { ID } from './common/id'
import * as Util from '../util/dom'
import { Adopter } from './common/adopter'
import { Registry } from './common/registry'
import { Primer } from './primer'
import { Transform } from './transform/transform'
import type { AttributesMap } from './attributes'
import type { ElementMap } from '../types'

@Dom.register('Dom')
@Dom.mixin(Transform)
export class Dom<TElement extends Element = Element> extends Primer<TElement> {
  /**
   * Returns the first child of the element.
   */
  first<T extends Dom = Dom>(): T | null {
    return Dom.adopt<T>(this.node.firstChild)
  }

  /**
   * Returns the last child of the element.
   */
  last<T extends Dom = Dom>(): T | null {
    return Dom.adopt<T>(this.node.lastChild)
  }

  /**
   * Returns an element on a given position in the element's children array.
   */
  get<T extends Dom = Dom>(index: number): T | null {
    return Dom.adopt<T>(this.node.childNodes[index])
  }

  /**
   * Returns an array of elements matching the given selector.
   */
  find<T extends Dom = Dom>(selector: string): T[] {
    return Dom.find<T>(selector, this.node)
  }

  /**
   * Returns the first element matching the given selector.
   */
  findOne<T extends Dom = Dom>(selector: string): T | null {
    return Dom.findOne<T>(selector, this.node)
  }

  /**
   * Returns `true` if the element matching the given selector.
   */
  matches(selector: string): boolean {
    const elem = this.node
    const node = this.node as any
    const matcher = elem.matches
    // eslint-disable-next-line no-unused-expressions
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    node.matchesSelector ||
      node.msMatchesSelector ||
      node.mozMatchesSelector ||
      elem.webkitMatchesSelector ||
      node.oMatchesSelector ||
      null
    return matcher ? matcher.call(elem, selector) : false
  }

  /**
   * Returns an array of children elements.
   */
  children<T extends Dom>(): T[] {
    const elems: T[] = []
    this.node.childNodes.forEach((node) => {
      elems.push(Dom.adopt<T>(node))
    })
    return elems
  }

  /**
   * Removes all elements from the element.
   */
  clear() {
    while (this.node.lastChild) {
      this.node.lastChild.remove()
    }
    return this
  }

  /**
   * Returns an exact copy of the element.
   */
  clone(deep = true) {
    // write dom data to the dom so the clone can pickup the data
    this.storeAffix(deep)
    // clone element and assign new id
    const Ctor = this.constructor as new (node: Element) => ElementMap<TElement>
    const cloned = this.node.cloneNode(deep) as Element
    ID.overwrite(cloned, true)
    return new Ctor(cloned)
  }

  /**
   * Iterates over all the children of the element.
   * Deep traversing is also possible by passing `true` as the second argument.
   * @returns
   */
  eachChild<T extends Dom>(
    iterator: (this: T, child: T, index: number, children: T[]) => void,
    deep?: boolean,
  ) {
    const children = this.children()
    for (let i = 0, l = children.length; i < l; i += 1) {
      const child = children[i]
      iterator.call(child, child, i, children)
      if (deep) {
        child.eachChild(iterator, deep)
      }
    }

    return this
  }

  /**
   * Returns the index of given node.
   * Returns `-1` when it is not a child.
   */
  indexOf(node: Node): number
  /**
   * Returns the index of given element.
   * Returns `-1` when it is not a child.
   */
  indexOf(element: Dom): number
  /**
   * Returns the index of given element or node.
   * Returns `-1` when it is not a child.
   */
  indexOf(element: Dom | Node): number
  indexOf(element: Dom | Node): number {
    const children = Array.prototype.slice.call(this.node.childNodes) as Node[]
    return children.indexOf(element instanceof Node ? element : element.node)
  }

  /**
   * Returns `true` when the given node is a child of the element.
   */
  has(node: Node): boolean
  /**
   * Returns `true` when the given element is a child of the element.
   */
  has(element: Dom): boolean
  /**
   * Returns `true` when the given element or node is a child of the element.
   */
  has(element: Dom | Node): boolean
  has(element: Dom | Node): boolean {
    return this.indexOf(element) !== -1
  }

  /**
   * Returns the index of the element in it's parent.
   * Returns `-1` when the element do not have a parent.
   */
  index(): number {
    const parent: Dom | null = this.parent()
    return parent ? parent.indexOf(this) : -1
  }

  contains(node: Node): boolean
  contains(element: Dom): boolean
  contains(element: Dom | Node): boolean {
    return Util.isAncestorOf(
      this.node,
      element instanceof Node ? element : element.node,
    )
  }

  /**
   * Returns the element's id, generate new id if no id set.
   */
  id(): string
  /**
   * Set id of the element.
   */
  id(id: string | null): this
  id(id?: string | null) {
    // generate new id if no id set
    if (typeof id === 'undefined' && this.node.id == null) {
      this.node.id = ID.generate()
    }

    // dont't set directly with this.node.id to make `null` work correctly
    return typeof id === 'undefined' ? this.attr('id') : this.attr('id', id)
  }

  /**
   * Returns the parent element if exist.
   */
  parent<T extends Dom = Dom>(): T | null
  /**
   * Iterates over the ancestors and returns the ancestor mathcing the selector.
   */
  parent<T extends Dom = Dom>(selector: string): T | null
  /**
   * Iterates over the ancestors and returns the ancestor mathcing the type.
   */
  parent<T extends Dom = Dom>(parentType: Registry.Definition): T | null
  parent<T extends Dom = Dom>(selector?: string | Registry.Definition): T | null
  parent<T extends Dom = Dom>(
    selector?: string | Registry.Definition,
  ): T | null {
    if (this.node.parentNode == null) {
      return null
    }

    let parent: T | null = Dom.adopt<T>(this.node.parentNode)

    if (selector == null) {
      return parent
    }

    // loop trough ancestors if type is given
    do {
      if (
        typeof selector === 'string'
          ? parent.matches(selector)
          : parent instanceof selector
      ) {
        return parent
      }
    } while ((parent = Dom.adopt<T>(parent.node.parentNode)))

    return null
  }

  parents<T extends Dom = Dom>(): T[]
  parents<T extends Dom = Dom>(until: null): T[]
  parents<T extends Dom = Dom>(untilElement: Dom): T[]
  parents<T extends Dom = Dom>(untilNode: Node): T[]
  parents<T extends Dom = Dom>(untilSelector: string): T[]
  parents<T extends Dom = Dom>(until: Adopter.Target<Dom> | null): T[]
  parents<T extends Dom = Dom>(until?: Adopter.Target<Dom> | null) {
    const stop = until ? Adopter.makeInstance<Dom>(until) : null
    const parents: T[] = []
    let parent = this.parent()
    while (parent && !parent.isDocument() && !parent.isDocumentFragment()) {
      parents.push(parent as T)
      if (stop && parent.node === stop.node) {
        break
      }
      parent = parent.parent()
    }
    return parents
  }

  add<T extends Dom>(element: T, index?: number): this
  add<T extends Node>(node: T, index?: number): this
  add(selector: string, index?: number): this
  add<T extends Dom>(element: Adopter.Target<T>, index?: number): this
  add<T extends Dom>(element: Adopter.Target<T>, index?: number): this {
    const instance = Adopter.makeInstance<T>(element)

    // If non-root svg nodes are added we have to remove their namespaces
    if (instance.isSVGSVGElement()) {
      const svg = Dom.adopt(instance.node as SVGSVGElement)
      svg.removeNamespace()
    }

    if (index == null) {
      this.node.appendChild(instance.node)
    } else if (instance.node !== this.node.childNodes[index]) {
      this.node.insertBefore(instance.node, this.node.childNodes[index])
    }

    return this
  }

  append<T extends Dom>(element: T): this
  append<T extends Node>(node: T): this
  append(selector: string): this
  append<T extends Dom>(element: Adopter.Target<T>): this
  append<T extends Dom>(element: Adopter.Target<T>): this {
    return this.add(element)
  }

  prepend<T extends Dom>(element: T): this
  prepend<T extends Node>(node: T): this
  prepend(selector: string): this
  prepend<T extends Dom>(element: Adopter.Target<T>): this
  prepend<T extends Dom>(element: Adopter.Target<T>): this {
    return this.add(element, 0)
  }

  addTo<T extends Dom>(parentElement: T, index?: number): this
  addTo<T extends Node>(parentNode: T, index?: number): this
  addTo(selector: string, index?: number): this
  addTo<T extends Dom>(parent: Adopter.Target<T>, index?: number): this
  addTo<T extends Dom>(parent: Adopter.Target<T>, index?: number): this {
    return Adopter.makeInstance<T>(parent).put(this, index)
  }

  appendTo<T extends Dom>(parentElement: T): this
  appendTo<T extends Node>(parentNode: T): this
  appendTo(selector: string): this
  appendTo<T extends Dom>(parent: Adopter.Target<T>): this
  appendTo<T extends Dom>(parent: Adopter.Target<T>): this {
    return this.addTo(parent)
  }

  /**
   * Adds the given element to the end fo child list or the optional child
   * position and returns the added element.
   */
  put<T extends Dom>(element: T, index?: number): T
  /**
   * Adds the given node to the end fo child list or the optional child position
   * and returns the added element.
   */
  put<T extends Node>(node: T, index?: number): ElementMap<T>
  /**
   * Adds the node matching the selector to end fo child list or the optional
   * child position and returns the added element.
   */
  put<T extends Dom>(selector: string, index?: number): T
  put<T extends Dom>(element: Adopter.Target<T>, index?: number): T
  put<T extends Dom>(element: Adopter.Target<T>, index?: number): T {
    const instance = Adopter.makeInstance<T>(element)
    this.add(instance, index)
    return instance
  }

  putIn<T extends Dom>(parentElement: T, index?: number): T
  putIn<T extends Node>(parentNode: T, index?: number): ElementMap<T>
  putIn<T extends Dom>(selector: string, index?: number): T
  putIn<T extends Dom>(parent: Adopter.Target<T>, index?: number): T
  putIn<T extends Dom>(parent: Adopter.Target<T>, index?: number): T {
    return Adopter.makeInstance<T>(parent).add(this, index)
  }

  replace<T extends Dom>(element: T, index?: number): T
  replace<T extends Node>(node: T, index?: number): ElementMap<T>
  replace<T extends Dom>(selector: string, index?: number): T
  replace<T extends Dom>(element: Adopter.Target<T>, index?: number): T
  replace<T extends Dom>(element: Adopter.Target<T>): T {
    const instance = Adopter.makeInstance<T>(element)

    if (this.node.parentNode) {
      this.node.parentNode.replaceChild(instance.node, this.node)
    }

    return instance
  }

  element<T extends keyof SVGElementTagNameMap>(
    nodeName: T,
    attrs?: AttributesMap<SVGElementTagNameMap[T]> | null,
  ): ElementMap<T>
  element<T extends keyof HTMLElementTagNameMap>(
    nodeName: T,
    attrs?: AttributesMap<HTMLElementTagNameMap[T]> | null,
  ): ElementMap<T>
  element<T extends Dom>(
    nodeName: string,
    attrs?: AttributesMap<any> | null,
  ): T {
    const elem = Adopter.makeInstance<T>(nodeName)
    if (attrs) {
      elem.attr(attrs)
    }
    return this.put(elem)
  }

  remove() {
    const parent = this.parent()
    if (parent) {
      parent.removeElement(this)
    }

    return this
  }

  removeElement(node: Node): this
  removeElement(element: Dom): this
  removeElement(element: Dom | Node) {
    this.node.removeChild(element instanceof Node ? element : element.node)
    return this
  }

  before<T extends Dom>(element: T): this
  before<T extends Node>(node: T): this
  before(selector: string): this
  before<T extends Dom>(element: Adopter.Target<T>): this
  before<T extends Dom>(element: Adopter.Target<T>) {
    const parent = this.parent()
    if (parent) {
      const index = this.index()
      const instance = Adopter.makeInstance(element)
      instance.remove()
      parent.add(instance, index)
    }

    return this
  }

  after<T extends Dom>(element: T): this
  after<T extends Node>(node: T): this
  after(selector: string): this
  after<T extends Dom>(element: Adopter.Target<T>): this
  after<T extends Dom>(element: Adopter.Target<T>) {
    const parent = this.parent()
    if (parent) {
      const index = this.index()
      const instance = Adopter.makeInstance(element)
      instance.remove()
      parent.add(element, index + 1)
    }
    return this
  }

  insertBefore<T extends Dom>(element: T): this
  insertBefore<T extends Node>(node: T): this
  insertBefore(selector: string): this
  insertBefore<T extends Dom>(element: Adopter.Target<T>): this
  insertBefore<T extends Dom>(element: Adopter.Target<T>) {
    Adopter.makeInstance(element).before(this)
    return this
  }

  insertAfter<T extends Dom>(element: T): this
  insertAfter<T extends Node>(node: T): this
  insertAfter(selector: string): this
  insertAfter<T extends Dom>(element: Adopter.Target<T>): this
  insertAfter<T extends Dom>(element: Adopter.Target<T>) {
    Adopter.makeInstance(element).after(this)
    return this
  }

  siblings<T extends Dom>(): T[]
  siblings<T extends Dom>(selfInclued?: boolean): T[]
  siblings<T extends Dom>(selector: string, selfInclued?: boolean): T[]
  siblings(selector?: string | boolean, selfInclued?: boolean) {
    const parent = this.parent()
    const children = parent ? parent.children() : []

    if (selector == null) {
      return children.filter((child) => child !== this)
    }

    if (typeof selector === 'boolean') {
      return selector ? children : children.filter((child) => child !== this)
    }

    return children.filter(
      (child) => child.matches(selector) && (selfInclued || child !== this),
    )
  }

  next<T extends Dom>(): T | null
  next<T extends Dom>(selector: string): T | null
  next<T extends Dom>(selector?: string): T | null {
    const parent = this.parent()
    if (parent) {
      const index = this.index()
      const children = parent.children<T>()
      for (let i = index + 1, l = children.length; i < l; i += 1) {
        const next = children[i]
        if (selector == null || next.matches(selector)) {
          return next
        }
      }
    }
    return null
  }

  nextAll<T extends Dom>(): T[]
  nextAll<T extends Dom>(selector: string): T[]
  nextAll<T extends Dom>(selector?: string): T[] {
    const result: T[] = []
    const parent = this.parent()
    if (parent) {
      const index = this.index()
      const children = parent.children<T>()
      for (let i = index + 1, l = children.length; i < l; i += 1) {
        const next = children[i]
        if (selector == null || next.matches(selector)) {
          result.push(next)
        }
      }
    }
    return result
  }

  prev<T extends Dom>(): T | null
  prev<T extends Dom>(selector: string): T | null
  prev<T extends Dom>(selector?: string): T | null {
    const parent = this.parent()
    if (parent) {
      const index = this.index()
      const children = parent.children<T>()
      for (let i = index - 1; i >= 0; i -= 1) {
        const previous = children[i]
        if (selector == null || previous.matches(selector)) {
          return previous
        }
      }
    }

    return null
  }

  prevAll<T extends Dom>(): T[]
  prevAll<T extends Dom>(selector: string): T[]
  prevAll<T extends Dom>(selector?: string): T[] {
    const result: T[] = []
    const parent = this.parent()
    if (parent) {
      const index = this.index()
      const children = parent.children<T>()
      for (let i = index - 1; i >= 0; i -= 1) {
        const previous = children[i]
        if (selector == null || previous.matches(selector)) {
          result.push(previous)
        }
      }
    }
    return result
  }

  forward() {
    const parent = this.parent()
    if (parent) {
      const index = this.index()
      parent.add(this.remove(), index + 1)
    }
    return this
  }

  backward() {
    const parent = this.parent()
    if (parent) {
      const index = this.index()
      parent.add(this.remove(), index ? index - 1 : 0)
    }
    return this
  }

  front() {
    const parent = this.parent()
    if (parent) {
      parent.add(this.remove())
    }
    return this
  }

  back() {
    const parent = this.parent()
    if (parent) {
      parent.add(this.remove(), 0)
    }
    return this
  }

  wrap<T extends Dom>(element: T): this
  wrap<T extends Node>(node: T): this
  wrap(selector: string): this
  wrap<T extends Dom>(element: Adopter.Target<T>): this
  wrap<T extends Dom>(node: Adopter.Target<T>): this {
    const parent = this.parent()
    if (!parent) {
      return this.addTo<T>(node)
    }

    const index = parent.indexOf(this)
    return parent.put<T>(node, index).put(this)
  }

  words(text: string) {
    this.node.textContent = text
    return this
  }

  /**
   * Returns the is of the node.
   */
  toString() {
    return this.id()
  }

  html(): string
  html(outerHTML: boolean): string
  html(process: (dom: Dom) => false | Dom, outerHTML?: boolean): string
  html(content: string, outerHTML?: boolean): string
  html(arg1?: boolean | string | ((dom: Dom) => false | Dom), arg2?: boolean) {
    return this.xml(arg1, arg2, Util.namespaces.html)
  }

  xml(): string
  xml(outerXML: boolean): string
  xml(process: (dom: Dom) => false | Dom, outerXML?: boolean): string
  xml(content: string, outerXML?: boolean, ns?: string): string
  xml(
    arg1?: boolean | string | ((dom: Dom) => false | Dom),
    arg2?: boolean,
    arg3?: string,
  ): string
  xml(
    arg1?: boolean | string | ((dom: Dom) => false | Dom),
    arg2?: boolean,
    arg3?: string,
  ) {
    const content = typeof arg1 === 'boolean' ? null : arg1
    let isOuterXML = typeof arg1 === 'boolean' ? arg1 : arg2
    const ns = arg3

    // getter
    // ------
    if (content == null || typeof content === 'function') {
      // The default for exports is, that the outerNode is included
      isOuterXML = isOuterXML == null ? true : isOuterXML

      this.storeAffix(true)

      let current: Dom = this // eslint-disable-line

      // An export modifier was passed
      if (typeof content === 'function') {
        current = Dom.adopt<Dom>(current.node.cloneNode(true))

        // If the user wants outerHTML we need to process this node, too
        if (isOuterXML) {
          const result = content(current)
          current = result || current

          // The user does not want this node? Well, then he gets nothing
          if (result === false) {
            return ''
          }
        }

        // Deep loop through all children and apply modifier
        current.eachChild((child) => {
          const result = content(child)
          const next = result || child

          if (result === false) {
            // If modifier returns false, discard node
            child.remove()
          } else if (result && child !== next) {
            // If modifier returns new node, use it
            child.replace(next)
          }
        }, true)
      }

      const element = current.node as Element
      return isOuterXML ? element.outerHTML : element.innerHTML
    }

    // setter
    // ------
    {
      // The default for import is, that the current node is not replaced
      isOuterXML = isOuterXML == null ? false : isOuterXML

      const wrapper = Util.createNode('wrapper', ns || Util.namespaces.html)
      const fragment = Global.document.createDocumentFragment()

      wrapper.innerHTML = content

      for (let i = wrapper.children.length; i > 0; i -= 1) {
        fragment.appendChild(wrapper.firstElementChild!)
      }

      if (isOuterXML) {
        const parent = this.parent()
        this.replace(fragment)
        return parent
      }

      return this.add(fragment)
    }
  }
}

export interface Dom<TElement extends Element = Element>
  extends Transform<TElement> {}

export namespace Dom {
  export const adopt = Adopter.adopt

  export function find<T extends Dom = Dom>(
    selectors: string,
    parent: Element | Document = Global.document,
  ) {
    const elems: T[] = []
    parent
      .querySelectorAll(selectors)
      .forEach((node) => elems.push(adopt<T>(node)))
    return elems
  }

  export function findOne<T extends Dom = Dom>(
    selectors: string,
    parent: Element | Document = Global.document,
  ) {
    return adopt<T>(parent.querySelector(selectors))
  }
}
