import React, { ReactPortal, version as reactVersion } from 'react'
import ReactDOM, { createPortal } from 'react-dom'
import type { Root, createRoot as CreateRoot } from 'react-dom/client'
import { Dom, NodeView } from '@antv/x6'
import { ReactShape } from './node'
import { Portal } from './portal'
import { Wrap } from './wrap'

const [, major] = /^(\d+)\.\d+\.\d+$/.exec(reactVersion)!
const reactMajor = Number(major)
const isPreEighteen = reactMajor < 18
export class ReactShapeView extends NodeView<ReactShape> {
  root?: Root

  getComponentContainer() {
    return this.selectors.foContent as HTMLDivElement
  }

  confirmUpdate(flag: number) {
    const ret = super.confirmUpdate(flag)
    return this.handleAction(ret, ReactShapeView.action, () => {
      this.renderReactComponent()
    })
  }

  protected renderReactComponent() {
    this.unmountReactComponent()
    const container = this.getComponentContainer()
    const node = this.cell

    if (container) {
      const graph = node.model ? node.model.graph : null
      // Actually in the dnd plugin, this graph is empty,
      // in order to make the external perception type of graph is a graph, rather than graph | null, so hack this.
      const elem = React.createElement(Wrap, { node, graph: graph! })
      if (Portal.isActive()) {
        const portal = createPortal(elem, container) as ReactPortal
        Portal.connect(this.cell.id, portal)
      } else {
        if (isPreEighteen) {
          ReactDOM.render(elem, container)
        } else {
          // eslint-disable-next-line
          const createRoot = require('react-dom/client')
            .createRoot as typeof CreateRoot
          this.root = createRoot(container)
          this.root.render(elem)
        }
      }
    }
  }

  protected unmountReactComponent() {
    const container = this.getComponentContainer()
    if (container) {
      if (isPreEighteen) {
        ReactDOM.unmountComponentAtNode(container)
      } else if (this.root) {
        this.root.unmount()
        this.root = undefined
      }
    }
  }

  onMouseDown(e: Dom.MouseDownEvent, x: number, y: number) {
    const target = e.target as Element
    const tagName = target.tagName.toLowerCase()
    if (tagName === 'input') {
      const type = target.getAttribute('type')
      if (
        type == null ||
        [
          'text',
          'password',
          'number',
          'email',
          'search',
          'tel',
          'url',
        ].includes(type)
      ) {
        return
      }
    }

    super.onMouseDown(e, x, y)
  }

  unmount() {
    if (Portal.isActive()) {
      Portal.disconnect(this.cell.id)
    }
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
