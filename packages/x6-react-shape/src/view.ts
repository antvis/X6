import React from 'react'
import ReactDOM from 'react-dom'
import { NodeView } from '@antv/x6'
import { ReactShape } from './node'
import { Wrap } from './wrap'

export class ReactShapeView extends NodeView<ReactShape> {
  render() {
    super.render()
    this.renderReactComponent()
    return this
  }

  confirmUpdate(flag: number) {
    const ret = super.confirmUpdate(flag)
    return this.handleAction(ret, ReactShapeView.action, () =>
      this.renderReactComponent(),
    )
  }

  protected renderReactComponent() {
    const root = this.unmountReactComponent()
    const node = this.cell
    const graph = this.graph

    if (root) {
      const component = this.graph.hook.getReactComponent(node)
      ReactDOM.render(
        React.createElement(Wrap, { graph, node, component }),
        root,
      )
    }
  }

  protected unmountReactComponent() {
    const root = this.selectors.container as HTMLDivElement
    if (root) {
      ReactDOM.unmountComponentAtNode(root)
    }
    return root
  }

  @NodeView.dispose()
  dispose() {
    this.unmountReactComponent()
  }
}

export namespace ReactShapeView {
  export const action = 'react' as any

  ReactShapeView.config({
    bootstrap: [action],
    actions: {
      component: action,
    },
  })

  NodeView.registry.register('react-shape-view', ReactShapeView)
}
