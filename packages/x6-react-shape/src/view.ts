import React from 'react'
import ReactDOM from 'react-dom'
import { NodeView, Scheduler } from '@antv/x6'
import { ReactShape } from './node'
import { Portal } from './portal'
import { Wrap } from './wrap'

export class ReactShapeView extends NodeView<ReactShape> {
  protected targetId() {
    return `${this.graph.view.cid}:${this.cell.id}`
  }

  protected init() {
    super.init()
    this.cell.on('removed', () => {
      Portal.disconnect(this.targetId())
    })
  }

  getComponentContainer() {
    return this.cell.prop('useForeignObject') === false
      ? (this.selectors.content as SVGElement)
      : (this.selectors.foContent as HTMLDivElement)
  }

  confirmUpdate(flag: number) {
    const ret = super.confirmUpdate(flag)
    return this.handleAction(ret, ReactShapeView.action, () => {
      if (Scheduler) {
        Scheduler.scheduleTask(() => {
          this.renderReactComponent()
        })
      } else {
        this.renderReactComponent()
      }
    })
  }

  protected renderReactComponent() {
    this.unmountReactComponent()
    const root = this.getComponentContainer()
    const node = this.cell
    const graph = this.graph

    if (root) {
      const component = this.graph.hook.getReactComponent(node)
      const elem = React.createElement(Wrap, { graph, node, component })
      if (Portal.isActive()) {
        Portal.connect(this.targetId(), ReactDOM.createPortal(elem, root))
      } else {
        ReactDOM.render(elem, root)
      }
    }
  }

  protected unmountReactComponent() {
    const root = this.getComponentContainer()
    if (root) {
      ReactDOM.unmountComponentAtNode(root)
    }
    return root
  }

  unmount() {
    Portal.disconnect(this.targetId())
    this.unmountReactComponent()
    super.unmount()
    return this
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

  NodeView.registry.register('react-shape-view', ReactShapeView, true)
}
