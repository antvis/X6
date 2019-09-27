import { State } from '../../core'
import { MouseEventEx } from '../../common'
import { CellMarker } from '../cell-marker'
import { ConnectionHandler } from './handler'
import {
  getConnectionIcon,
  getConnectionHighlightOptions,
} from './option'

export class ConnectionMarker extends CellMarker {
  master: ConnectionHandler

  constructor(master: ConnectionHandler) {
    const options = getConnectionHighlightOptions({ graph: master.graph })
    super(master.graph, options)
    this.master = master
  }

  getCell(e: MouseEventEx) {
    let cell = super.getCell(e)

    this.master.error = null

    // Checks for cell at preview point (with grid)
    const currentPoint = this.master.currentPoint
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

    if (cell != null) {
      if (!this.master.isConnectableCell(cell)) {
        cell = null
      }
    }

    if (cell != null) {
      if (
        currentPoint != null &&
        this.graph.isSwimlane(cell) &&
        this.graph.cellManager.hitsSwimlaneContent(
          cell, currentPoint.x, currentPoint.y,
        )
      ) {
        cell = null
      }
    }

    if (cell != null) {
      if (this.master.isConnecting()) {
        if (this.master.sourceState != null) {
          this.master.error = this.master.validateConnection(
            this.master.sourceState.cell, cell,
          )

          if (this.master.error != null && this.master.error.length >= 0) {
            cell = null
            if (this.master.isCreateTarget(e.getEvent())) {
              this.master.error = null
            }
          }
        }
      } else if (!this.master.isValidSource(cell)) {
        cell = null
      }

    } else if (
      this.master.isConnecting() &&
      !this.master.isCreateTarget(e.getEvent()) &&
      !this.graph.isDanglingEdgesEnabled()
    ) {
      this.master.error = ''
    }

    return cell
  }

  isValidState(state: State) {
    if (this.master.isConnecting()) {
      return this.master.error == null
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
    return (!this.hasConnectIcon(state) || this.master.isConnecting())
      ? super.getMarkerColor(evt, state, isValid)
      : null
  }

  intersects(state: State, e: MouseEventEx) {
    if (this.hasConnectIcon(state) || this.master.isConnecting()) {
      return true
    }
    return super.intersects(state, e)
  }
}
