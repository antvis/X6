import { IChange } from './change'
import { Cell } from '../core/cell'
import { Model } from '../core/model'
import { Style } from '../types'

export class StyleChange implements IChange {
  public readonly model: Model
  public cell: Cell
  public style: Style
  public previous: Style

  constructor(model: Model, cell: Cell, style: Style) {
    this.model = model
    this.cell = cell
    this.style = style
    this.previous = style
  }

  execute() {
    if (this.cell != null) {
      this.style = this.previous
      this.previous = this.model.doStyleChange(this.cell, this.previous)
    }
  }
}
