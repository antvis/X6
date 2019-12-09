import { Cell } from '../core/cell'
import { events } from './events'
import { BaseManager } from './base-manager'

export class EditingManager extends BaseManager {
  updateLabel(cell: Cell, label: string, e?: Event) {
    this.model.batchUpdate(() => {
      const old = cell.data
      const data = this.graph.putLabel(cell, label)
      this.dataChanged(cell, data, this.graph.isAutoSizeCell(cell))
      this.graph.trigger(events.labelChanged, { cell, data, old, e })
    })
    return cell
  }

  protected dataChanged(cell: Cell, data: any, autoSize: boolean) {
    this.model.batchUpdate(() => {
      this.model.setData(cell, data)
      if (autoSize) {
        this.graph.sizeManager.cellSizeUpdated(cell, false)
      }
    })
  }
}
