import { Point, Rectangle } from '../../geometry'
import { Cell } from '../../core/cell'
import { Graph } from '../../graph'
import { MouseEventEx } from '../mouse-event'
import { MouseHandler } from '../mouse-handler'

export function isValid(handler: MouseHandler, e: MouseEventEx) {
  return (
    handler.isValid(e) && handler.isOnCell(e) && !handler.isMultiTouchEvent(e)
  )
}

export function canMove(handler: MouseHandler, e: MouseEventEx) {
  const graph = handler.graph
  const cell = handler.getCell(e)

  if (cell && graph.isCellsMovable()) {
    const model = graph.model
    const geo = cell.getGeometry()

    // prettier-ignore
    if (
      graph.isCellMovable(cell) &&
      (
        !cell.isEdge() ||
        graph.isDanglingEdgesEnabled() ||
        graph.getSelecedCellCount() > 1 ||
        (geo && geo.points && geo.points.length > 0) ||
        model.getTerminal(cell, true) == null ||
        model.getTerminal(cell, false) == null ||
        (graph.isCloneEvent(e.getEvent()) && graph.isCellsCloneable())
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
  const p = graph.clientToGraph(e)

  return new Point(
    roundLength((p.x - origin.x) / s) * s,
    roundLength((p.y - origin.y) / s) * s,
  )
}

export function getPreviewBounds(
  graph: Graph,
  minimumSize: number,
  cells: Cell[],
) {
  const bounds = getBoundingBox(graph, cells)
  if (bounds != null) {
    // Corrects width and height
    bounds.width = Math.max(0, bounds.width - 1)
    bounds.height = Math.max(0, bounds.height - 1)

    if (bounds.width < minimumSize) {
      const dx = minimumSize - bounds.width
      bounds.x -= dx / 2
      bounds.width = minimumSize
    } else {
      bounds.x = Math.round(bounds.x)
      bounds.width = Math.ceil(bounds.width)
    }

    if (bounds.height < minimumSize) {
      const dy = minimumSize - bounds.height
      bounds.y -= dy / 2
      bounds.height = minimumSize
    } else {
      bounds.y = Math.round(bounds.y)
      bounds.height = Math.ceil(bounds.height)
    }
  }

  return bounds
}

function getBoundingBox(graph: Graph, cells: Cell[]): Rectangle | null {
  let result: Rectangle | null = null
  const model = graph.getModel()
  cells &&
    cells.forEach(cell => {
      if (model.isNode(cell) || model.isEdge(cell)) {
        const state = graph.view.getState(cell)
        if (state) {
          let bbox = state.bounds
          if (model.isNode(cell) && state.shape && state.shape.boundingBox) {
            bbox = state.shape.boundingBox
          }

          if (result == null) {
            result = bbox.clone()
          } else {
            result.add(bbox)
          }
        }
      }
    })

  return result
}
