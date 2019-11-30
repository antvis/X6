import { State } from '../../core'
import { MouseEventEx } from '../../common'
import { CellMarker } from '../cell-marker'
import { ConnectionHandler } from './handler'
import { getConnectionIcon, getConnectionHighlightOptions } from './option'

export class ConnectionMarker extends CellMarker {
  master: ConnectionHandler

  constructor(master: ConnectionHandler) {
    const options = getConnectionHighlightOptions({ graph: master.graph })
    super(master.graph, options)
    this.master = master
  }

  get preview() {
    return this.master.preview
  }

  getCell(e: MouseEventEx) {
    let cell = super.getCell(e)

    this.preview.error = null

    // Checks for cell at preview point (with grid)
    const currentPoint = this.preview.currentPoint
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
          cell,
          currentPoint.x,
          currentPoint.y,
        )
      ) {
        cell = null
      }
    }

    if (cell != null) {
      if (this.preview.isConnecting()) {
        if (this.preview.sourceState != null) {
          this.preview.error = this.master.validateConnection(
            this.preview.sourceState.cell,
            cell,
          )

          if (this.preview.error != null && this.preview.error.length >= 0) {
            cell = null
            if (this.master.isCreateTarget(e.getEvent())) {
              this.preview.error = null
            }
          }
        }
      } else if (!this.master.isValidSource(cell)) {
        cell = null
      }
    } else if (
      this.preview.isConnecting() &&
      !this.master.isCreateTarget(e.getEvent()) &&
      !this.graph.isDanglingEdgesEnabled()
    ) {
      this.preview.error = ''
    }

    return cell
  }

  isValidState(state: State) {
    if (this.preview.isConnecting()) {
      return this.preview.error == null
    }
    return super.isValidState(state)
  }

  private hasConnectIcon(state: State | null) {
    if (state != null) {
      return (
        getConnectionIcon({
          graph: this.graph,
          cell: state.cell,
        }) != null
      )
    }

    return false
  }

  getMarkerColor(evt: Event, state: State, isValid: boolean) {
    return !this.hasConnectIcon(state) || this.preview.isConnecting()
      ? super.getMarkerColor(evt, state, isValid)
      : null
  }

  intersects(state: State, e: MouseEventEx) {
    if (this.hasConnectIcon(state) || this.preview.isConnecting()) {
      return true
    }
    return super.intersects(state, e)
  }
}
