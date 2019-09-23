import { Graph, State } from '../core'
import { CellMarker } from './cell-marker'
import { ConnectionHandler } from './connection-handler'
import { getConnectionHighlightOptions, getConnectionIcon } from '../option'
import { MouseEventEx } from '../common'

export class ConnectionHandlerMarker extends CellMarker {
  handler: ConnectionHandler

  constructor(graph: Graph, handler: ConnectionHandler) {
    const options = getConnectionHighlightOptions({
      graph,
    })
    super(graph, options)
    this.handler = handler
  }

  getCell(e: MouseEventEx) {
    let cell = super.getCell(e)

    this.handler.error = null

    // Checks for cell at preview point (with grid)
    const currentPoint = this.handler.currentPoint
    if (cell == null && currentPoint != null) {
      cell = this.graph.getCellAt(currentPoint.x, currentPoint.y)
    }

    // Uses connectable parent node if one exists
    if (cell != null && !this.graph.isCellConnectable(cell)) {
      const parent = this.graph.getModel().getParent(cell)

      if (
        this.graph.model.isNode(parent) &&
        this.graph.isCellConnectable(parent)
      ) {
        cell = parent
      }
    }

    if (
      (
        this.graph.isSwimlane(cell) &&
        currentPoint != null &&
        this.graph.cellManager.hitsSwimlaneContent(
          cell, currentPoint.x, currentPoint.y,
        )
      ) ||
      !this.handler.isConnectableCell(cell)
    ) {
      cell = null
    }

    if (cell != null) {
      if (this.handler.isConnecting()) {
        if (this.handler.sourceState != null) {
          this.handler.error = this.handler.validateConnection(
            this.handler.sourceState.cell, cell,
          )

          if (this.handler.error != null && this.handler.error.length >= 0) {
            cell = null
            if (this.handler.isCreateTarget(e.getEvent())) {
              this.handler.error = null
            }
          }
        }
      } else if (!this.handler.isValidSource(cell)) {
        cell = null
      }

    } else if (
      this.handler.isConnecting() &&
      !this.handler.isCreateTarget(e.getEvent()) &&
      !this.graph.isDanglingEdgesEnabled()
    ) {
      this.handler.error = ''
    }

    return cell
  }

  isValidState(state: State) {
    if (this.handler.isConnecting()) {
      return this.handler.error == null
    }
    return super.isValidState(state)
  }

  private hasConnectIcon(state: State | null) {
    if (state != null) {
      return getConnectionIcon({
        graph: this.graph,
        cell: state.cell,
      }) != null
    }

    return false
  }

  getMarkerColor(evt: Event, state: State, isValid: boolean) {
    return (!this.hasConnectIcon(state) || this.handler.isConnecting())
      ? super.getMarkerColor(evt, state, isValid)
      : null
  }

  intersects(state: State, e: MouseEventEx) {
    if (this.hasConnectIcon(state) || this.handler.isConnecting()) {
      return true
    }
    return super.intersects(state, e)
  }
}
