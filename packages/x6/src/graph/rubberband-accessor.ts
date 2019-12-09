import { BaseGraph } from './base-graph'

export class RubberbandAccessor extends BaseGraph {
  isRubberbandEnabled() {
    return this.rubberbandHandler.isEnabled()
  }

  setRubberbandEnabled(enabled: boolean) {
    if (enabled) {
      this.enabledRubberband()
    } else {
      this.disableRubberband()
    }
    return this
  }

  toggleRubberband() {
    if (this.isRubberbandEnabled()) {
      this.disableRubberband()
    } else {
      this.enabledRubberband()
    }
    return this
  }

  enabledRubberband() {
    this.rubberbandHandler.enable()
    return this
  }

  disableRubberband() {
    this.rubberbandHandler.disable()
    return this
  }
}
