import { Cell } from '../core/cell'
import { Overlay, Image } from '../struct'
import { events } from './events'
import { BaseManager } from './base-manager'

export class OverlayManager extends BaseManager {
  addOverlay(cell: Cell, overlay: Overlay) {
    if (cell.overlays == null) {
      cell.overlays = []
    }

    cell.overlays.push(overlay)

    const state = this.view.getState(cell)
    if (state != null) {
      // Immediately updates the cell display if the state exists
      this.renderer.redraw(state)
    }

    this.graph.trigger(events.addOverlay, { cell, overlay })

    return overlay
  }

  removeOverlay(cell: Cell, overlay?: Overlay | null) {
    if (overlay == null) {
      return this.removeOverlays(cell)
    }

    const idx = cell.overlays != null ? cell.overlays.indexOf(overlay) : -1
    if (idx >= 0 && cell.overlays != null) {
      cell.overlays.splice(idx, 1)
      if (cell.overlays.length === 0) {
        delete cell.overlays
      }

      const state = this.view.getState(cell)
      if (state != null) {
        this.renderer.redraw(state)
      }

      this.graph.trigger(events.removeOverlay, { cell, overlay })

      return overlay
    }

    return null
  }

  removeOverlays(cell: Cell) {
    const overlays = cell.overlays
    if (overlays != null) {
      delete cell.overlays
      const state = this.view.getState(cell)
      if (state != null) {
        this.renderer.redraw(state)
      }

      this.graph.trigger(events.removeOverlays, { cell, overlays })
    }

    return overlays
  }

  addWarningOverlay(
    cell: Cell,
    warning: string | null,
    image: Image,
    selectOnClick: boolean,
  ) {
    const overlay = new Overlay({
      image,
      tooltip: `<font color=red>${warning}</font>`,
    })

    // Adds a handler for single mouseclicks to select the cell
    if (selectOnClick) {
      // TODO:
      // overlay.addListener('click', () => {
      //   if (this.isEnabled()) {
      //     this.setSelectionCell(cell)
      //   }
      // })
    }

    return this.addOverlay(cell, overlay)
  }
}
