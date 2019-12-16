import { Cell } from '../core/cell'
import { hook } from './decorator'
import { BaseGraph } from './base-graph'

export class TooltipAccessor extends BaseGraph {
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

  @hook()
  getTooltip(cell: Cell) {
    return cell.style.tooltip
  }
}
