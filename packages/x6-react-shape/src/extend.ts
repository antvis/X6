import { Graph, Renderer, State, Cell } from '@antv/x6'
import { ReactShape } from './shape'

export type Component = React.ReactElement

declare module '@antv/x6/lib/types/style' {
  interface Style {
    component?:
      | ((this: Graph, cell: Cell) => Component | null | undefined)
      | Component
      | null
  }
}

declare module '@antv/x6/lib/graph/hook' {
  interface IHook {
    getReactComponent(this: Graph, cell: Cell): Component | null | undefined
  }
}

declare module '@antv/x6/lib/graph/graph' {
  interface Graph {
    getReactComponent(cell: Cell): Component | null | undefined
  }
}

Graph.prototype.getReactComponent = function(this: Graph, cell: Cell) {
  if (this.options.getReactComponent != null) {
    const ret = this.options.getReactComponent.call(this, cell)
    if (ret != null) {
      return ret
    }
  }
  const style = this.getStyle(cell)
  const ret = style != null ? style.component : null
  if (typeof ret === 'function') {
    return ret.call(this, cell)
  }
  return ret
}

const old = Renderer.prototype.configShape
Renderer.prototype.configShape = function(state: State) {
  old.call(this, state)
  if (state.shape instanceof ReactShape) {
    state.shape.component = state.view.graph.getReactComponent(state.cell)
  }
}
