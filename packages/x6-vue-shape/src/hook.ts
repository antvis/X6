import { Graph, FunctionExt } from '@antv/x6'
import { registry, Definition } from './registry'
import { VueShape } from './node'

declare module '@antv/x6/lib/graph/hook' {
  namespace Hook {
    interface IHook {
      getVueComponent(this: Graph, node: VueShape): Definition
    }
  }

  interface Hook {
    getVueComponent(node: VueShape): Definition
  }
}

Graph.Hook.prototype.getVueComponent = function (node: VueShape) {
  const getVueComponent = this.options.getVueComponent
  if (typeof getVueComponent === 'function') {
    const ret = FunctionExt.call(getVueComponent, this.graph, node)
    if (ret != null) {
      return ret
    }
  }

  let ret = node.getComponent()
  if (typeof ret === 'string') {
    const component = registry.get(ret)
    if (component == null) {
      return registry.onNotFound(ret)
    }
    ret = component
  }

  return ret as Definition
}
