import { Base } from '../common/base'

export class ClassName<TElement extends Element> extends Base<TElement> {
  classes() {
    const raw = ClassName.get(this.node)
    return ClassName.split(raw)
  }

  hasClass(name: string) {
    if (name == null || name.length === 0) {
      return false
    }

    return ClassName.split(name).every((name) => ClassName.has(this.node, name))
  }

  addClass(name: string): this
  addClass(names: string[]): this
  addClass(hook: (old: string) => string): this
  addClass(name: string | string[] | ((old: string) => string)) {
    ClassName.add(this.node, Array.isArray(name) ? name.join(' ') : name)
    return this
  }

  removeClass(): this
  removeClass(name: string): this
  removeClass(names: string[]): this
  removeClass(hook: (old: string) => string): this
  removeClass(name?: string | string[] | ((old: string) => string)) {
    ClassName.remove(this.node, Array.isArray(name) ? name.join(' ') : name)
    return this
  }

  toggleClass(name: string): this
  toggleClass(name: string, stateValue: boolean): this
  toggleClass(
    hook: (old: string, status?: boolean) => string,
    stateValue?: boolean,
  ): this
  toggleClass(
    name: string | ((old: string, status?: boolean) => string),
    stateValue?: boolean,
  ) {
    ClassName.toggle(this.node, name, stateValue)
    return this
  }
}

export namespace ClassName {
  const rclass = /[\t\n\f\r]/g
  const rnotwhite = /\S+/g

  const fillSpaces = (string: string) => ` ${string} `

  export function split(name: string) {
    return name
      .split(/\s+/)
      .map((name) => name.trim())
      .filter((name) => name.length > 0)
      .sort()
  }

  export function get<TElement extends Element>(node: TElement) {
    return (node && node.getAttribute && node.getAttribute('class')) || ''
  }

  export function has<TElement extends Element>(
    node: TElement | null | undefined,
    selector: string | null | undefined,
  ) {
    if (node == null || selector == null) {
      return false
    }

    const classNames = fillSpaces(get(node))
    const className = fillSpaces(selector)

    return node.nodeType === 1
      ? classNames.replace(rclass, ' ').includes(className)
      : false
  }

  export function add<TElement extends Element>(
    node: TElement | null | undefined,
    selector: ((cls: string) => string) | string | null | undefined,
  ): void {
    if (node == null || selector == null) {
      return
    }

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

  export function remove<TElement extends Element>(
    node: TElement | null | undefined,
    selector?: ((cls: string) => string) | string | null | undefined,
  ): void {
    if (node == null) {
      return
    }

    if (typeof selector === 'function') {
      remove(node, selector(get(node)))
      return
    }

    if ((!selector || typeof selector === 'string') && node.nodeType === 1) {
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

  export function toggle<TElement extends Element>(
    node: TElement | null | undefined,
    selector:
      | ((cls: string, status?: boolean) => string)
      | string
      | null
      | undefined,
    state?: boolean,
  ): void {
    if (node == null || selector == null) {
      return
    }

    if (state != null && typeof selector === 'string') {
      if (state) {
        add(node, selector)
      } else {
        remove(node, selector)
      }
      return
    }

    if (typeof selector === 'function') {
      toggle(node, selector(get(node), state), state)
      return
    }

    if (typeof selector === 'string') {
      const metches = selector.match(rnotwhite) || []
      metches.forEach((cls) => {
        if (has(node, cls)) {
          remove(node, cls)
        } else {
          add(node, cls)
        }
      })
    }
  }
}
