import { Graph } from '@antv/x6'
import { registry } from './registry'
import { ReactShape } from './node'

declare module '@antv/x6/lib/graph/hook' {
  namespace Hook {
    interface IHook {
      getReactComponent(
        this: Graph,
        node: ReactShape,
      ): React.Component | null | undefined
    }
  }

  interface Hook {
    getReactComponent(
      this: Hook,
      node: ReactShape,
    ): React.Component | null | undefined
  }
}

Graph.Hook.prototype.getReactComponent = function (node: ReactShape) {
  const getReactComponent = this.options.getReactComponent
  if (typeof getReactComponent === 'function') {
    const ret = getReactComponent.call(this.graph, node)
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

  if (typeof ret === 'function') {
    return ret.call(this.graph, node)
  }

  return ret
}
