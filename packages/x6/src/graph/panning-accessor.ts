import { BaseGraph } from './base-graph'

export class PanningAccessor extends BaseGraph {
  public panX: number
  public panY: number

  enablePanning() {
    this.panningHandler.enable()
    return this
  }

  disablePanning() {
    this.panningHandler.disable()
    return this
  }

  enablePinch() {
    this.panningHandler.enablePinch()
    return this
  }

  disablePinch() {
    this.panningHandler.disablePinch()
    return this
  }

  /**
   * Shifts the graph display by the given amount. Use `view.setTranslate`
   * to set a persistent translation of the view.
   */
  pan(x: number, y: number, relative: boolean = false) {
    this.panningManager.pan(x, y, relative)
    return this
  }

  panTo(x: number, y: number) {
    this.pan(x, y, false)
    return this
  }

  panBy(x: number, y: number) {
    this.pan(x, y, true)
    return this
  }
}
