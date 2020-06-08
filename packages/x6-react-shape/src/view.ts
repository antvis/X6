import React from 'react'
import ReactDOM from 'react-dom'
import { NodeView } from '@antv/x6'
import { ReactShape } from './node'
import { Wrap } from './wrap'

export class ReactShapeView extends NodeView<ReactShape> {
  public reactContainer: HTMLElement

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
    const node = this.cell as ReactShape
    if (root) {
      ReactDOM.render(
        React.createElement(Wrap, { node }, node.getComponent()),
        root,
      )
    }
  }

  protected unmountReactComponent() {
    const root = this.container.querySelector('foreignObject > body > div')
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
