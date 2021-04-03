import { Attrs, Class } from '../../types'
import { Global } from '../../global'
import { DomUtil } from '../../util/dom'
import { Attr } from '../../util/attr'
import { Svg } from '../container/svg'
import { Adopter } from '../adopter'
import { Data } from './data'
import { Event } from './event'
import { Style } from './style'
import { Primer } from './primer'
import { Memory } from './memory'
import { Listener } from './listener'
import { ClassName } from './classname'
import { Transform } from './transform'

@Dom.register('Dom')
@Dom.mixin(Event, ClassName, Style, Data, Memory, Listener, Transform)
export class Dom<TNode extends Node = Node> extends Primer<TNode> {
  first<T extends Dom = Dom>(): T | null {
    return Dom.adopt<T>(this.node.firstChild)
  }

  last<T extends Dom = Dom>(): T | null {
    return Dom.adopt<T>(this.node.lastChild)
  }

  get<T extends Dom = Dom>(index: number): T | null {
    return Dom.adopt<T>(this.node.childNodes[index])
  }

  find<T extends Dom = Dom>(selectors: string): T[] {
    return Dom.find<T>(selectors, DomUtil.toElement(this.node))
  }

  findOne<T extends Dom = Dom>(selectors: string): T | null {
    return Dom.findOne<T>(selectors, DomUtil.toElement(this.node))
  }

  matches(selector: string): boolean {
    const elem = DomUtil.toElement(this.node)
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

  children<T extends Dom>(): T[] {
    const elems: T[] = []
    this.node.childNodes.forEach((node) => {
      elems.push(Dom.adopt<T>(node))
    })
    return elems
  }

  clear() {
    while (this.node.lastChild) {
      this.node.lastChild.remove()
    }
    return this
  }

  clone<T extends Dom>(deep = true): T {
    // write dom data to the dom so the clone can pickup the data
    this.storeAssets()
    // clone element and assign new id
    const ctor = this.constructor as new (node: Node) => T
    // eslint-disable-next-line new-cap
    return new ctor(DomUtil.assignNewId(this.node.cloneNode(deep)))
  }

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

  indexOf(element: Dom): number {
    const children = Array.prototype.slice.call(this.node.childNodes) as Node[]
    return children.indexOf(element.node)
  }

  index(): number {
    const parent: Dom | null = this.parent()
    return parent ? parent.indexOf(this) : -1
  }

  has(element: Dom): boolean {
    return this.indexOf(element) !== -1
  }

  id(): string
  id(id: string | null): this
  id(id?: string | null) {
    const elem = DomUtil.toElement(this.node)

    // generate new id if no id set
    if (typeof id === 'undefined' && !elem.id) {
      elem.id = DomUtil.createNodeId()
    }

    // dont't set directly with this.node.id to make `null` work correctly
    return typeof id === 'undefined' ? this.attr('id') : this.attr('id', id)
  }

  parent<T extends Dom = Dom>(selectors?: string | Class): T | null {
    if (this.node.parentNode == null) {
      return null
    }

    let parent: T | null = Dom.adopt<T>(this.node.parentNode)

    if (selectors == null) {
      return parent
    }

    // loop trough ancestors if type is given
    do {
      if (
        typeof selectors === 'string'
          ? parent.matches(selectors)
          : parent instanceof selectors
      ) {
        return parent
      }
    } while ((parent = Dom.adopt<T>(parent.node.parentNode)))

    return null
  }

  add<T extends Dom>(element: Adopter.Target<T>, index?: number): this {
    const instance = Adopter.makeInstance<T>(element)

    // If non-root svg nodes are added we have to remove their namespaces
    if (instance.isSVGSVGElement()) {
      const svg = Dom.adopt<Svg>(instance.node)
      svg.removeNamespace()
    }

    if (index == null) {
      this.node.appendChild(instance.node)
    } else if (instance.node !== this.node.childNodes[index]) {
      this.node.insertBefore(instance.node, this.node.childNodes[index])
    }

    return this
  }

  append<T extends Dom>(element: Adopter.Target<T>): this {
    return this.add(element)
  }

  prepend<T extends Dom>(element: Adopter.Target<T>): this {
    return this.add(element, 0)
  }

  appendTo<T extends Dom>(parent: Adopter.Target<T>): this {
    return this.addTo(parent)
  }

  addTo<T extends Dom>(parent: Adopter.Target<T>, index?: number): this {
    return Adopter.makeInstance<T>(parent).put(this, index)
  }

  put<T extends Dom>(element: Adopter.Target<T>, index?: number): T {
    const instance = Adopter.makeInstance<T>(element)
    this.add(instance, index)
    return instance
  }

  putIn<T extends Dom>(parent: Adopter.Target<T>, index?: number): T {
    return Adopter.makeInstance<T>(parent).add(this, index)
  }

  element<T extends Dom>(nodeName: string, attrs?: Attrs | null): T {
    const elem = Adopter.makeInstance<T>(nodeName)
    if (attrs) {
      elem.attr(attrs)
    }
    return this.put(elem)
  }

  replace<T extends Dom>(element: Adopter.Target<T>): T {
    const instance = Adopter.makeInstance<T>(element)

    if (this.node.parentNode) {
      this.node.parentNode.replaceChild(instance.node, this.node)
    }

    return instance
  }

  remove() {
    const parent = this.parent()
    if (parent) {
      parent.removeElement(this)
    }

    return this
  }

  removeElement(element: Dom) {
    this.node.removeChild(element.node)
    return this
  }

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

  insertBefore<T extends Dom>(element: Adopter.Target<T>) {
    Adopter.makeInstance(element).before(this)
    return this
  }

  insertAfter<T extends Dom>(element: Adopter.Target<T>) {
    Adopter.makeInstance(element).after(this)
    return this
  }

  siblings<T extends Dom>(): T[]
  siblings<T extends Dom>(selfInclued?: boolean): T[]
  siblings<T extends Dom>(selectors: string, selfInclued?: boolean): T[]
  siblings(selectors?: string | boolean, selfInclued?: boolean) {
    const parent = this.parent()
    const children = parent ? parent.children() : []

    if (selectors == null) {
      return children.filter((child) => child !== this)
    }

    if (typeof selectors === 'boolean') {
      return selectors ? children : children.filter((child) => child !== this)
    }

    return children.filter(
      (child) => child.matches(selectors) && (selfInclued || child !== this),
    )
  }

  next<T extends Dom>(selectors?: string): T | null {
    const parent = this.parent()
    if (parent) {
      const index = this.index()
      const children = parent.children<T>()
      for (let i = index + 1, l = children.length; i < l; i += 1) {
        const next = children[i]
        if (selectors == null || next.matches(selectors)) {
          return next
        }
      }
    }
    return null
  }

  nextAll<T extends Dom>(selectors?: string): T[] {
    const result: T[] = []
    const parent = this.parent()
    if (parent) {
      const index = this.index()
      const children = parent.children<T>()
      for (let i = index + 1, l = children.length; i < l; i += 1) {
        const next = children[i]
        if (selectors == null || next.matches(selectors)) {
          result.push(next)
        }
      }
    }
    return result
  }

  prev<T extends Dom>(selectors?: string): T | null {
    const parent = this.parent()
    if (parent) {
      const index = this.index()
      const children = parent.children<T>()
      for (let i = index - 1; i >= 0; i -= 1) {
        const previous = children[i]
        if (selectors == null || previous.matches(selectors)) {
          return previous
        }
      }
    }

    return null
  }

  prevAll<T extends Dom>(selectors?: string): T[] {
    const result: T[] = []
    const parent = this.parent()
    if (parent) {
      const index = this.index()
      const children = parent.children<T>()
      for (let i = index - 1; i >= 0; i -= 1) {
        const previous = children[i]
        if (selectors == null || previous.matches(selectors)) {
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

  storeAssets() {
    this.eachChild(() => this.storeAssets())
    return this
  }

  toString() {
    return this.id()
  }

  isDocument() {
    return DomUtil.isDocument(this.node)
  }

  isSVGSVGElement() {
    return DomUtil.isSVGSVGElement(this.node)
  }

  isDocumentFragment() {
    return DomUtil.isDocumentFragment(this.node)
  }

  html(): string
  html(outerHTML: boolean): string
  html(process: (dom: Dom) => false | Dom, outerHTML?: boolean): string
  html(content: string, outerHTML?: boolean): string
  html(arg1?: boolean | string | ((dom: Dom) => false | Dom), arg2?: boolean) {
    return this.xml(arg1 as string, arg2, DomUtil.namespaces.html)
  }

  svg(): string
  svg(outerXML: boolean): string
  svg(process: (dom: Dom) => false | Dom, outerXML?: boolean): string
  svg(content: string, outerXML?: boolean): string
  svg(arg1?: boolean | string | ((dom: Dom) => false | Dom), arg2?: boolean) {
    return this.xml(arg1 as string, arg2, DomUtil.namespaces.svg)
  }

  xml(): string
  xml(outerXML: boolean): string
  xml(process: (dom: Dom) => false | Dom, outerXML?: boolean): string
  xml(content: string, outerXML?: boolean, ns?: string): string
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

      this.storeAssets()

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

      const wrapper = DomUtil.createNode('wrapper', ns)
      const fragment = Global.document.createDocumentFragment()

      wrapper.innerHTML = content

      for (let i = wrapper.children.length; i > 0; i -= 1) {
        fragment.append(wrapper.firstElementChild!)
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

export interface Dom<TNode extends Node = Node>
  extends ClassName<TNode>,
    Event<TNode>,
    Style<TNode>,
    Data<TNode>,
    Memory<TNode>,
    Listener<TNode>,
    Transform<TNode> {}

export namespace Dom {
  export function adopt<T extends Dom>(node: Node): T
  export function adopt<T extends Dom>(node?: Node | null): T | null
  export function adopt<T extends Dom>(node?: Node | null) {
    return Adopter.adopt<T>(node)
  }

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

export namespace Dom {
  export const registerAttrHook = Attr.registerHook
  export const registerEventHook = Event.registerHook
  export const registerStyleHook = Style.registerHook
}
