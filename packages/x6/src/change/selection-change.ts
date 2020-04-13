import { Cell } from '../core/cell'
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

    this.selection.graph.trigger('selection:changed', {
      added: this.added,
      removed: this.removed,
      selected: this.selection.cells.slice(),
    })

    const tmp = this.added
    this.added = this.removed
    this.removed = tmp
  }
}
