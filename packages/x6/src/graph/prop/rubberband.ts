import { GraphBase } from './base'

export class RubberbandBehaviour extends GraphBase {
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
