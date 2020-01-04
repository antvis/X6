import { Cell } from '../core/cell'
import { Graph } from '../graph'
import { BaseManager } from './base-manager'
import {
  IChange,
  RootChange,
  ChildChange,
  StyleChange,
  DataChange,
  TerminalChange,
  GeometryChange,
} from '../change'

export class ChangeManager extends BaseManager {
  constructor(graph: Graph) {
    super(graph)
    this.model.on('change', this.onModelChanged, this)
  }

  protected onModelChanged(changes: IChange[]) {
    this.graph.trigger('model:changing', changes)
    changes.forEach(change => this.processChange(change))
    this.graph.updateSelection()
    this.view.validate()
    this.graph.sizeDidChange()
    this.graph.trigger('model:changed', changes)
  }

  protected processChange(change: IChange) {
    if (change instanceof RootChange) {
      // removes all cells and clears the selection if the root changes.
      this.graph.clearSelection()
      this.graph.setDefaultParent(null)
      this.removeCellState(change.previous)

      if (this.graph.resetViewOnRootChange) {
        this.view.scale = 1
        this.view.translate.x = 0
        this.view.translate.y = 0
      }
      this.graph.trigger('root:changed')
    } else if (change instanceof ChildChange) {
      const newParent = this.model.getParent(change.child)!
      this.view.invalidate(change.child, true, true)

      // invisible
      if (
        !this.model.contains(newParent) ||
        this.graph.isCellCollapsed(newParent)
      ) {
        this.view.invalidate(change.child, true, true)
        this.removeCellState(change.child)
        // currentRoot being removed
        if (this.graph.getCurrentRoot() === change.child) {
          this.graph.home()
        }
      }

      if (newParent !== change.previous) {
        // Refreshes the collapse/expand icons on the parents
        if (newParent != null) {
          this.view.invalidate(newParent, false, false)
        }

        if (change.previous != null) {
          this.view.invalidate(change.previous, false, false)
        }
      }
    } else if (
      change instanceof TerminalChange ||
      change instanceof GeometryChange
    ) {
      // Handles two special cases where the shape does not need to
      // be recreated, it only needs to be invalidated.

      // Checks if the geometry has changed to avoid unnessecary revalidation
      if (
        change instanceof TerminalChange ||
        (change.previous == null && change.geometry != null) ||
        (change.previous != null && !change.previous.equals(change.geometry))
      ) {
        this.view.invalidate(change.cell)
      }
    } else if (change instanceof DataChange) {
      if (this.graph.shouldRedrawOnDataChange(change)) {
        this.removeCellState(change.cell)
      } else {
        // Handles special case where only the shape, but no
        // descendants need to be recreated.
        this.view.invalidate(change.cell, false, false)
      }
    } else if (change instanceof StyleChange) {
      // Requires a new Shape in JavaScript.
      this.view.invalidate(change.cell, true, true)
      const state = this.view.getState(change.cell)
      if (state != null) {
        state.invalidStyle = true
      }
    } else if (change.cell != null && change.cell instanceof Cell) {
      // Removes the state from the cache by default.
      this.removeCellState(change.cell)
    }
  }

  /**
   * Removes all cached information for the given cell and its descendants.
   *
   * This is called when a cell was removed from the model.
   */
  protected removeCellState(cell?: Cell | null) {
    if (cell) {
      cell.eachChild(child => this.removeCellState(child))
      this.view.invalidate(cell, false, true)
      this.view.removeState(cell)
    }
  }

  /**
   * Returns the cells to be selected for the given array of changes.
   */
  getSelectionCellsForChanges(changes: IChange[]) {
    const dict = new WeakMap<Cell, boolean>()
    const cells: Cell[] = []

    const addCell = (cell: Cell) => {
      if (!dict.get(cell) && this.model.contains(cell)) {
        if (this.model.isEdge(cell) || this.model.isNode(cell)) {
          dict.set(cell, true)
          cells.push(cell)
        } else {
          cell.eachChild(child => addCell(child))
        }
      }
    }

    changes.forEach(change => {
      if (!(change instanceof RootChange)) {
        let cell = null

        if (change instanceof ChildChange) {
          cell = change.child
        } else {
          const tmp = (change as any).cell
          if (tmp != null && tmp instanceof Cell) {
            cell = tmp
          }
        }

        if (cell != null) {
          addCell(cell)
        }
      }
    })

    return cells
  }

  @BaseManager.dispose()
  dispose() {
    this.model.off('change', this.onModelChanged)
  }
}
