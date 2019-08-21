import { IChange } from './change'
import { Cell } from '../core/cell'
import { Model } from '../core/model'

export class TerminalChange implements IChange {
  public readonly model: Model
  private cell: Cell
  private terminal: Cell | null
  private previous: Cell | null
  private isSource: boolean

  constructor(model: Model, cell: Cell, terminal: Cell, isSource: boolean) {
    this.model = model
    this.cell = cell
    this.terminal = terminal
    this.previous = terminal
    this.isSource = isSource
  }

  execute() {
    if (this.cell != null) {
      this.terminal = this.previous
      this.previous = this.model.doTerminalChange(
        this.cell, this.previous, this.isSource,
      )
    }
  }
}
