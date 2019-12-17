import { BaseGraph } from './base-graph'

export class MouseWheelAccessor extends BaseGraph {
  isMouseWheelEnabled() {
    return this.mouseWheelHandler.isEnabled()
  }

  setMouseWheelEnabled(enabled: boolean) {
    if (enabled) {
      this.enableMouseWheel()
    } else {
      this.disableMouseWheel()
    }
    return this
  }

  enableMouseWheel() {
    if (!this.isMouseWheelEnabled()) {
      this.mouseWheelHandler.enable()
    }
    return this
  }

  disableMouseWheel() {
    if (this.isMouseWheelEnabled()) {
      this.mouseWheelHandler.disable()
    }
    return this
  }

  toggleMouseWheel() {
    this.mouseWheelHandler.toggleEnadled()
    return this
  }
}
