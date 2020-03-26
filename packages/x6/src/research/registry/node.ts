import { Node } from '../core/node'
import { Registry } from './util'

class NodeRegistryClass extends Registry<Node.Defintion> {
  register(
    name: string,
    options: NodeRegistry.DefintionOptions,
    force?: boolean,
  ): Node.Defintion
  register(name: string, def: Node.Defintion, force?: boolean): Node.Defintion
  register(
    name: string,
    options: NodeRegistry.DefintionOptions | Node.Defintion,
    force: boolean = false,
  ): Node.Defintion {
    let def
    if (typeof options === 'function') {
      def = options
    } else {
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

      def = parent.define.call(parent, others)
    }

    return super.register(name, def, force)
  }
}

// tslint:disable-next-line
export const NodeRegistry = new NodeRegistryClass({
  onError(name) {
    throw new Error(`Node with name '${name}' already registered.`)
  },
})

export namespace NodeRegistry {
  export interface DefintionOptions extends Node.DefintionOptions {
    inherit?: string
  }
}
