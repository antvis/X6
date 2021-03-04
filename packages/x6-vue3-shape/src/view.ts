import { NodeView } from '@antv/x6'
import { Vue3Shape } from './node'
import { h, createApp, App } from 'vue'

export class Vue3ShapeView extends NodeView<Vue3Shape> {
  protected init() {
    super.init()
  }

  getComponentContainer() {
    return this.selectors.foContent as HTMLDivElement
  }

  confirmUpdate(flag: number) {
    const ret = super.confirmUpdate(flag)
    return this.handleAction(ret, Vue3ShapeView.action, () =>
      this.renderVue3Component(),
    )
  }

  protected vue3App: App | null = null

  renderVue3Component() {
    // unmount
    this.unMountVue3Component()
    const root = this.getComponentContainer()
    const node = this.cell
    const graph = this.graph

    if (root) {
      const component = this.graph.hook.getVue3Component(node)
      this.vue3App = createApp({
        render() {
          return h(component)
        },
        provide() {
          return {
            getGraph: () => graph,
            getNode: () => node,
          }
        },
      })

      this.vue3App.mount(root)
    }
  }

  protected unMountVue3Component() {
    const root = this.getComponentContainer()
    if (this.vue3App) {
      this.vue3App.unmount()
    }
    return root
  }

  // @NodeView.dispose()
  dispose() {
    // this.unMountVue3Component()
    NodeView.dispose()
    this.unMountVue3Component()
  }
}

export namespace Vue3ShapeView {
  export const action = 'vue3' as any

  Vue3ShapeView.config({
    bootstrap: [action],
    actions: {
      component: action,
    },
  })

  NodeView.registry.register('vue3-shape-view', Vue3ShapeView, true)
}
