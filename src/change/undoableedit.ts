import { Model } from '../core'
import { IDisposable, Events } from '../common'
import { IChange } from './change'

export class UndoableEdit implements IDisposable {
  public undone: boolean
  public redone: boolean
  public readonly model: Events
  public readonly changes: IChange[]
  private readonly significant: boolean
  private readonly onChange?: (edit?: UndoableEdit) => void
  private readonly onDispose?: (edit?: UndoableEdit) => void

  constructor(model: Events, options: UndoableEdit.Options) {
    this.model = model
    this.changes = []
    this.undone = false
    this.redone = false
    this.onChange = options.onChange
    this.onDispose = options.onDispose
    this.significant = options.significant
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
    return !this.significant
  }

  add(change: IChange) {
    this.changes.push(change)
  }

  /**
   * Undoes all changes in this edit.
   */
  undo() {
    if (this.undone) {
      return
    }

    this.model.trigger(Model.eventNames.startEdit)
    const count = this.changes.length

    for (let i = count - 1; i >= 0; i -= 1) {
      const change = this.changes[i]
      if (change.execute != null) {
        change.execute()
      } else if (change.undo != null) {
        change.undo()
      }

      this.model.trigger(Model.eventNames.executed, change)
    }

    this.undone = true
    this.redone = false
    this.model.trigger(Model.eventNames.endEdit)

    this.notify()
  }

  /**
   * Redoes all changes in this edit.
   */
  redo() {
    if (this.redone) {
      return
    }

    this.model.trigger(Model.eventNames.startEdit)
    this.changes.forEach((change) => {
      if (change.execute != null) {
        change.execute()
      } else if (change.redo != null) {
        change.redo()
      }

      this.model.trigger(Model.eventNames.executed, change)
    })
    this.undone = false
    this.redone = true
    this.model.trigger(Model.eventNames.endEdit)

    this.notify()
  }

  notify() {
    if (this.onChange) {
      this.onChange(this)
    }
  }

  private disposed: boolean = false
  get isDisposed() {
    return this.disposed
  }

  dispose(): void {
    if (this.disposed) {
      return
    }

    this.disposed = true
    if (this.onDispose) {
      this.onDispose(this)
    }
  }
}

export namespace UndoableEdit {
  export interface Options {
    /**
     * Triggered after an `undo` or `redo` has been carried out.
     */
    onChange?: (edit?: UndoableEdit) => void,

    onDispose?: (edit?: UndoableEdit) => void,

    /**
     * Specifies if the undoable change is significant.
     */
    significant: boolean,
  }
}
