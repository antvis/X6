import { FunctionExt, Graph } from '@antv/x6';
import { ContentArgs, registry } from './registry';
import { AngularShape } from './node';

declare module '@antv/x6/lib/graph/hook' {
  namespace Hook {
    interface IHook {
      getAngularContent(this: Graph, node: AngularShape): ContentArgs;
    }
  }

  interface Hook {
    getAngularContent(node: AngularShape): ContentArgs;
  }
}

Graph.Hook.prototype.getAngularContent = function (node: AngularShape) {
  let name = node.getComponentName();
  if (!name) {
    throw new Error(`x6-angular-shape: You have to pass param 'componentName'!`);
  }
  const content = registry.get(name);
  if (content == null) {
    return registry.onNotFound(name);
  } else if (typeof content === 'function') {
    const contentArgs = FunctionExt.call(content, this.graph, node as any);
    return contentArgs;
  }
  return content;
};
