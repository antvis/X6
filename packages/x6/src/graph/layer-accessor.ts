import { BaseGraph } from './base-graph'

export class LayerAccessor extends BaseGraph {
  getLayerCount() {
    return this.layerManager.getLayerCount()
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
