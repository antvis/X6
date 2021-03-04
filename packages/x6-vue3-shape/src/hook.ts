import { Graph, FunctionExt } from '@antv/x6'
import { registry, Definition } from './registry'
import { Vue3Shape } from './node'

declare module '@antv/x6/lib/graph/hook' {
  namespace Hook {
    interface IHook {
      getVue3Component(this: Graph, node: Vue3Shape): Definition
    }
  }
  interface Hook {
    getVue3Component(node: Vue3Shape): Definition
  }
}

Graph.Hook.prototype.getVue3Component = function (node: Vue3Shape) {
  const getVue3Component = this.options.getVue3Component

  if (typeof getVue3Component === 'function') {
    const ret = FunctionExt.call(getVue3Component, this.graph, node)
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
