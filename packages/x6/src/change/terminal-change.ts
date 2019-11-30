import { IChange } from './change'
import { Cell } from '../core/cell'
import { Model } from '../core/model'

export class TerminalChange implements IChange {
  public readonly model: Model
  public cell: Cell
  public terminal: Cell | null
  public previous: Cell | null
  public isSource: boolean

  constructor(
    model: Model,
    cell: Cell,
    terminal: Cell | null,
    isSource: boolean
  ) {
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
        this.cell,
        this.previous,
        this.isSource
      )
    }
  }
}
