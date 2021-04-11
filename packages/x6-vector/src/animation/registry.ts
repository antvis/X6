import type { BaseAnimator } from './base'

export namespace Registry {
  export type Definition = { new (...args: any[]): BaseAnimator }

  const registry: Record<string, Definition> = {}

  export function register(ctor: Definition, name: string) {
    registry[name] = ctor
    return ctor
  }

  export function get<TClass extends Definition = Definition>(node: Node) {
    if (typeof node === 'string') {
      return registry[node] as TClass
    }

    const nodeName = node.nodeName
    let className = nodeName[0].toUpperCase() + nodeName.substring(1)

    if (node instanceof SVGElement) {
      if (registry[className] == null) {
        className = 'SVG'
      }
    } else {
      className = 'HTML'
    }

    return registry[className] as TClass
  }
}
