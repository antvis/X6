import { Edge } from '../core/edge'
import { Registry } from './registry'
import { NodeRegistry } from './node'

export const EdgeRegistry = Registry.create<
  Edge.Defintion,
  never,
  EdgeRegistry.Config
>({
  type: 'edge',
  process(name, options) {
    if (NodeRegistry.exist(name)) {
      throw new Error(`Edge with '${name}' was registered by anthor Node`)
    }

    if (typeof options === 'function') {
      return options
    }

    let parent = Edge
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

export namespace EdgeRegistry {
  export interface Config extends Edge.Config {
    inherit?: string
  }
}
