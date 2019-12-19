import { Cell } from '../core/cell'
import { State } from '../core/state'
import { Anchor } from '../struct'
import { hook } from './decorator'
import { BaseGraph } from './base-graph'

export class ConnectionAccessor extends BaseGraph {
  setConnectable(connectable: boolean) {
    if (connectable) {
      this.connectionHandler.enable()
    } else {
      this.connectionHandler.disable()
    }
    return this
  }

  enableConnection() {
    this.connectionHandler.enable()
    return this
  }

  disableConnection() {
    this.connectionHandler.disable()
    return this
  }

  isConnectable() {
    return this.connectionHandler.isEnabled()
  }

  @hook()
  isPort(cell: Cell) {
    return false
  }

  @hook()
  getTerminalForPort(cell: Cell, isSource: boolean) {
    return this.model.getParent(cell)
  }

  @hook()
  isCellDisconnectable(cell: Cell, terminal: Cell, isSource: boolean) {
    return this.isCellsDisconnectable() && !this.isCellLocked(cell)
  }

  @hook()
  isCellConnectable(cell: Cell | null) {
    const style = this.getStyle(cell)
    return style.connectable !== false
  }

  /**
   * Connects the specified end of the given edge to the given terminal.
   *
   * @param edge - The edge will be updated.
   * @param terminal - The new terminal to be used.
   * @param isSource - Indicating if the new terminal is the source or target.
   * @param anchor - Optional `Anchor` to be used for this connection.
   */
  connectCell(
    edge: Cell,
    terminal: Cell | null,
    isSource: boolean,
    anchor?: Anchor,
  ) {
    return this.connectionManager.connectCell(edge, terminal, isSource, anchor)
  }

  /**
   * Disconnects the given edges from the terminals which are not in the
   * given array.
   */
  disconnectGraph(cells: Cell[]) {
    return this.connectionManager.disconnectGraph(cells)
  }

  /**
   * Get an `Anchor` instance that describes the given connection point.
   */
  getConnectionAnchor(
    edgeState: State,
    terminalState?: State | null,
    isSource: boolean = false,
  ) {
    return this.connectionManager.getConnectionAnchor(
      edgeState,
      terminalState,
      isSource,
    )
  }

  setConnectionAnchor(
    edge: Cell,
    terminal: Cell | null,
    isSource: boolean,
    anchor?: Anchor | null,
  ) {
    return this.connectionManager.setConnectionAnchor(
      edge,
      terminal,
      isSource,
      anchor,
    )
  }

  @hook()
  getAnchors(
    terminal: Cell,
    isSource: boolean,
  ): (Anchor | Anchor.Data)[] | null {
    const state = this.view.getState(terminal)
    if (state != null && state.shape != null && state.shape.stencil != null) {
      return state.shape.stencil.anchors
    }

    return null
  }

  @hook()
  isAnchorConnectable(cell: Cell, anchor: Anchor): boolean {
    return this.isCellConnectable(cell)
  }
}
