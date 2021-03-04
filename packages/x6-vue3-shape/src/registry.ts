import { Graph, Node, Registry } from '@antv/x6'
import { DefineComponent } from 'vue'

export type Definition =
  | JSX.Element
  | DefineComponent
  | ((
      this: Graph,
      node: Node,
    ) => JSX.Element | DefineComponent | null | undefined)

export const registry = Registry.create<Definition>({
  type: 'vue3 component',
})

declare module '@antv/x6/lib/graph/graph' {
  namespace Graph {
    let registerVue3Component: typeof registry.register
    let unregisterVue3Component: typeof registry.unregister
  }
}

Graph.registerVue3Component = registry.register
Graph.unregisterVue3Component = registry.unregister
