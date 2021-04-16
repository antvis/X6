import type { Base } from './base'

export namespace Registry {
  export type Definition = { new (...args: any[]): Base }

  const cache: Record<string, Definition> = {}

  export function register(ctor: Definition, name = ctor.name) {
    cache[name] = ctor

    return ctor
  }

  export function getClass<TDefinition extends Definition = Definition>(
    node: Node,
  ): TDefinition
  export function getClass<TDefinition extends Definition = Definition>(
    name: string,
  ): TDefinition
  export function getClass<TDefinition extends Definition = Definition>(
    node: string | Node,
  ) {
    let className: string
    if (typeof node === 'string') {
      className = node
    } else {
      const nodeName = node.nodeName
      if (nodeName === '#document-fragment') {
        className = 'Fragment'
      } else {
        className = nodeName
      }
    }

    const keys = Object.keys(cache)
    let key = keys.find((k) => k.toLowerCase() === className.toLowerCase())
    if (key == null) {
      if (typeof node === 'string') {
        key = 'Dom'
      } else {
        key = node instanceof SVGElement ? 'Vector' : 'Dom'
      }
    }

    return cache[key] as TDefinition
  }

  export function getTagName(cls: Definition) {
    const keys = Object.keys(cache)
    for (let i = 0, l = keys.length; i < l; i += 1) {
      const key = keys[i]
      if (cache[key] === cls) {
        // lcfirst
        return key.charAt(0).toLowerCase() + key.substring(1)
      }
    }
    return null
  }

  export function isRegisted(tagName: string) {
    const lower = tagName.toLowerCase()
    const keys = Object.keys(cache)
    return keys.some((key) => key.toLowerCase() === lower)
  }
}
