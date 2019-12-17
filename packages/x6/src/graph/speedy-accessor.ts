import { Cell } from '../core/cell'
import { BaseGraph } from './base-graph'

export class SpeedyAccessor extends BaseGraph {
  isEdge(cell?: Cell | null) {
    return cell != null ? this.model.isEdge(cell) : false
  }

  isNode(cell?: Cell | null) {
    return cell != null ? this.model.isNode(cell) : false
  }

  getCellGeometry(cell: Cell) {
    return this.model.getGeometry(cell)
  }

  batchUpdate(update: () => void) {
    this.model.batchUpdate(update)
    return this
  }
}
