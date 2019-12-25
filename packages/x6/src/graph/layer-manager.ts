import { Cell } from '../core/cell'
import { BaseManager } from './base-manager'

export class LayerManager extends BaseManager {
  getLayerCount() {
    return this.model.getChildCount(this.model.getRoot())
  }

  addLayer(data?: any) {
    return this.graph.batchUpdate(() => {
      const cell = new Cell(data)
      const root = this.model.getRoot()

      this.graph.addCell(cell, root)
      this.graph.setDefaultParent(cell)

      return cell
    })
  }

  removeLayer(index: number) {
    return this.graph.batchUpdate(() => {
      const root = this.model.getRoot()
      const layer = this.model.getChildAt(root, index)
      if (layer != null) {
        this.graph.removeCells([layer], false)
        const count = this.getLayerCount()
        if (count === 0) {
          this.addLayer()
          this.graph.setDefaultParent(null)
        } else if (index > 0 && index <= count) {
          this.graph.setDefaultParent(this.model.getChildAt(root, index - 1))
        } else {
          this.graph.setDefaultParent(null)
        }
      }
      return layer
    })
  }

  copyLayer(index: number) {
    const root = this.model.getRoot()
    const layer = this.model.getChildAt(root, index)
    const cloned = layer != null ? this.graph.cloneCell(layer) : null

    if (cloned != null) {
      this.graph.batchUpdate(() => {
        cloned.setVisible(true)
        this.graph.addCell(cloned, root)
        this.graph.setDefaultParent(cloned)
      })

      if (!this.graph.isCellLocked(cloned)) {
        this.graph.selectAll(cloned)
      }
    }

    return cloned
  }
}
