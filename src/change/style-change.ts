import { IChange } from './change'
import { Cell } from '../core/cell'
import { Model } from '../core/model'
import { CellStyle } from '../types'

export class StyleChange implements IChange {
  public readonly model: Model
  public cell: Cell
  public style: CellStyle
  public previous: CellStyle

  constructor(model: Model, cell: Cell, style: CellStyle) {
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
