import { FunctionExt } from '@antv/x6-common'
import { Point } from '@antv/x6-geometry'
import { ConnectionStrategy } from '../connection-strategy'
import { Edge } from '../../model/edge'
import { CellView } from '../../view/cell'
import { EdgeView } from '../../view/edge'

export function getAnchor(
  this: EdgeView,
  pos: Point.PointLike,
  terminalView: CellView,
  terminalMagnet: Element,
  type: Edge.TerminalType,
) {
  const end = FunctionExt.call(
    ConnectionStrategy.presets.pinRelative,
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
