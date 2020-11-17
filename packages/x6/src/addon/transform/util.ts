import { KeyValue } from '../../types'
import { NodeView } from '../../view/node'

export function notify(
  name: string,
  evt: JQuery.TriggeredEvent,
  view: NodeView,
  args: KeyValue = {},
) {
  if (view) {
    const graph = view.graph
    const e = graph.view.normalizeEvent(evt) as JQuery.MouseDownEvent
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
