import { NodeView, Scheduler } from '@antv/x6'
import { isVue2, isVue3, createApp, h, Vue2 } from 'vue-demi'
import { VueShape } from './node'

export class VueShapeView extends NodeView<VueShape> {
  private vm: any

  protected init() {
    super.init()
  }

  getComponentContainer() {
    return this.selectors.foContent as HTMLDivElement
  }

  confirmUpdate(flag: number) {
    const ret = super.confirmUpdate(flag)
    return this.handleAction(ret, VueShapeView.action, () => {
      Scheduler.scheduleTask(() => {
        this.renderVueComponent()
      })
    })
  }

  protected renderVueComponent() {
    this.unmountVueComponent()
    const root = this.getComponentContainer()
    const node = this.cell
    const graph = this.graph

    if (root) {
      const component = this.graph.hook.getVueComponent(node)
      if (isVue2) {
        const Vue = Vue2 as any
        if (typeof component === 'string') {
          this.vm = new Vue({ template: component })
        } else {
          this.vm = new Vue({
            render() {
              // 保留之前的provide，增加传递graph和node
              return h(component as any, { graph, node } as any)
            },
            provide() {
              return {
                getGraph: () => graph,
                getNode: () => node,
              }
            },
          })
        }
        this.vm.$mount(root)
      } else if (isVue3) {
        this.vm = createApp({
          render() {
            // 保留之前的provide，增加传递graph和node
            return h(component as any, { graph, node } as any)
          },
          provide() {
            return {
              getGraph: () => graph,
              getNode: () => node,
            }
          },
        })
        this.vm.mount(root)
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
