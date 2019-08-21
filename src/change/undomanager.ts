import { Events } from '../common/events'
import { UndoableEdit } from './undoableedit'

export class UndoManager extends Events {
  private size: number
  private cursor: number
  private history: UndoableEdit[]

  constructor(size?: number) {
    super()
    this.size = (size != null) ? size : 100
    this.clear()
  }

  clear() {
    this.cursor = 0
    this.history = []
    this.trigger(UndoManager.EVENTS.CLEAR)
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
        this.trigger(UndoManager.EVENTS.UNDO, edit)
        break
      }
    }
  }

  redo() {
    const count = this.history.length
    while (this.cursor < count) {
      this.cursor += 1
      const edit = this.history[this.cursor]
      edit.redo()
      if (edit.isSignificant()) {
        this.trigger(UndoManager.EVENTS.REDO, edit)
        break
      }
    }
  }

  undoableEditHappened(edit: UndoableEdit) {
    this.trim()

    if (
      this.size > 0 &&
      this.size === this.history.length
    ) {
      this.history.shift()
    }

    this.history.push(edit)
    this.cursor = this.history.length
    this.trigger(UndoManager.EVENTS.ADD, edit)
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
}

export namespace UndoManager {
  export const EVENTS = {
    ADD: 'add',
    UNDO: 'undo',
    REDO: 'redo',
    CLEAR: 'clear',
  }
}
