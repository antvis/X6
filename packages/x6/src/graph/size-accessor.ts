import { Rectangle } from '../geometry'
import { Cell } from '../core/cell'
import { Geometry } from '../core/geometry'
import { hook } from './decorator'
import { BaseGraph } from './base-graph'

export class SizeAccessor extends BaseGraph {
  @hook()
  isCellResizable(cell: Cell) {
    const style = this.getStyle(cell)
    return (
      this.isCellsResizable() &&
      !this.isCellLocked(cell) &&
      style.resizable !== false
    )
  }

  @hook()
  isAutoSizeCell(cell: Cell) {
    const style = this.getStyle(cell)
    return this.isAutoSizeOnEdited() || style.autosize === true
  }

  @hook()
  isExtendParent(cell: Cell) {
    return !this.model.isEdge(cell) && this.isExtendParents()
  }

  @hook()
  isConstrainChild(cell: Cell) {
    return (
      this.isConstrainChildren() &&
      !this.model.isEdge(this.model.getParent(cell)!)
    )
  }

  /**
   * Returns the bounding box for the given array of `Cell`s.
   */
  getBoundingBox(cells: Cell[]) {
    return this.sizeManager.getBoundingBox(cells)
  }

  /**
   * Resizes the specified cell to just fit around the its label
   * and/or children.
   *
   * @param cell `Cells` to be resized.
   * @param recurse Optional boolean which specifies if all descendants
   * should be autosized. Default is `true`.
   */
  autoSizeCell(cell: Cell, recurse: boolean = true) {
    return this.sizeManager.autoSizeCell(cell, recurse)
  }

  /**
   * Sets the bounds of the given cell.
   */
  resizeCell(cell: Cell, bounds: Rectangle, recurse?: boolean) {
    return this.resizeCells([cell], [bounds], recurse)[0]
  }

  /**
   * Sets the bounds of the given cells.
   */
  resizeCells(
    cells: Cell[],
    bounds: Rectangle[],
    recurse: boolean = this.isRecursiveResize(),
  ) {
    return this.sizeManager.resizeCells(cells, bounds, recurse)
  }

  /**
   * Resizes the child cells of the given cell for the given new geometry with
   * respect to the current geometry of the cell.
   */
  resizeChildCells(cell: Cell, newGeo: Geometry) {
    const geo = this.model.getGeometry(cell)!
    const dx = newGeo.bounds.width / geo.bounds.width
    const dy = newGeo.bounds.height / geo.bounds.height
    cell.eachChild(child => this.scaleCell(child, dx, dy, true))
    return cell
  }

  /**
   * Scales the points, position and size of the given cell according to the
   * given vertical and horizontal scaling factors.
   *
   * @param cell - The cell to be scaled.
   * @param sx - Horizontal scaling factor.
   * @param sy - Vertical scaling factor.
   * @param recurse - Boolean indicating if the child cells should be scaled.
   */
  scaleCell(cell: Cell, sx: number, sy: number, recurse: boolean) {
    return this.sizeManager.scaleCell(cell, sx, sy, recurse)
  }
}
