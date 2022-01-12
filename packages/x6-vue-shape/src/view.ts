import { NodeView, Scheduler } from '@antv/x6'
import { isVue2, isVue3, createApp, h, Vue2 } from 'vue-demi'
import { VueShape } from './node'
import { VueComponent } from './registry'

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
        const div = document.createElement('div')
        div.style.width = '100%'
        div.style.height = '100%'
        if (typeof component === 'string') {
          div.innerHTML = component
          this.vm = new Vue({ el: div })
        } else {
          const { template, ...other } = component as VueComponent
          div.innerHTML = template
          this.vm = new Vue({
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
        root.appendChild(this.vm.$el)
      } else if (isVue3) {
        this.vm = createApp({
          render() {
            return h(component as any)
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
    root.innerHTML = ''
    if (this.vm) {
      isVue2 && this.vm.$destroy()
      isVue3 && this.vm.unmount()
      this.vm = null
    }
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
