import type { Base } from './base'

export namespace Registry {
  export type Definition = { new (...args: any[]): Base }

  let root: Definition
  const cache: Record<string, Definition> = {}

  export function register(
    ctor: Definition,
    name = ctor.name,
    asRoot?: boolean,
  ) {
    cache[name] = ctor

    if (asRoot) {
      root = ctor
    }

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
    if (typeof node === 'string') {
      return cache[node] as TDefinition
    }

    const nodeName = node.nodeName
    // ucfirst
    let className = nodeName.charAt(0).toUpperCase() + nodeName.substring(1)

    if (nodeName === '#document-fragment') {
      className = 'Fragment'
    } else if (!Registry.hasClass(className)) {
      className = node instanceof SVGElement ? 'Vector' : 'Dom'
    }

    return cache[className] as TDefinition
  }

  export function hasClass(name: string) {
    return cache[name] != null
  }

  export function getRoot() {
    return root
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
}
