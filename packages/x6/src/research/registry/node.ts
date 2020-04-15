import { Node } from '../core/node'
import { Registry } from './registry'

export const NodeRegistry = new Registry<
  Node.Defintion,
  NodeRegistry.DefintionOptions
>({
  process(name, options) {
    if (typeof options === 'function') {
      return options
    }

    let parent = Node
    const { inherit, ...others } = options
    if (inherit) {
      const base = this.get(inherit)
      if (base == null) {
        throw new Error(`Unkonwn base type: "${inherit}"`)
      } else {
        parent = base
      }
    }

    if (others.name == null) {
      others.name = name
    }

    return parent.define.call(parent, others)
  },
  onError(name) {
    throw new Error(`Node with name '${name}' already registered.`)
  },
})

export namespace NodeRegistry {
  export interface DefintionOptions extends Node.DefintionOptions {
    inherit?: string
  }
}
