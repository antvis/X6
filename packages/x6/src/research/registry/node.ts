import { Node } from '../core/node'
import { Registry } from './registry'

export const NodeRegistry = Registry.create<
  Node.Defintion,
  never,
  NodeRegistry.DefintionOptions
>({
  type: 'node',
  process(name, options) {
    if (typeof options === 'function') {
      return options
    }

    let parent = Node
    const { inherit, ...others } = options
    if (inherit) {
      const base = this.get(inherit)
      if (base == null) {
        this.notExistError(inherit, 'inherited')
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
