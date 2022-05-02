import { defineComponent, reactive, h, Teleport, markRaw } from 'vue'
import { Graph, NodeView } from '@antv/x6'
import { VueShape } from './node'

const action: any = 'vue'

export function useTeleport(uniqViewId: string) {
  const items = reactive<{ [key: string]: any }>({})

  const connect = (
    id: string,
    node: VueShape,
    graph: Graph,
    component: any,
    getContainer: () => HTMLDivElement,
  ) => {
    items[id] = markRaw(
      defineComponent({
        render: () =>
          getContainer()
            ? h(Teleport, { to: getContainer() }, h(component as any))
            : null,
        provide: () => ({
          getGraph: () => graph,
          getNode: () => node,
        }),
      }),
    )
  }
  const disconnect = (id: string) => {
    delete items[id]
  }

  const TeleportContainer = defineComponent({
    setup() {
      return () =>
        h(
          'div',
          { style: 'display: none;' },
          Object.keys(items).map((id) => h(items[id])),
        )
    },
  })

  class VuePortalShapeView extends NodeView<VueShape> {
    init() {
      super.init()
      const targetId = `${this.graph.view.cid}:${this.cell.id}`
      this.cell.on('removed', () => {
        disconnect(targetId)
      })
      const component = this.graph.hook.getVueComponent(this.cell)
      // 这里需要将当前View的cell以及graph还有component等对象存储起来给TeleportContainer使用
      connect(
        targetId,
        this.cell,
        this.graph,
        component,
        this.getComponentContainer.bind(this),
      )
    }
    getComponentContainer() {
      return this.cell.prop('useForeignObject') === false
        ? (this.selectors.content as SVGElement)
        : (this.selectors.foContent as HTMLDivElement)
    }
    confirmUpdate(flag: any) {
      const ret = super.confirmUpdate(flag)
      return this.handleAction(ret, action, () => {
        // 这里无需做任何处理，但是，没有这个函数的时候，会卡死...
      })
    }
  }
  VuePortalShapeView.config({
    bootstrap: [action],
    actions: {
      component: action,
    },
  })

  NodeView.registry.register(uniqViewId, VuePortalShapeView, true)

  return TeleportContainer
}
