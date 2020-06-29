import { Graph, Node, Registry } from '@antv/x6'

export type Definition =
  | ((this: Graph, node: Node) => React.ReactElement | null | undefined)
  | React.ReactElement

export const registry = Registry.create<Definition>({
  type: 'react componnet',
})

declare module '@antv/x6/lib/graph/graph' {
  namespace Graph {
    let registerReactComponent: typeof registry.register
  }
}

Graph.registerReactComponent = registry.register
