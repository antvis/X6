import { ComponentType } from '@angular/cdk/portal';
import { Injector, TemplateRef } from '@angular/core';
import { Graph, Registry } from '@antv/x6';

export type Content = TemplateRef<{}> | ComponentType<any>;

export type ContentArgs = {
  injector: Injector;
  content: Content;
};

export const registry = Registry.create<ContentArgs | (((this: Graph, node: Node) => ContentArgs))>({
  type: 'angular componnet'
});

declare module '@antv/x6/lib/graph/graph' {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  namespace Graph {
    let registerAngularContent: typeof registry.register;
    let unregisterAngularContent: typeof registry.unregister;
  }
}

Graph.registerAngularContent = registry.register;
Graph.unregisterAngularContent = registry.unregister;
