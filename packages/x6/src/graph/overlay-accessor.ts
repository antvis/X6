import { Cell } from '../core/cell'
import { Image, Overlay } from '../struct'
import { BaseGraph } from './base-graph'

export class OverlayAccessor extends BaseGraph {
  /**
   * Returns the array of `Overlay` for the given cell
   * or null if no overlays are defined.
   */
  getOverlays(cell: Cell | null) {
    return cell != null ? cell.getOverlays() : null
  }

  /**
   * Adds an `Overlay` for the specified cell.
   */
  addOverlay(cell: Cell, overlay: Overlay) {
    return this.overlayManager.addOverlay(cell, overlay)
  }

  /**
   * Removes and returns the given `Overlay` from the given cell.
   * If no overlay is given, then all overlays are removed.
   */
  removeOverlay(cell: Cell, overlay?: Overlay | null) {
    return this.overlayManager.removeOverlay(cell, overlay)
  }

  removeOverlays(cell: Cell) {
    return this.overlayManager.removeOverlays(cell)
  }

  /**
   * Removes all `Overlays` in the graph for the given cell and all its
   * descendants. If no cell is specified then all overlays are removed
   * from the graph.
   */
  clearOverlays(cell: Cell = this.model.getRoot()) {
    this.removeOverlays(cell)
    cell.eachChild(child => this.clearOverlays(child))
    return cell
  }

  /**
   * Creates an overlay for the given cell using the `warning` string and
   * image `warningImage`, then returns the new `Overlay`. The `warning`
   * string is displayed as a tooltip in a red font and may contain HTML
   * markup. If the `warning` string is null or a zero length string, then
   * all overlays are removed from the cell.
   */
  addWarningOverlay(
    cell: Cell,
    warning?: string | null,
    img: Image = this.warningImage,
    selectOnClick: boolean = false,
  ) {
    if (warning != null && warning.length > 0) {
      return this.overlayManager.addWarningOverlay(
        cell,
        warning,
        img,
        selectOnClick,
      )
    }

    this.removeOverlays(cell)
    return null
  }
}
