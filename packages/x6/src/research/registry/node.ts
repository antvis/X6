import { Node } from '../core/node'
import { Registry } from './registry'
import { EdgeRegistry } from './edge'

export const NodeRegistry = Registry.create<
  Node.Defintion,
  never,
  NodeRegistry.DefintionOptions
>({
  type: 'node',
  process(name, options) {
    if (EdgeRegistry.exist(name)) {
      throw new Error(`Node with '${name}' was registered by anthor Edge`)
    }

    if (typeof options === 'function') {
      return options
    }

    let parent = Node
    const { inherit, ...others } = options
    if (inherit) {
      const base = this.get(inherit)
      if (base == null) {
        this.onNotFound(inherit, 'inherited')
      } else {
        parent = base
      }
    }

    if (others.name == null) {
      others.name = name
    }

    return parent.define.call(parent, others)
  },
})

export namespace NodeRegistry {
  export interface DefintionOptions extends Node.DefintionOptions {
    inherit?: string
  }
}
