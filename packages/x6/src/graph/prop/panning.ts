import { GraphBase } from './base'

export class PanningBehaviour extends GraphBase {
  enablePanning() {
    this.panningHandler.enablePanning()
    return this
  }

  disablePanning() {
    this.panningHandler.disablePanning()
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
}
