import * as util from '../util'
import { Cell } from '../core'
import { Point } from '../struct'
import { MouseEventEx } from '../common'
import { MouseHandler } from './handler-mouse'

export function canMove0(handler: MouseHandler, e: MouseEventEx) {
  return (
    handler.isValid(e) &&
    handler.isOnCell(e) &&
    !handler.isMultiTouchEvent(e)
  )
}

export function canMove1(handler: MouseHandler, e: MouseEventEx) {
  const graph = handler.graph
  const cell = handler.getCell(e)

  if (cell && graph.isCellsMovable()) {
    const model = graph.model
    const geo = cell.getGeometry()

    if (
      graph.isCellMovable(cell) &&
      (
        graph.isDanglingEdgesEnabled()
        ||
        (
          !cell.isEdge() ||
          graph.getSelecedCellCount() > 1 ||
          (geo && geo.points && geo.points.length > 0) ||
          model.getTerminal(cell, true) == null ||
          model.getTerminal(cell, false) == null
        )
        ||
        (
          graph.isCloneEvent(e.getEvent()) &&
          graph.isCellsCloneable()
        )
      )
    ) {
      return true
    }
  }

  return false
}

export function getCells(handler: MouseHandler, cell: Cell, e: MouseEventEx) {
  const graph = handler.graph
  if (
    !graph.isCellSelected(cell) &&
    graph.isCellMovable(cell) &&
    !graph.isToggleEvent(e.getEvent())
  ) {
    return [cell]
  }

  // cell is selected before mouse-down, so return all moveable
  // cells in selection.
  return graph.getMovableCells(graph.getSelectedCells())
}

export function roundLength(len: number) {
  return Math.round(len * 2) / 2
}

export function getDelta(
  handler: MouseHandler,
  origin: Point,
  e: MouseEventEx,
) {
  const graph = handler.graph
  const s = graph.view.scale
  const p = util.clientToGraph(graph.container, e)

  return new Point(
    roundLength((p.x - origin.x) / s) * s,
    roundLength((p.y - origin.y) / s) * s,
  )
}
