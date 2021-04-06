import { Str } from '../util/str'
import type { Animator } from './animator'

export namespace Registry {
  export type Definition = { new (...args: any[]): Animator }

  const registry: Record<string, Definition> = {}

  export function register(ctor: Definition, name: string) {
    registry[name] = ctor
    return ctor
  }

  export function get<TClass extends Definition = Definition>(node: Node) {
    if (typeof node === 'string') {
      return registry[node] as TClass
    }

    let className = Str.ucfirst(node.nodeName)
    if (node instanceof SVGElement) {
      if (className === 'LinearGradient' || className === 'RadialGradient') {
        className = 'Gradient'
      }
      if (registry[className] == null) {
        className = 'SVG'
      }
    } else {
      className = 'HTML'
    }

    return registry[className] as TClass
  }
}
