import { Cell } from '../core/cell'
import { BaseGraph } from './base-graph'

export class LayerAccessor extends BaseGraph {
  clear() {
    this.model.clear()
  }

  isRoot(cell?: Cell | null) {
    return this.model.isRoot(cell)
  }

  getRoot(cell?: Cell | null) {
    return this.model.getRoot(cell)
  }

  setRoot(root?: Cell | null) {
    this.model.setRoot(root)
  }

  isLayer(cell?: Cell | null): boolean {
    return this.model.isLayer(cell)
  }

  getLayers(): Cell[] {
    return this.model.getRoot().children || []
  }

  getLayerCount() {
    return this.getLayers().length
  }

  addLayer(data?: any) {
    return this.layerManager.addLayer(data)
  }

  removeLayer(layerIndex: number) {
    this.layerManager.removeLayer(layerIndex)
  }

  copyLayer(layerIndex: number) {
    return this.layerManager.copyLayer(layerIndex)
  }
}
