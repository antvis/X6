import { Cell } from '../core/cell'
import { hook } from './decorator'
import { BaseGraph } from './base-graph'
import { Overlay } from '../struct'

export class TooltipAccessor extends BaseGraph {
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

  hideTooltip() {
    this.tooltipHandler.hide()
    return this
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
