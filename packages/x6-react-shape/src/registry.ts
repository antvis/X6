import { Graph, Node, Registry, X6 } from '@antv/x6'

export type Definition =
  | ((this: Graph, node: Node) => React.ReactElement | null | undefined)
  | React.ReactElement

export const registry = Registry.create<Definition>({
  type: 'react componnet',
})

declare module '@antv/x6/lib/global/x6' {
  namespace X6 {
    let registerReactComponent: typeof registry.register
  }
}

X6.registerReactComponent = registry.register
