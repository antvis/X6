import { DomUtil } from '../../util/dom'
import { Primer } from './primer'

export class ClassName<TNode extends Node> extends Primer<TNode> {
  classes() {
    const raw = this.attr<string>('class')
    return raw == null ? [] : raw.trim().split(/\s+/)
  }

  hasClass(name: string) {
    return ClassName.has(this.node, name)
  }

  addClass(name: string): this
  addClass(names: string[]): this
  addClass(name: string | string[]) {
    ClassName.add(this.node, Array.isArray(name) ? name.join(' ') : name)
    return this
  }

  removeClass(name: string): this
  removeClass(names: string[]): this
  removeClass(name: string | string[]) {
    ClassName.remove(this.node, Array.isArray(name) ? name.join(' ') : name)
    return this
  }

  toggleClass(name: string, stateValue?: boolean) {
    ClassName.toggle(this.node, name, stateValue)
    return this
  }
}

export namespace ClassName {
  const rclass = /[\t\n\f\r]/g
  const rnotwhite = /\S+/g

  const fillSpaces = (string: string) => ` ${string} `

  const get = (elem: Element) =>
    (elem && elem.getAttribute && elem.getAttribute('class')) || ''

  export function has(elem: Node | null, selector: string | null) {
    if (elem == null || selector == null) {
      return false
    }

    const node = DomUtil.toElement(elem)
    const classNames = fillSpaces(get(node))
    const className = fillSpaces(selector)

    return node.nodeType === 1
      ? classNames.replace(rclass, ' ').includes(className)
      : false
  }

  export function add(
    elem: Node | null,
    selector: ((cls: string) => string) | string | null,
  ): void {
    if (elem == null || selector == null) {
      return
    }

    const node = DomUtil.toElement(elem)
    if (typeof selector === 'function') {
      add(node, selector(get(node)))
      return
    }

    if (typeof selector === 'string' && node.nodeType === 1) {
      const classes = selector.match(rnotwhite) || []
      const oldValue = fillSpaces(get(node)).replace(rclass, ' ')
      let newValue = classes.reduce((memo, cls) => {
        if (!memo.includes(fillSpaces(cls))) {
          return `${memo}${cls} `
        }
        return memo
      }, oldValue)

      newValue = newValue.trim()

      if (oldValue !== newValue) {
        node.setAttribute('class', newValue)
      }
    }
  }

  export function remove(
    elem: Node | null,
    selector?: ((cls: string) => string) | string | null,
  ): void {
    if (elem == null) {
      return
    }

    const node = DomUtil.toElement(elem)
    if (typeof selector === 'function') {
      remove(elem, selector(get(node)))
      return
    }

    if ((!selector || typeof selector === 'string') && elem.nodeType === 1) {
      const classes = (selector || '').match(rnotwhite) || []
      const oldValue = fillSpaces(get(node)).replace(rclass, ' ')
      let newValue = classes.reduce((memo, cls) => {
        const className = fillSpaces(cls)
        if (memo.includes(className)) {
          return memo.replace(className, ' ')
        }

        return memo
      }, oldValue)

      newValue = selector ? newValue.trim() : ''

      if (oldValue !== newValue) {
        node.setAttribute('class', newValue)
      }
    }
  }

  export function toggle(
    elem: Node | null,
    selector: ((cls: string, status?: boolean) => string) | string | null,
    state?: boolean,
  ): void {
    if (elem == null || selector == null) {
      return
    }

    if (state != null && typeof selector === 'string') {
      if (state) {
        add(elem, selector)
      } else {
        remove(elem, selector)
      }
      return
    }

    if (typeof selector === 'function') {
      toggle(elem, selector(get(DomUtil.toElement(elem)), state), state)
      return
    }

    if (typeof selector === 'string') {
      const metches = selector.match(rnotwhite) || []
      metches.forEach((cls) => {
        if (has(elem, cls)) {
          remove(elem, cls)
        } else {
          add(elem, cls)
        }
      })
    }
  }
}
