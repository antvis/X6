import { defineComponent, h, reactive, isVue3, Vue, PropType } from 'vue-demi'
import { Graph } from '@antv/x6'
import { VueShape } from './node'

let active = false
const items = reactive<{
  [viewId: string]: { cid: string; component: any }
}>({})

export function connect(
  id: string,
  component: any,
  container: HTMLDivElement,
  node: VueShape,
  graph: Graph,
) {
  if (active) {
    const { Teleport, markRaw } = Vue as any

    items[id] = markRaw({
      cid: graph.view.cid,
      component: defineComponent({
        render: () => h(Teleport, { to: container } as any, [h(component)]),
        provide: () => ({
          getNode: () => node,
          getGraph: () => graph,
        }),
      }),
    })
  }
}

export function disconnect(id: string) {
  if (active) {
    delete items[id]
  }
}

export function isActive() {
  return active
}

export function getTeleport(): any {
  if (!isVue3) {
    throw new Error('teleport is only available in Vue3')
  }
  active = true
  const { Fragment } = Vue as any

  return defineComponent({
    props: { graph: { type: Object as PropType<Graph> } },

    setup(props) {
      return () => {
        return h(
          Fragment,
          {},
          Object.keys(items).map((id) =>
            !props.graph || items[id].cid === props.graph.view.cid
              ? h(items[id].component)
              : null,
          ),
        )
      }
    },
  })
}
