import { Class } from '../types'
import { Str } from '../util/str'

export namespace Registry {
  let root: Class
  const cache: Record<string, Class> = {}

  export function register(ctor: Class, name = ctor.name, asRoot?: boolean) {
    cache[name] = ctor

    if (asRoot) {
      root = ctor
    }

    return ctor
  }

  export function getClass<TClass extends Class = Class>(node: Node): TClass
  export function getClass<TClass extends Class = Class>(name: string): TClass
  export function getClass<TClass extends Class = Class>(node: string | Node) {
    if (typeof node === 'string') {
      return cache[node] as TClass
    }

    const nodeName = node.nodeName || 'Dom'
    let className = Str.ucfirst(nodeName)

    if (nodeName === '#document-fragment') {
      className = 'Fragment'
    } else if (
      className === 'LinearGradient' ||
      className === 'RadialGradient'
    ) {
      className = 'Gradient'
    } else if (!Registry.hasClass(className)) {
      className = 'Dom'
    }

    return cache[className] as TClass
  }

  export function hasClass(name: string) {
    return cache[name] != null
  }

  export function getRoot() {
    return root
  }

  export function getTagName(cls: Class) {
    const keys = Object.keys(cache)
    for (let i = 0, l = keys.length; i < l; i += 1) {
      const key = keys[i]
      if (cache[key] === cls) {
        return Str.lcfirst(key)
      }
    }
    return null
  }
}
