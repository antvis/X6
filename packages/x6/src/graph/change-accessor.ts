import { Cell } from '../core/cell'
import { DataChange } from '../change'
import { hook } from './decorator'
import { BaseGraph } from './base-graph'

export class ChangeAccessor extends BaseGraph {
  @hook()
  shouldRedrawOnDataChange(change: DataChange) {
    return false
  }

  getCellData(cell: Cell) {
    return this.model.getData(cell)
  }

  setCellData(cell: Cell, data: any) {
    this.model.setData(cell, data)
    return this
  }
}
