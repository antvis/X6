import { Graph, FunctionExt } from '@antv/x6'
import { Definition } from './registry'
import { VueShape } from './node'

declare module '@antv/x6/lib/graph/hook' {
  namespace Hook {
    interface IHook {
      getVueComponent(this: Graph, node: VueShape): Definition
    }
  }

  interface Hook {
    getVueComponent(this: Hook, node: VueShape): Definition
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

  const ret = node.getComponent()
  if (typeof ret === 'function') {
    return FunctionExt.call(ret, this.graph, node)
  }

  return ret as Definition
}
