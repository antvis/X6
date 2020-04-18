import { Edge } from '../core/edge'
import { Registry } from './registry'

export const EdgeRegistry = Registry.create<
  Edge.Defintion,
  never,
  EdgeRegistry.DefintionOptions
>({
  type: 'edge',
  process(name, options) {
    if (typeof options === 'function') {
      return options
    }

    let parent = Edge
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

export namespace EdgeRegistry {
  export interface DefintionOptions extends Edge.DefintionOptions {
    inherit?: string
  }
}
