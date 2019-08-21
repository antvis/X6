import { Point, Rectangle } from '../struct'
import { CellState } from './cell-state'
import { Align } from '../types'

export class CellOverlay {
  /**
   * Defines the overlapping for the overlay, that is, the proportional
   * distance from the origin to the point defined by the alignment.
   */
  defaultOverlap: number = 0.5

  constructor(
    /**
     * The `ImageShape` to be used as the icon.
     */
    public image: ImageShape,

    /**
     * The optional string to be used as the tooltip.
     */
    public tooltip?: string,

    /**
     * The horizontal alignment for the overlay.
     *
     * For edges, the overlay always appears in the center of the edge.
     */
    public align: Align = Align.right,

    /**
     * The vertical alignment for the overlay.
     *
     * For edges, the overlay always appears in the center of the edge.
     */
    public verticalAlign: Align = Align.bottom,

    /**
     * The offset for the overlay. The offset will be scaled according
     * to the current scale.
     */
    public offset: Point = new Point(),

    /**
     * The cursor for the overlay.
     */
    public cursor: string = 'help',
  ) {

  }

  getBounds(state: CellState) {
    const isEdge = state.view.graph.model.isEdge(state.cell)
    const s = state.view.scale
    let pt = null

    const w = this.image.width
    const h = this.image.height

    if (isEdge) {
      const pts = state.absolutePoints

      if (pts.length % 2 == 1) {
        pt = pts[Math.floor(pts.length / 2)]
      }
      else {
        const idx = pts.length / 2
        const p0 = pts[idx - 1]
        const p1 = pts[idx]
        pt = new mxPoint(p0.x + (p1.x - p0.x) / 2,
                         p0.y + (p1.y - p0.y) / 2)
      }
    }
    else {
      pt = new mxPoint()

      if (this.align == mxConstants.ALIGN_LEFT) {
        pt.x = state.x
      }
      else if (this.align == mxConstants.ALIGN_CENTER) {
        pt.x = state.x + state.width / 2
      }
      else {
        pt.x = state.x + state.width
      }

      if (this.verticalAlign == mxConstants.ALIGN_TOP) {
        pt.y = state.y
      }
      else if (this.verticalAlign == mxConstants.ALIGN_MIDDLE) {
        pt.y = state.y + state.height / 2
      }
      else {
        pt.y = state.y + state.height
      }
    }

    return new Rectangle(Math.round(pt.x - (w * this.defaultOverlap - this.offset.x) * s),
                         Math.round(pt.y - (h * this.defaultOverlap - this.offset.y) * s), w * s, h * s)
  }

  toString() {
    return this.tooltip
  }
}
