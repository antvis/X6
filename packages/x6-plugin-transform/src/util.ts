import { Dom, KeyValue } from '@antv/x6-common'
import { NodeView } from '@antv/x6'

export function notify(
  name: string,
  evt: Dom.EventObject,
  view: NodeView,
  args: KeyValue = {},
) {
  if (view) {
    const graph = view.graph
    const e = graph.view.normalizeEvent(evt) as Dom.MouseDownEvent
    const localPoint = graph.snapToGrid(e.clientX, e.clientY)

    view.notify(name, {
      e,
      view,
      node: view.cell,
      cell: view.cell,
      x: localPoint.x,
      y: localPoint.y,
      ...args,
    })
  }
}
