import { Edge } from '../core/edge'
import { Registry } from './util'

class EdgeRegistryClass extends Registry<Edge.Defintion> {
  register(
    name: string,
    options: EdgeRegistry.DefintionOptions,
    force?: boolean,
  ): Edge.Defintion
  register(name: string, def: Edge.Defintion, force?: boolean): Edge.Defintion
  register(
    name: string,
    options: EdgeRegistry.DefintionOptions | Edge.Defintion,
    force: boolean = false,
  ): Edge.Defintion {
    let def
    if (typeof options === 'function') {
      def = options
    } else {
      let parent = Edge
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
export const EdgeRegistry = new EdgeRegistryClass({
  onError(name) {
    throw new Error(`Node with name '${name}' already registered.`)
  },
})

export namespace EdgeRegistry {
  export interface DefintionOptions extends Edge.DefintionOptions {
    inherit?: string
  }
}
