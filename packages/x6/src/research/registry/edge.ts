import { Edge } from '../core/edge'
import { Registry } from './registry'

export const EdgeRegistry = new Registry<
  Edge.Defintion,
  EdgeRegistry.DefintionOptions
>({
  process(name, options) {
    if (typeof options === 'function') {
      return options
    }

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

    return parent.define.call(parent, others)
  },
  onError(name) {
    throw new Error(`Node with name '${name}' already registered.`)
  },
})

export namespace EdgeRegistry {
  export interface DefintionOptions extends Edge.DefintionOptions {
    inherit?: string
  }
}
