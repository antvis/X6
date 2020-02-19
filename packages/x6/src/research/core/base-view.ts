import jQuery from 'jquery'
import { KeyValue } from '../../types'
import { globals } from './globals'
import { Basecoat } from '../../entity'
import { v } from '../../v'
import { Attribute } from '../attr'

export abstract class BaseView extends Basecoat {
  public readonly cid: string
  public container: Element

  constructor() {
    super()
    this.cid = Private.uniqueId()
  }

  // tslint:disable-next-line
  $(elem: any) {
    return BaseView.$(elem)
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

export namespace BaseView {
  export interface JsonMarkup {
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

    style?: { [name: string]: string }

    className?: string | string[]

    children?: JsonMarkup[]

    textContent?: string
  }

  export type Markup = string | JsonMarkup | JsonMarkup[]

  export function parseJsonMarkup(
    markup: JsonMarkup | JsonMarkup[],
    options: {
      ns?: string
      bare?: boolean
    } = {
      ns: v.ns.svg,
      bare: false,
    },
  ) {
    const fragment = document.createDocumentFragment()
    const selectors: { [selector: string]: Element | Element[] } = {}
    const groups: { [selector: string]: Element[] } = {}
    const queue: {
      markup: JsonMarkup[]
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
      let ns = item.ns
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

  export function renderStringMarkup(container: Element, markup: string) {
    return v.batch(markup)
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
