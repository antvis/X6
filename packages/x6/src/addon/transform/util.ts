import { NodeView } from '../../view/node'

export function notify(
  name: 'node:resized' | 'node:rotated',
  evt: JQuery.MouseUpEvent,
  view: NodeView,
) {
  if (view) {
    const graph = view.graph
    const e = graph.view.normalizeEvent(evt)
    const localPoint = graph.snapToGrid(e.clientX, e.clientY)

    view.notify(name, {
      e,
      view,
      x: localPoint.x,
      y: localPoint.y,
      node: view.cell,
      cell: view.cell,
    })
  }
}
