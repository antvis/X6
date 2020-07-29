import { Point } from '../../geometry'
import { Edge } from '../../model/edge'
import { CellView } from '../../view/cell'
import { EdgeView } from '../../view/edge'
import { ConnectionStrategy } from '../strategy'

export function getAnchor(
  pos: Point.PointLike,
  terminalView: CellView,
  terminalMagnet: Element,
) {
  const end = ConnectionStrategy.presets.pinRelative.call(
    this.paper,
    {},
    terminalView,
    terminalMagnet,
    pos,
    this.model,
  ) as Edge.TerminalCellData
  return end.endpoint
}

export function getViewBBox(view: CellView, quick?: boolean) {
  if (quick) {
    return view.cell.getBBox()
  }

  return view.cell.isEdge()
    ? (view as EdgeView).getConnection()!.bbox()!
    : view.getUnrotatedBBoxOfElement(view.container as SVGElement)
}
