import { Graph, Node, Registry } from '@antv/x6'

export type VueComponent = {
  template: string
  data?: { [key: string]: any }
  components?: { [key: string]: any }
  computed?: { [key: string]: any }
  methods?: { [key: string]: any }
}

export type Definition =
  | VueComponent
  | ((this: Graph, node: Node) => VueComponent)

export const registry = Registry.create<Definition>({
  type: 'vue componnet',
})

declare module '@antv/x6/lib/graph/graph' {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  namespace Graph {
    let registerVueComponent: typeof registry.register
    let unregisterVueComponent: typeof registry.unregister
  }
}

Graph.registerVueComponent = registry.register
Graph.unregisterVueComponent = registry.unregister
