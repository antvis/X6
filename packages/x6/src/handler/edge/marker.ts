import { Graph } from '../../graph'
import { State } from '../../core/state'
import { MouseEventEx } from '../mouse-event'
import { CellMarker } from '../cell-marker'
import { EdgeHandler } from './handler'
import { getConnectionHighlightOptions } from '../connection/option'

export class EdgeMarker extends CellMarker {
  edgeHandler: EdgeHandler

  constructor(graph: Graph, edgeHandler: EdgeHandler) {
    const options = getConnectionHighlightOptions({
      graph,
      cell: edgeHandler.state.cell,
    })
    super(graph, options)
    this.edgeHandler = edgeHandler
  }

  get state() {
    return this.edgeHandler.state
  }

  get currentPoint() {
    return this.edgeHandler.currentPoint
  }

  get isSource() {
    return this.edgeHandler.isSourceHandle
  }

  getCell(e: MouseEventEx) {
    const model = this.graph.getModel()
    let cell = super.getCell(e)

    // Checks for cell at preview point (with grid)
    if (
      (cell === this.state.cell || cell == null) &&
      this.currentPoint != null
    ) {
      cell = this.graph.getCellAt(this.currentPoint.x, this.currentPoint.y)
    }

    // Uses connectable parent node if one exists
    if (cell != null && !this.graph.isCellConnectable(cell)) {
      const parent = model.getParent(cell)
      if (model.isNode(parent) && this.graph.isCellConnectable(parent)) {
        cell = parent
      }
    }

    if (
      (this.graph.isSwimlane(cell) &&
        this.currentPoint != null &&
        this.graph.retrievalManager.hitsSwimlaneContent(
          cell,
          this.currentPoint.x,
          this.currentPoint.y,
        )) ||
      !this.edgeHandler.isConnectableCell(cell) ||
      cell === this.state.cell ||
      (cell != null && !this.graph.edgesConnectable && model.isEdge(cell)) ||
      model.isAncestor(this.state.cell, cell)
    ) {
      cell = null
    }

    if (!this.graph.isCellConnectable(cell)) {
      cell = null
    }

    return cell
  }

  // Sets the highlight color according to validateConnection
  isValidState(state: State) {
    const model = this.graph.getModel()
    const other = this.graph.view.getTerminalPortState(
      state,
      this.graph.view.getState(
        model.getTerminal(this.state.cell, !this.isSource),
      )!,
      !this.isSource,
    )
    const otherCell = other != null ? other.cell : null
    const source = this.isSource ? state.cell : otherCell
    const target = this.isSource ? otherCell : state.cell

    // Updates the error message of the handler
    this.edgeHandler.error = this.edgeHandler.validateConnection(source, target)

    return this.edgeHandler.error == null
  }
}
