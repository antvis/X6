import { Graph } from '@antv/x6'

// 将画布上的点转换成相对于 offset parent 的点
export function graphPointToOffsetPoint(
  graph: Graph,
  graphPoint: { x: number; y: number },
  containerElem: HTMLElement,
) {
  if (graph) {
    const point = graph!.localToPage({ x: graphPoint.x, y: graphPoint.y })
    const clientRect = containerElem?.getBoundingClientRect()
    const y = point.y - (clientRect?.y || 0) // ! offset parent 不能是画布容器，否则会影响内部布局，所以 offset parent 在外部，算上上方 toolbar 的高度
    const x = point.x - (clientRect?.x || 0)
    return { x, y }
  }
  return { x: 0, y: 0 }
}
