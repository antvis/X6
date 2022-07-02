import { NodeView } from '@antv/x6-next'
import { isVue2, isVue3, createApp, h, Vue2 } from 'vue-demi'
import { VueShape } from './node'
import { shapeMaps } from './registry'
import { isActive, connect, disconnect } from './teleport'

export class VueShapeView extends NodeView<VueShape> {
  private vm: any

  getComponentContainer() {
    return this.selectors.foContent as HTMLDivElement
  }

  confirmUpdate(flag: number) {
    const ret = super.confirmUpdate(flag)
    return this.handleAction(ret, VueShapeView.action, () => {
      this.renderVueComponent()
    })
  }

  protected renderVueComponent() {
    this.unmountVueComponent()
    const root = this.getComponentContainer()
    const node = this.cell

    if (root) {
      const { component } = shapeMaps[node.shape]
      if (component) {
        if (isVue2) {
          const Vue = Vue2 as any
          this.vm = new Vue({
            el: root,
            render(h: any) {
              return h(component)
            },
            provide() {
              return {
                getNode: () => node,
              }
            },
          })
        } else if (isVue3) {
          if (isActive()) {
            connect(node.id, component, root, node)
          } else {
            this.vm = createApp({
              render() {
                return h(component)
              },
              provide() {
                return {
                  getNode: () => node,
                }
              },
            })
            this.vm.mount(root)
          }
        }
      }
    }
  }

  protected unmountVueComponent() {
    const root = this.getComponentContainer()
    if (this.vm) {
      isVue2 && this.vm.$destroy()
      isVue3 && this.vm.unmount()
      this.vm = null
    }
    root.innerHTML = ''
    return root
  }

  unmount() {
    if (isActive()) {
      disconnect(this.cell.id)
    }
    this.unmountVueComponent()
    super.unmount()
    return this
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
