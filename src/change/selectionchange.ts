import { IChange } from './change'
import { Cell } from '../core/cell'
import { GraphSelectionModel } from '../core/graph-selection-model'

export class SelectionChange implements IChange {
  public readonly selection: GraphSelectionModel
  private added: Cell[] | null
  private removed: Cell[] | null

  constructor(
    selection: GraphSelectionModel,
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

    this.selection.trigger('change', {
      added: this.added,
      removed: this.removed,
    })
  }
}
