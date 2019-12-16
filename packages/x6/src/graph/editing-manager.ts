import { Cell } from '../core/cell'
import { BaseManager } from './base-manager'

export class EditingManager extends BaseManager {
  updateLabel(cell: Cell, label: string, e?: Event) {
    this.model.batchUpdate(() => {
      const style = { ...cell.style, label }
      this.graph.styleManager.setCellStyle(style, [cell])
    })
    return cell
  }
}
