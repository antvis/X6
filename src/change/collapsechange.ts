import { IChange } from './change'
import { Cell } from '../core/cell'
import { Model } from '../core/model'

export class CollapseChange implements IChange {
  public readonly model: Model
  private cell: Cell
  private collapsed: boolean
  private previous: boolean

  constructor(model: Model, cell: Cell, collapsed: boolean) {
    this.model = model
    this.cell = cell
    this.collapsed = collapsed
    this.previous = collapsed
  }

  execute() {
    if (this.cell != null) {
      this.collapsed = this.previous
      this.previous = this.model.doCollapseChange(this.cell, this.previous)
    }
  }
}
