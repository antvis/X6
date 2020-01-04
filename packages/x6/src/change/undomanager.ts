import { Graph } from '../graph'
import { Basecoat } from '../entity'
import { UndoableEdit } from './undoableedit'

export class UndoManager extends Basecoat<UndoManager.EventArgs> {
  private size: number
  private cursor: number
  private history: UndoableEdit[]

  constructor(size?: number) {
    super()
    this.size = size != null ? size : 100
    this.clear()
  }

  clear() {
    this.cursor = 0
    this.history = []
    this.trigger('clear')
  }

  isEmpty() {
    return this.history.length === 0
  }

  canUndo() {
    return this.cursor > 0
  }

  canRedo() {
    return this.cursor < this.history.length
  }

  undo() {
    while (this.cursor > 0) {
      this.cursor -= 1
      const edit = this.history[this.cursor]
      edit.undo()

      if (edit.isSignificant()) {
        this.trigger('undo', edit)
        break
      }
    }
  }

  redo() {
    const count = this.history.length
    while (this.cursor < count) {
      const edit = this.history[this.cursor]
      this.cursor += 1
      edit.redo()
      if (edit.isSignificant()) {
        this.trigger('redo', edit)
        break
      }
    }
  }

  add(edit: UndoableEdit) {
    this.trim()

    if (this.size > 0 && this.size === this.history.length) {
      this.history.shift()
    }

    this.history.push(edit)
    this.cursor = this.history.length
    this.trigger('add', edit)
  }

  trim() {
    if (this.history.length > this.cursor) {
      const edits = this.history.splice(
        this.cursor,
        this.history.length - this.cursor,
      )

      edits.forEach(edit => edit.dispose())
    }
  }

  @Basecoat.dispose()
  dispose() {
    this.clear()
  }
}

export namespace UndoManager {
  export function create(graph: Graph) {
    const undoManager = new UndoManager()
    const undoListener = (edit: UndoableEdit) => {
      undoManager.add(edit)
    }
    graph.model.on('afterUndo', undoListener)

    const undoHandler = (edit: UndoableEdit) => {
      const cells = graph.changeManager
        .getSelectionCellsForChanges(edit.changes)
        .filter(cell => graph.view.getState(cell) != null)

      graph.setCellsSelected(cells)
    }

    undoManager.on('undo', undoHandler)
    undoManager.on('redo', undoHandler)

    return undoManager
  }

  export interface EventArgs {
    add: UndoableEdit
    undo: UndoableEdit
    redo: UndoableEdit
    clear?: null
  }
}
