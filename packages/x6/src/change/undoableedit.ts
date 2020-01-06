import { Events, Disposable } from '../entity'
import { IChange } from './change'

export class UndoableEdit extends Disposable {
  public undone: boolean
  public redone: boolean
  public readonly model: Events
  public readonly changes: IChange[]
  private readonly significant: boolean
  private readonly onChange?: (edit?: UndoableEdit) => void
  private readonly onDispose?: (edit?: UndoableEdit) => void

  constructor(model: Events, options: UndoableEdit.Options = {}) {
    super()
    this.model = model
    this.changes = []
    this.undone = false
    this.redone = false
    this.onChange = options.onChange
    this.onDispose = options.onDispose
    this.significant = options.significant !== false
  }

  isEmpty() {
    return this.changes.length === 0
  }

  isUndone() {
    return this.undone
  }

  isRedone() {
    return this.redone
  }

  isSignificant() {
    return this.significant
  }

  add(change: IChange) {
    this.changes.push(change)
  }

  /**
   * Undoes all changes.
   */
  undo() {
    if (this.undone) {
      return
    }

    this.model.trigger('startEdit')
    const count = this.changes.length

    for (let i = count - 1; i >= 0; i -= 1) {
      const change = this.changes[i]
      if (change.execute != null) {
        change.execute()
      }

      this.model.trigger('executed', change)
    }

    this.undone = true
    this.redone = false
    this.model.trigger('endEdit')

    this.notify()
  }

  /**
   * Redoes all changes.
   */
  redo() {
    if (this.redone) {
      return
    }

    this.model.trigger('startEdit')
    this.changes.forEach(change => {
      if (change.execute != null) {
        change.execute()
      }

      this.model.trigger('executed', change)
    })
    this.undone = false
    this.redone = true
    this.model.trigger('endEdit')

    this.notify()
  }

  notify() {
    if (this.onChange) {
      this.onChange(this)
    }
  }

  @Disposable.dispose()
  dispose(): void {
    if (this.onDispose) {
      this.onDispose(this)
    }
  }
}

export namespace UndoableEdit {
  export interface Options {
    /**
     * Specifies if the undoable change is significant.
     */
    significant?: boolean

    /**
     * Triggered after an `undo` or `redo` has been carried out.
     */
    onChange?: (edit?: UndoableEdit) => void

    onDispose?: (edit?: UndoableEdit) => void
  }
}
