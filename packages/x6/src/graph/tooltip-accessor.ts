import { Cell } from '../core/cell'
import { hook } from './decorator'
import { BaseGraph } from './base-graph'
import { Overlay } from '../struct'

export class TooltipAccessor extends BaseGraph {
  hideTooltip() {
    this.tooltipHandler.hide()
    return this
  }

  isTooltipEnabled() {
    return this.tooltipHandler.isEnabled()
  }

  enableTooltip() {
    this.tooltipHandler.enable()
    return this
  }

  disableTooltip() {
    this.tooltipHandler.disable()
    return this
  }

  isTooltipShowing() {
    return !this.tooltipHandler.isHidden()
  }

  @hook()
  getTooltip(cell: Cell) {
    return cell.style.tooltip
  }

  @hook()
  getCollapseTooltip(cell: Cell) {
    return 'Collapse/Expand'
  }

  @hook()
  getOverlayTooltip(cell: Cell, overlay: Overlay) {
    return overlay.tooltip
  }
}
