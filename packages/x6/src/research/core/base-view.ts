import jQuery from 'jquery'
import { KeyValue } from '../../types'
import { globals } from './globals'
import { Basecoat } from '../../entity'
import { v, Attributes } from '../../v'

export abstract class BaseView extends Basecoat {
  public readonly cid: string
  public container: Element

  constructor() {
    super()
    this.cid = Private.uniqueId()
  }

  // tslint:disable-next-line
  protected $(elem: Element | Document | JQuery) {
    return jQuery(elem)
  }

  protected getEventNamespace() {
    return `.${globals.prefixCls}-event-${this.cid}`
  }

  protected delegateEvents(events: BaseView.Events) {
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

      let method = events[key]
      if (typeof method === 'string') {
        method = (this as any)[method]
        if (typeof method === 'function') {
          method = (...args: any[]) => (method as Function)(...args)
        }
      }

      if (typeof method === 'function') {
        this.delegateEvent(match[1], match[2], method)
      }
    })

    return this
  }

  protected undelegateEvents() {
    this.$(this.container).off(this.getEventNamespace())
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

  protected addEventListeners(
    elem: Element | Document | JQuery,
    events: BaseView.Events,
    data: KeyValue = {},
  ) {
    if (events == null) {
      return this
    }

    const ns = this.getEventNamespace()
    const $elem = this.$(elem)
    Object.keys(events).forEach(eventName => {
      let method = events[eventName]
      if (typeof method === 'string') {
        method = (this as any)[eventName]
        if (typeof method === 'function') {
          method = (...args: any) => (method as Function)(...args)
        }
      }

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

  protected stopPropagation(e: JQuery.TriggeredEvent) {
    this.eventData(e, { propagationStopped: true })
    return this
  }

  protected isPropagationStopped(e: JQuery.TriggeredEvent) {
    return !!this.eventData(e).propagationStopped
  }

  protected eventData(
    e: JQuery.TriggeredEvent,
    data?: { [key: string]: any },
  ): { [key: string]: any } {
    if (e == null) {
      throw new TypeError('event object required')
    }

    let currentData = e.data
    const key = `__${this.cid}__`

    // get
    if (data == null) {
      if (currentData == null) {
        return {}
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

export namespace BaseView {
  export type Events = KeyValue<string | Function>
}

export namespace BaseView {
  export interface JSONElement {
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

    /**
     * The namespace URI of the element. It defaults to SVG namespace
     * `"http://www.w3.org/2000/svg"`.
     */
    ns?: string

    attrs?: Attributes

    style?: { [name: string]: string }

    className?: string | string[]

    children?: JSONElement[]

    textContent?: string
  }

  export function createElement(tagName: string, isSvgElement: boolean) {
    return isSvgElement
      ? v.createSvgElement(tagName || 'g')
      : (v.createElementNS(tagName || 'div') as HTMLElement)
  }

  export function parseDOMJSON(
    json: JSONElement[],
    options: {
      ns?: string
      bare?: boolean
    } = {
      ns: v.ns.svg,
      bare: false,
    },
  ) {
    const fragment = document.createDocumentFragment()
    const selectors: { [key: string]: Element | Element[] } = {}
    const groups: { [key: string]: Element[] } = {}
    const queue = [json, fragment, options.ns]

    while (queue.length > 0) {
      let ns = queue.pop() as string
      const parentNode = (queue.pop() as any) as Element
      const input = queue.pop() as JSONElement[]
      const defines = Array.isArray(input) ? input : [input]

      defines.forEach(define => {
        // tagName
        const tagName = define.tagName
        if (!tagName) {
          throw new Error('Invalid tagName')
        }

        // ns
        if (define.ns) {
          ns = define.ns
        }

        const node = v.createElementNS(tagName, ns)
        const svg = ns === v.ns.svg

        // attrs
        const attrs = define.attrs
        if (attrs) {
          if (svg) {
            v.attr(node, attrs)
          } else {
            jQuery(node).attr(attrs)
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
          const cls = Array.isArray(className) ? className.join(' ') : className
          node.setAttribute('class', cls)
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
          queue.push(children, node as any, ns)
        }
      })
    }

    return {
      fragment,
      selectors,
      groups,
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
