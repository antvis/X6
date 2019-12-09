import { Cell } from '../core/cell'
import { Graph } from '../graph/graph'
import { Selection } from '../graph/selection'
import { IChange } from './change'

export class SelectionChange implements IChange {
  public added: Cell[] | null
  public removed: Cell[] | null
  public readonly selection: Selection

  constructor(
    selection: Selection,
    added: Cell[] | null,
    removed: Cell[] | null,
  ) {
    this.selection = selection
    this.added = added != null ? added.slice() : null
    this.removed = removed != null ? removed.slice() : null
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
