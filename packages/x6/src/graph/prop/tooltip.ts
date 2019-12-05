import { GraphBase } from './base'

export class TooltipBehaviour extends GraphBase {
  hideTooltip() {
    if (this.tooltipHandler) {
      this.tooltipHandler.hide()
    }
    return this
  }

  enableTooltip() {
    this.tooltipHandler.enable()
    return this
  }

  disableTooltip() {
    this.tooltipHandler.disable()
    return this
  }

  isTooltipEnabled() {
    return this.tooltipHandler.isEnabled()
  }
}
