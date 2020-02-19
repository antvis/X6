import jQuery from 'jquery'
import { KeyValue } from '../../types'
import { globals } from './globals'
import { Basecoat } from '../../entity'
import { Attribute } from '../attr'
import { v } from '../../v'

export abstract class View extends Basecoat {
  public readonly cid: string
  public container: Element
  protected selectors: View.Selectors

  constructor() {
    super()
    this.cid = Private.uniqueId()
  }

  // tslint:disable-next-line
  $(elem: any) {
    return View.$(elem)
  }

  empty() {
    v.empty(this.container)
    return this
  }

  unmount() {
    v.remove(this.container)
    return this
  }

  remove() {
    this.cleanEventListeners(document)
    this.unmount()
    return this
  }

  addClass(className: string | string[], elem: Element = this.container) {
    this.$(elem).addClass(
      Array.isArray(className) ? className.join(' ') : className,
    )
    return this
  }

  removeClass(className: string | string[], elem: Element = this.container) {
    this.$(elem).removeClass(
      Array.isArray(className) ? className.join(' ') : className,
    )
    return this
  }

  setStyle(
    style: JQuery.PlainObject<string | number>,
    elem: Element = this.container,
  ) {
    this.$(elem).css(style)
    return this
  }

  setAttributes(
    attrs?: Attribute.SimpleAttributes | null,
    elem: Element = this.container,
  ) {
    if (attrs != null && elem != null) {
      if (elem instanceof SVGElement) {
        v.attr(elem, attrs)
      } else {
        this.$(elem).attr(attrs)
      }
    }
    return this
  }

  /**
   * Returns the value of the specified attribute of `node`.
   *
   * If the node does not set a value for attribute, start recursing up
   * the DOM tree from node to lookup for attribute at the ancestors of
   * node. If the recursion reaches CellView's root node and attribute
   * is not found even there, return `null`.
   */
  findAttribute(attrName: string, elem: Element) {
    let current = elem
    while (current && current.nodeType === 1) {
      const value = current.getAttribute(attrName)
      if (value != null) {
        return value
      }

      if (current === this.container) {
        return null
      }

      current = current.parentNode as Element
    }

    return null
  }

  find(
    selector?: string,
    rootElem: Element = this.container,
    selectors: View.Selectors = this.selectors,
  ) {
    if (!selector || selector === '.') {
      return [rootElem]
    }

    if (selectors) {
      const nodes = selectors[selector]
      if (nodes) {
        if (Array.isArray(nodes)) {
          return nodes
        }

        return [nodes]
      }
    }

    if (globals.useCSSSelector) {
      return this.$(rootElem)
        .find(selector)
        .toArray() as Element[]
    }

    return []
  }

  findOne(
    selector?: string,
    rootElem: Element = this.container,
    selectors: View.Selectors = this.selectors,
  ) {
    const nodes = this.find(selector, rootElem, selectors)
    return nodes.length > 0 ? nodes[0] : null
  }

  findByAttribute(attribute: string, elem: Element = this.container) {
    let node = elem
    do {
      const val = node.getAttribute(attribute)
      if ((val != null || node === this.container) && val !== 'false') {
        return node
      }
      node = node.parentNode as Element
    } while (node)

    // If the overall cell has set `magnet === false`, then returns
    // `undefined` to announce there is no magnet found for this cell.
    // This is especially useful to set on cells that have 'ports'.
    // In this case, only the ports have set `magnet === true` and the
    // overall element has `magnet === false`.
    return undefined
  }

  getSelector(elem: Element, prevSelector?: string): string | undefined {
    let selector

    if (elem === this.container) {
      if (typeof prevSelector === 'string') {
        selector = `> ${prevSelector}`
      }
      return selector
    }

    if (elem) {
      const nth = v.index(elem) + 1
      selector = `${elem.tagName}:nth-child(${nth})`
      if (prevSelector) {
        selector += ` > ${prevSelector}`
      }

      selector = this.getSelector(elem.parentNode as Element, selector)
    }

    return selector
  }

  protected delegateEvents(events: View.Events) {
    if (events == null) {
      return this
    }

    this.undelegateEvents()

    const splitter = /^(\S+)\s*(.*)$/
    Object.keys(events).forEach(key => {
      const match = key.match(splitter)
      if (match == null) {
        return
      }

      const method = this.getEventHandler(events[key])
      if (typeof method === 'function') {
        this.delegateEvent(match[1], match[2], method)
      }
    })

    return this
  }

  protected delegateEvent(eventName: string, selector: string, listener: any) {
    this.$(this.container).on(
      eventName + this.getEventNamespace(),
      selector,
      listener,
    )
    return this
  }

  protected undelegateEvent(
    eventName: string,
    selector: string,
    listener: any,
  ) {
    this.$(this.container).off(
      eventName + this.getEventNamespace(),
      selector,
      listener,
    )
    return this
  }

  protected undelegateEvents() {
    this.$(this.container).off(this.getEventNamespace())
    return this
  }

  protected addEventListeners(
    elem: Element | Document | JQuery,
    events: View.Events,
    data?: KeyValue,
  ) {
    if (events == null) {
      return this
    }

    const ns = this.getEventNamespace()
    const $elem = this.$(elem)
    Object.keys(events).forEach(eventName => {
      const method = this.getEventHandler(events[eventName])
      if (typeof method === 'function') {
        $elem.on(eventName + ns, data, method as any)
      }
    })

    return this
  }

  protected cleanEventListeners(elem: Element | Document | JQuery) {
    if (elem != null) {
      $(elem).off(this.getEventNamespace())
    }
    return this
  }

  protected getEventNamespace() {
    return `.${globals.prefixCls}-event-${this.cid}`
  }

  protected getEventHandler(handler: string | Function) {
    let method: Function | undefined
    if (typeof handler === 'string') {
      const fn = (this as any)[handler]
      if (typeof fn === 'function') {
        method = (...args: any) => fn(...args)
      }
    } else {
      method = handler
    }

    return method
  }

  protected getEventTarget(
    e: JQuery.TriggeredEvent,
    options: { fromPoint?: boolean } = {},
  ) {
    // Touchmove/Touchend event's target is not reflecting the element
    // under the coordinates as mousemove does.
    // It holds the element when a touchstart triggered.
    const { target, type, clientX = 0, clientY = 0 } = e
    if (options.fromPoint || type === 'touchmove' || type === 'touchend') {
      return document.elementFromPoint(clientX, clientY)
    }

    return target
  }

  protected stopPropagation(e: JQuery.TriggeredEvent) {
    this.addEventData(e, { propagationStopped: true })
    return this
  }

  protected isPropagationStopped(e: JQuery.TriggeredEvent) {
    return this.getEventData(e).propagationStopped === true
  }

  protected getEventData<T extends KeyValue>(e: JQuery.TriggeredEvent): T {
    return this.eventData<T>(e)
  }

  protected addEventData<T extends KeyValue>(
    e: JQuery.TriggeredEvent,
    data: T,
  ): T {
    return this.eventData(e, data)
  }

  protected eventData<T extends KeyValue>(
    e: JQuery.TriggeredEvent,
    data?: T,
  ): T {
    if (e == null) {
      throw new TypeError('Event object required')
    }

    let currentData = e.data
    const key = `__${this.cid}__`

    // get
    if (data == null) {
      if (currentData == null) {
        return {} as T
      }
      return currentData[key] || {}
    }

    // set
    if (currentData == null) {
      currentData = e.data = {}
    }

    if (currentData[key] == null) {
      currentData[key] = { ...data }
    } else {
      currentData[key] = { ...currentData[key], ...data }
    }

    return currentData[key]
  }
}

export namespace View {
  export type Events = KeyValue<string | Function>
}

export namespace View {
  // tslint:disable-next-line
  export function $(elem: any) {
    return jQuery(elem)
  }

  export function createElement(tagName?: string, isSvgElement?: boolean) {
    return isSvgElement
      ? v.createSvgElement(tagName || 'g')
      : (v.createElementNS(tagName || 'div') as HTMLElement)
  }
}

export namespace View {
  export interface JSONMarkup {
    /**
     * The namespace URI of the element. It defaults to SVG namespace
     * `"http://www.w3.org/2000/svg"`.
     */
    ns?: string

    /**
     * The type of element to be created.
     */
    tagName: string

    /**
     * A unique selector for targeting the element within the `attr`
     * cell attribute.
     */
    selector?: string

    /**
     * A selector for targeting multiple elements within the `attr`
     * cell attribute. The group selector name must not be the same
     * as an existing selector name.
     */
    groupSelector?: string | string[]

    attrs?: Attribute.SimpleAttributes

    style?: JQuery.PlainObject<string | number>

    className?: string | string[]

    children?: JSONMarkup[]

    textContent?: string
  }

  export type Markup = string | JSONMarkup | JSONMarkup[]

  export type Selectors = { [selector: string]: Element | Element[] }

  export interface TransformData {
    x?: number
    y?: number
    angle?: number
  }

  export function parseJSONMarkup(
    markup: JSONMarkup | JSONMarkup[],
    options: {
      ns?: string
      bare?: boolean
    } = {
      ns: v.ns.svg,
      bare: false,
    },
  ) {
    const fragment = document.createDocumentFragment()
    const selectors: Selectors = {}
    const groups: { [selector: string]: Element[] } = {}
    const queue: {
      markup: JSONMarkup[]
      parentNode: Element | DocumentFragment
      ns?: string
    }[] = [
      {
        markup: Array.isArray(markup) ? markup : [markup],
        parentNode: fragment,
        ns: options.ns,
      },
    ]

    while (queue.length > 0) {
      const item = queue.pop()!
      let ns = item.ns || v.ns.svg
      const defines = item.markup
      const parentNode = item.parentNode

      defines.forEach(define => {
        // tagName
        const tagName = define.tagName
        if (!tagName) {
          throw new TypeError('Invalid tagName')
        }

        // ns
        if (define.ns) {
          ns = define.ns
        }

        const svg = ns === v.ns.svg
        const node = ns
          ? v.createElementNS(tagName, ns)
          : v.createElement(tagName)

        // attrs
        const attrs = define.attrs
        if (attrs) {
          if (svg) {
            v.attr(node, attrs)
          } else {
            $(node).attr(attrs)
          }
        }

        // style
        const style = define.style
        if (style) {
          $(node).css(style)
        }

        // classname
        const className = define.className
        if (className != null) {
          node.setAttribute(
            'class',
            Array.isArray(className) ? className.join(' ') : className,
          )
        }

        // textContent
        if (define.textContent) {
          node.textContent = define.textContent
        }

        // selector
        const selector = define.selector
        if (selector != null) {
          if (selectors[selector]) {
            throw new TypeError('Selector must be unique')
          }

          selectors[selector] = node

          if (!options.bare) {
            node.setAttribute('x6-selector', selector)
          }
        }

        // group
        if (define.groupSelector) {
          let nodeGroups = define.groupSelector
          if (!Array.isArray(nodeGroups)) {
            nodeGroups = [nodeGroups]
          }

          nodeGroups.forEach(name => {
            if (!groups[name]) {
              groups[name] = []
            }
            groups[name].push(node)
          })
        }

        for (const group in groups) {
          if (selectors[group]) {
            throw new Error('Invalid group selector')
          }
          selectors[group] = groups[group]
        }

        parentNode.appendChild(node)

        // children
        const children = define.children
        if (Array.isArray(children)) {
          queue.push({ ns, markup: children, parentNode: node })
        }
      })
    }

    return {
      fragment,
      selectors,
      groups,
    }
  }

  function createContainer(firstChild: Element) {
    return firstChild instanceof SVGElement
      ? v.createSvgElement('g')
      : v.createElement('div')
  }

  export function renderMarkup(markup: Markup) {
    if (typeof markup === 'string') {
      const nodes = v.batch(markup)
      const count = nodes.length

      if (count === 1) {
        return {
          elem: nodes[0].node as Element,
        }
      }

      if (count > 1) {
        const elem = createContainer(nodes[0].node)
        nodes.forEach(node => {
          elem.appendChild(node.node)
        })

        return { elem }
      }

      return {}
    }

    {
      const result = parseJSONMarkup(markup)
      const fragment = result.fragment
      let elem: Element | null = null
      if (fragment.childNodes.length > 1) {
        elem = createContainer(fragment.firstChild as Element)
        elem.appendChild(fragment)
      } else {
        elem = fragment.firstChild as Element
      }

      return { elem, selectors: result.selectors }
    }
  }
}

namespace Private {
  let counter = 0
  export function uniqueId() {
    const id = `v${counter}`
    counter += 1
    return id
  }
}
