import { BaseGraph } from './base-graph'

export class MouseWheelAccessor extends BaseGraph {
  isMouseWheelEnabled() {
    return this.mouseWheelHandler.isEnabled()
  }

  enableMouseWheel() {
    this.mouseWheelHandler.enable()
    return this
  }

  disableMouseWheel() {
    this.mouseWheelHandler.disable()
    return this
  }

  toggleMouseWheel() {
    this.mouseWheelHandler.toggleEnadled()
    return this
  }
}
