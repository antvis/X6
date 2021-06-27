import { Component, TemplateRef } from '@angular/core'
import { Graph, Registry } from '@antv/x6'

export type Content = TemplateRef<{}> | Component;

export const registry = Registry.create<Content>({
  type: 'angular componnet',
})

declare module '@antv/x6/lib/graph/graph' {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  namespace Graph {
    let registerAngularContent: typeof registry.register
    let unregisterAngularContent: typeof registry.unregister
  }
}

Graph.registerAngularContent = registry.register
Graph.unregisterAngularContent = registry.unregister
