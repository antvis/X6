import { NodeView } from '@antv/x6'
import Vue from 'vue'
import { VueShape } from './node'
import { VueComponent } from './registry'
import { isVue2, isVue3, createApp, h, Vue2 } from 'vue-demi'

export class VueShapeView extends NodeView<VueShape> {
  protected init() {
    super.init()
  }

  getComponentContainer() {
    return this.selectors.foContent as HTMLDivElement
  }

  confirmUpdate(flag: number) {
    const ret = super.confirmUpdate(flag)
    return this.handleAction(ret, VueShapeView.action, () =>
      this.renderVueComponent(),
    )
  }

  protected renderVueComponent() {
    this.unmountVueComponent()
    const root = this.getComponentContainer()
    const node = this.cell
    const graph = this.graph

    if (root) {
      const component = this.graph.hook.getVueComponent(node)
      if (isVue2) {
        const div = document.createElement('div')
        div.style.width = '100%'
        div.style.height = '100%'
        let instance = null
        if (typeof component === 'string') {
          div.innerHTML = component
          instance = new Vue2({ el: div })
        } else {
          const { template, ...other } = component as VueComponent
          div.innerHTML = template
          instance = new Vue2({
            el: div,
            provide() {
              return {
                getGraph: () => graph,
                getNode: () => node,
              }
            },
            ...other,
          })
        }
        root.appendChild(instance.$el)
      } else if (isVue3) {
        createApp({
          render() {
            return h(component as any)
          },
          provide() {
            return {
              getGraph: () => graph,
              getNode: () => node,
            }
          },
        }).mount(root)
      }
    }
  }

  protected unmountVueComponent() {
    const root = this.getComponentContainer()
    root.innerHTML = ''
    return root
  }

  @NodeView.dispose()
  dispose() {
    this.unmountVueComponent()
  }
}

export namespace VueShapeView {
  export const action = 'vue' as any

  VueShapeView.config({
    bootstrap: [action],
    actions: {
      component: action,
    },
  })

  NodeView.registry.register('vue-shape-view', VueShapeView, true)
}
