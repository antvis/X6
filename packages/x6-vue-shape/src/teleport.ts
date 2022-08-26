import { defineComponent, h, reactive, isVue3, Vue } from 'vue-demi'
import { Graph, NodeView, Scheduler } from '@antv/x6'
import { VueShape } from './node'
import { VueShapeView } from './view'

export function useTeleport(uniqViewId: string) {
  if (isVue3) {
    const { Teleport, markRaw, Fragment, VNode, VNodeData } = Vue as any
    const action: any = 'vue'

    const items = reactive<{ [key: string]: any }>({})

    const TeleportContainer = defineComponent({
      setup() {
        return () =>
          h(
            Fragment,
            {},
            Object.keys(items).map((id) => h(items[id])),
          )
      },
    })

    const connect = (
      id: string,
      node: VueShape,
      graph: Graph,
      component: any,
      getContainer: () => HTMLDivElement,
    ) => {
      if (items[id]) {
        // confirmUpdate可能导致多次调用，所以判断一下
        return
      }
      items[id] = markRaw(
        defineComponent({
          render: () =>
            (getContainer()
              ? h(Teleport, { to: getContainer() } as typeof VNodeData, [
                  h(component, { graph, node } as any),
                ])
              : null) as typeof VNode,
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

    class VuePortalShapeView extends NodeView<VueShape> {
      getTargetId() {
        return `${this.graph.view.cid}:${this.cell.id}`
      }
      init() {
        super.init()
        const targetId = this.getTargetId()
        this.cell.on('removed', () => {
          disconnect(targetId)
        })
        this.renderVueComponent()
      }
      renderVueComponent() {
        const targetId = this.getTargetId()
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
          // 参照VueShapeView进行渲染，修复 #2505
          Scheduler.scheduleTask(() => {
            this.renderVueComponent()
          })
        })
      }
      unmount(elem: Element) {
        // 基类调用removeView的时候，会自动调用unmount
        const targetId = this.getTargetId()
        disconnect(targetId)
        super.unmount(elem)
        return this
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
  // 如果是vue2就默认输出一个警告信息
  console.warn('useTeleport should run in vue3')
  // 或者拿默认的view注册一个，保证这个api是可用状态，不至于用户使用了，但是报错
  NodeView.registry.register(uniqViewId, VueShapeView, true)
  return defineComponent(() => null)
}

export default useTeleport
