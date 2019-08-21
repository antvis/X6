import { IChange } from './change'
import { Cell } from '../core/cell'
import { Model } from '../core/model'

export class ValueChange implements IChange {
  private previous: any

  constructor(
    private readonly model: Model,
    private cell: Cell,
    private value: any,
  ) {
    this.previous = value
  }

  execute() {
    if (this.cell != null) {
      this.value = this.previous
      this.previous = this.model.doValueChange(this.cell, this.previous)
    }
  }
}
