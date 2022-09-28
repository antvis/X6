import { ObjectExt, Dom, Vector, KeyValue, Nilable } from '@antv/x6-common'
import { Attr } from '../registry'

export type Markup = string | Markup.JSONMarkup | Markup.JSONMarkup[]

// eslint-disable-next-line
export namespace Markup {
  export type Selectors = KeyValue<Element | Element[]>

  export interface JSONMarkup {
    /**
     * The namespace URI of the element. It defaults to SVG namespace
     * `"http://www.w3.org/2000/svg"`.
     */
    ns?: string | null

    /**
     * The type of element to be created.
     */
    tagName: string

    /**
     * A unique selector for targeting the element within the `attr`
     * cell attribute.
     */
    selector?: string | null

    /**
     * A selector for targeting multiple elements within the `attr`
     * cell attribute. The group selector name must not be the same
     * as an existing selector name.
     */
    groupSelector?: string | string[] | null

    attrs?: Attr.SimpleAttrs

    style?: Record<string, string | number>

    className?: string | string[]

    children?: JSONMarkup[]

    textContent?: string
  }

  export interface ParseResult {
    fragment: DocumentFragment
    selectors: Selectors
    groups: KeyValue<Element[]>
  }
}

// eslint-disable-next-line
export namespace Markup {
  export function isJSONMarkup(markup?: Nilable<Markup>) {
    return markup != null && !isStringMarkup(markup)
  }

  export function isStringMarkup(markup?: Nilable<Markup>): markup is string {
    return markup != null && typeof markup === 'string'
  }

  export function clone(markup?: Nilable<Markup>) {
    return markup == null || isStringMarkup(markup)
      ? markup
      : ObjectExt.cloneDeep(markup)
  }

  /**
   * Removes blank space in markup to prevent create empty text node.
   */
  export function sanitize(markup: string) {
    return `${markup}`
      .trim()
      .replace(/[\r|\n]/g, ' ')
      .replace(/>\s+</g, '><')
  }

  export function parseJSONMarkup(
    markup: JSONMarkup | JSONMarkup[],
    options: { ns?: string } = { ns: Dom.ns.svg },
  ): ParseResult {
    const fragment = document.createDocumentFragment()
    const groups: KeyValue<Element[]> = {}
    const selectors: Selectors = {}

    const queue: {
      markup: JSONMarkup[]
      parent: Element | DocumentFragment
      ns?: string
    }[] = [
      {
        markup: Array.isArray(markup) ? markup : [markup],
        parent: fragment,
        ns: options.ns,
      },
    ]

    while (queue.length > 0) {
      const item = queue.pop()!
      let ns = item.ns || Dom.ns.svg
      const defines = item.markup
      const parentNode = item.parent

      defines.forEach((define) => {
        // tagName
        const tagName = define.tagName
        if (!tagName) {
          throw new TypeError('Invalid tagName')
        }

        // ns
        if (define.ns) {
          ns = define.ns
        }

        const node = ns
          ? Dom.createElementNS(tagName, ns)
          : Dom.createElement(tagName)

        // attrs
        const attrs = define.attrs
        if (attrs) {
          Dom.attr(node, Dom.kebablizeAttrs(attrs))
        }

        // style
        const style = define.style
        if (style) {
          Dom.css(node, style)
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
        }

        // group
        if (define.groupSelector) {
          let nodeGroups = define.groupSelector
          if (!Array.isArray(nodeGroups)) {
            nodeGroups = [nodeGroups]
          }

          nodeGroups.forEach((name) => {
            if (!groups[name]) {
              groups[name] = []
            }
            groups[name].push(node)
          })
        }

        parentNode.appendChild(node)

        // children
        const children = define.children
        if (Array.isArray(children)) {
          queue.push({ ns, markup: children, parent: node })
        }
      })
    }

    Object.keys(groups).forEach((groupName) => {
      if (selectors[groupName]) {
        throw new Error('Ambiguous group selector')
      }
      selectors[groupName] = groups[groupName]
    })

    return { fragment, selectors, groups }
  }

  function createContainer(firstChild: Element) {
    return firstChild instanceof SVGElement
      ? Dom.createSvgElement('g')
      : Dom.createElement('div')
  }

  export function renderMarkup(markup: Markup): {
    elem?: Element
    selectors?: Selectors
  } {
    if (isStringMarkup(markup)) {
      const nodes = Vector.createVectors(markup)
      const count = nodes.length

      if (count === 1) {
        return {
          elem: nodes[0].node as Element,
        }
      }

      if (count > 1) {
        const elem = createContainer(nodes[0].node)
        nodes.forEach((node) => {
          elem.appendChild(node.node)
        })

        return { elem }
      }

      return {}
    }

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

  export function parseLabelStringMarkup(markup: string) {
    const children = Vector.createVectors(markup)
    const fragment = document.createDocumentFragment()
    for (let i = 0, n = children.length; i < n; i += 1) {
      const currentChild = children[i].node
      fragment.appendChild(currentChild)
    }

    return { fragment, selectors: {} }
  }
}

// eslint-disable-next-line
export namespace Markup {
  export function getSelector(
    elem: Element,
    stop: Element,
    prev?: string,
  ): string | undefined {
    if (elem != null) {
      let selector
      const tagName = elem.tagName.toLowerCase()

      if (elem === stop) {
        if (typeof prev === 'string') {
          selector = `> ${tagName} > ${prev}`
        } else {
          selector = `> ${tagName}`
        }
        return selector
      }

      const parent = elem.parentNode
      if (parent && parent.childNodes.length > 1) {
        const nth = Dom.index(elem) + 1
        selector = `${tagName}:nth-child(${nth})`
      } else {
        selector = tagName
      }

      if (prev) {
        selector += ` > ${prev}`
      }

      return getSelector(elem.parentNode as Element, stop, selector)
    }

    return prev
  }
}

// eslint-disable-next-line
export namespace Markup {
  export function getPortContainerMarkup(): Markup {
    return 'g'
  }

  export function getPortMarkup(): Markup {
    return {
      tagName: 'circle',
      selector: 'circle',
      attrs: {
        r: 10,
        fill: '#FFFFFF',
        stroke: '#000000',
      },
    }
  }

  export function getPortLabelMarkup(): Markup {
    return {
      tagName: 'text',
      selector: 'text',
      attrs: {
        fill: '#000000',
      },
    }
  }
}

// eslint-disable-next-line
export namespace Markup {
  export function getEdgeMarkup(): Markup {
    return [
      {
        tagName: 'path',
        selector: 'wrap',
        groupSelector: 'lines',
        attrs: {
          fill: 'none',
          cursor: 'pointer',
          stroke: 'transparent',
          strokeLinecap: 'round',
        },
      },
      {
        tagName: 'path',
        selector: 'line',
        groupSelector: 'lines',
        attrs: {
          fill: 'none',
          pointerEvents: 'none',
        },
      },
    ]
  }
}

// eslint-disable-next-line
export namespace Markup {
  export function getForeignObjectMarkup(bare = false): Markup.JSONMarkup {
    return {
      tagName: 'foreignObject',
      selector: 'fo',
      children: [
        {
          ns: Dom.ns.xhtml,
          tagName: 'body',
          selector: 'foBody',
          attrs: {
            xmlns: Dom.ns.xhtml,
          },
          style: {
            width: '100%',
            height: '100%',
            background: 'transparent',
          },
          children: bare
            ? []
            : [
                {
                  tagName: 'div',
                  selector: 'foContent',
                  style: {
                    width: '100%',
                    height: '100%',
                  },
                },
              ],
        },
      ],
    }
  }
}
