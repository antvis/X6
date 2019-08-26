import { IChange } from './change'
import { Cell } from '../core/cell'
import { Model } from '../core/model'

export class DataChange implements IChange {
  public previous: any

  constructor(
    public readonly model: Model,
    public cell: Cell,
    public data: any,
  ) {
    this.previous = data
  }

  execute() {
    if (this.cell != null) {
      this.data = this.previous
      this.previous = this.model.doDataChange(this.cell, this.previous)
    }
  }
}
