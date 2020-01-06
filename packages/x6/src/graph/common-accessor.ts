import { Point, Rectangle } from '../geometry'
import { globals } from '../option'
import { Cell } from '../core/cell'
import { hook } from './decorator'
import { BaseGraph } from './base-graph'

export class CommonAccessor extends BaseGraph {
  @hook()
  getChildOffset(cell: Cell): Point | null {
    return null
  }

  @hook()
  getTranslateForCurrentRoot(currentRoot: Cell | null): Point | null {
    return null
  }

  @hook()
  isCellLocked(cell: Cell | null) {
    if (this.isCellsLocked()) {
      return true
    }

    const style = this.getStyle(cell)
    if (style.locked) {
      return true
    }

    const geometry = this.model.getGeometry(cell)
    return geometry != null && this.model.isNode(cell) && geometry.relative
  }

  @hook()
  isCellSelectable(cell: Cell) {
    return this.isCellsSelectable()
  }

  @hook()
  isCellRotatable(cell: Cell) {
    const style = this.getStyle(cell)
    return (
      this.isCellsRotatable() &&
      !this.isCellLocked(cell) &&
      style.rotatable !== false
    )
  }

  @hook()
  isLabelMovable(cell: Cell | null) {
    return (
      !this.isCellLocked(cell) &&
      ((this.model.isEdge(cell) && this.edgeLabelsMovable) ||
        (this.model.isNode(cell) && this.nodeLabelsMovable))
    )
  }

  @hook()
  isCellBendable(cell: Cell) {
    const style = this.getStyle(cell)
    return (
      this.isCellsBendable() &&
      !this.isCellLocked(cell) &&
      style.bendable !== false
    )
  }

  @hook()
  isTerminalPointMovable(cell: Cell, isSource: boolean) {
    return true
  }

  @hook()
  isHtmlLabel(cell: Cell) {
    const style = this.getStyle(cell)
    if (style != null && style.htmlLabel != null) {
      return style.htmlLabel
    }
    return this.isHtmlLabels()
  }

  @hook()
  isWrapping(cell: Cell) {
    const style = this.getStyle(cell)
    return style != null ? style.whiteSpace === 'wrap' : false
  }

  @hook()
  isLabelClipped(cell: Cell) {
    const style = this.getStyle(cell)
    return style != null ? style.overflow === 'hidden' : false
  }

  @hook()
  getHtml(cell: Cell): HTMLElement | string | null {
    let result = null
    if (cell != null) {
      result = cell.style.html
    }
    return result || null
  }

  @hook()
  getLabel(cell: Cell): HTMLElement | string | null {
    let result = null

    if (this.labelsVisible && cell != null) {
      const style = this.getStyle(cell)
      if (style.label !== false && style.label != null) {
        result = style.label
      }
    }

    return result
  }

  @hook()
  getCellLink(cell: Cell) {
    return null
  }

  @hook()
  getCellCursor(cell: Cell | null) {
    return null
  }

  @hook()
  getStartSize(swimlane: Cell | null) {
    const result = new Rectangle()
    const style = this.getStyle(swimlane)
    if (style != null) {
      const size = style.startSize || globals.defaultStartSize
      if (style.horizontal !== false) {
        result.height = size
      } else {
        result.width = size
      }
    }

    return result
  }

  @hook()
  getCellClassName(cell: Cell) {
    const style = this.getStyle(cell)
    return style.className || null
  }

  @hook()
  getLabelClassName(cell: Cell) {
    const style = this.getStyle(cell)
    return style.labelClassName || null
  }

  /**
   * Returns the cells which may be exported in the given array of cells.
   */
  getExportableCells(cells: Cell[]) {
    return this.model.filterCells(cells, cell => this.canExportCell(cell))
  }

  canExportCell(cell: Cell) {
    return this.isCellsExportable()
  }

  getImportableCells(cells: Cell[]) {
    return this.model.filterCells(cells, cell => this.canImportCell(cell))
  }

  /**
   * Returns true if the given cell may be imported from the clipboard.
   *
   * Default is `true`.
   */
  canImportCell(cell: Cell) {
    return this.isCellsImportable()
  }

  /**
   * Returns a decimal number representing the amount of the width and height
   * of the given cell that is allowed to overlap its parent. A value of 0
   * means all children must stay inside the parent, 1 means the child is
   * allowed to be placed outside of the parent such that it touches one of
   * the parents sides.
   */
  getOverlap(cell: Cell) {
    return this.isAllowOverlapParent(cell) ? this.defaultOverlap : 0
  }

  /**
   * Returns true if the given cell is allowed to be placed outside of the
   * parents area.
   */
  isAllowOverlapParent(cell: Cell) {
    return false
  }
}
