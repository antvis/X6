import { IChange } from './change'
import { Cell } from '../core/cell'
import { Model } from '../core/model'

export class StyleChange implements IChange {
  public readonly model: Model
  private cell: Cell
  private style: string | null
  private previous: string | null

  constructor(model: Model, cell: Cell, style: string | null) {
    this.model = model
    this.cell = cell
    this.style = style
    this.previous = style
  }

  execute() {
    if (this.cell != null) {
      this.style = this.previous
      this.previous = this.model.doStyleChange(
        this.cell,
        this.previous as string,
      )
    }
  }
}
