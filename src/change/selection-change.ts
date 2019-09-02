import { IChange } from './change'
import { Graph } from '../core/graph'
import { Cell } from '../core/cell'
import { SelectionManager } from '../core/selection-manager'

export class SelectionChange implements IChange {
  public readonly selection: SelectionManager
  public added: Cell[] | null
  public removed: Cell[] | null

  constructor(
    selection: SelectionManager,
    added: Cell[] | null,
    removed: Cell[] | null,
  ) {
    this.selection = selection
    this.added = (added != null) ? added.slice() : null
    this.removed = (removed != null) ? removed.slice() : null
  }

  execute() {
    if (this.removed != null) {
      this.removed.forEach(cell => this.selection.doRemoveCell(cell))
    }

    if (this.added != null) {
      this.added.forEach(cell => this.selection.doAddCell(cell))
    }

    const tmp = this.added
    this.added = this.removed
    this.removed = tmp

    this.selection.graph.trigger(Graph.events.selectionChanged, {
      added: this.added,
      removed: this.removed,
    })
  }
}
