import { FunctionExt } from '../../common'
import type { Point } from '../../geometry'
import type { Edge } from '../../model/edge'
import type { CellView } from '../../view/cell'
import type { EdgeView } from '../../view/edge'
import { connectionStrategyPresets } from '../connection-strategy'

export function getAnchor(
  this: EdgeView,
  pos: Point.PointLike,
  terminalView: CellView,
  terminalMagnet: Element,
  type: Edge.TerminalType,
) {
  const end = FunctionExt.call(
    connectionStrategyPresets.pinRelative,
    this.graph,
    {} as Edge.TerminalCellData,
    terminalView,
    terminalMagnet,
    pos,
    this.cell,
    type,
    {},
  )

  return end.anchor
}

export function getViewBBox(view: CellView, quick?: boolean) {
  if (quick) {
    return view.cell.getBBox()
  }

  return view.cell.isEdge()
    ? (view as EdgeView).getConnection()!.bbox()!
    : view.getUnrotatedBBoxOfElement(view.container as SVGElement)
}
