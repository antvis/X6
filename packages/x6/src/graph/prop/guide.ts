import { GraphBase } from './base'

export class GuidBehaviour extends GraphBase {
  isGuideEnabled() {
    return this.guideHandler.isEnabled()
  }

  setGuideEnabled(enabled: boolean) {
    if (enabled) {
      this.enableGuide()
    } else {
      this.disableGuide()
    }
    return this
  }

  enableGuide() {
    this.guideHandler.enable()
    return this
  }

  disableGuide() {
    this.guideHandler.disable()
    return this
  }

  toggleGuide() {
    if (this.isGuideEnabled()) {
      this.disableGuide()
    } else {
      this.enableGuide()
    }
    return this
  }
}
