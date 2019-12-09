import * as util from '../util'
import { globals } from '../option'
import { Cell } from '../core/cell'
import { Rectangle, Point } from '../struct'
import { hook } from './decorator'
import { BaseGraph } from './base-graph'
import { DomEvent } from '../common'

export class CommonAccessor extends BaseGraph {
  batchUpdate(update: () => void) {
    this.model.batchUpdate(update)
    return this
  }

  getCellGeometry(cell: Cell) {
    return this.model.getGeometry(cell)
  }

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
  isSwimlane(cell: Cell | null) {
    if (cell != null) {
      if (this.model.getParent(cell) !== this.model.getRoot()) {
        const style = this.getStyle(cell)
        if (style != null && !this.model.isEdge(cell)) {
          return style.shape === 'swimlane'
        }
      }
    }
    return false
  }

  @hook()
  dataToString(cell: Cell): string {
    const data = this.model.getData(cell)
    if (data != null) {
      if (typeof data.toString === 'function') {
        return data.toString()
      }
    }

    return ''
  }

  @hook()
  getHtml(cell: Cell): HTMLElement | string | null {
    let result = ''
    if (cell != null) {
      result = this.dataToString(cell)
    }
    return result
  }

  @hook()
  getLabel(cell: Cell): HTMLElement | string | null {
    let result = ''

    if (this.labelsVisible && cell != null) {
      const style = this.getStyle(cell)
      if (!style.noLabel) {
        result = this.dataToString(cell)
      }
    }

    return result
  }

  @hook()
  putLabel(cell: Cell, label: string) {
    const data = cell.getData()
    if (typeof data === 'object') {
      throw new Error('Method not implemented.')
    }

    return label
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

  @hook()
  isValidDropTarget(target: Cell, cells: Cell[], e: MouseEvent) {
    return (
      target != null &&
      ((this.isSplitEnabled() && this.isSplitTarget(target, cells, e)) ||
        (!this.model.isEdge(target) &&
          (this.isSwimlane(target) ||
            (this.model.getChildCount(target) > 0 &&
              !this.isCellCollapsed(target)))))
    )
  }

  @hook()
  isSplitTarget(target: Cell, cells: Cell[], e: MouseEvent) {
    if (
      this.model.isEdge(target) &&
      cells != null &&
      cells.length === 1 &&
      this.isCellConnectable(cells[0]) &&
      this.validationManager.isEdgeValid(
        target,
        this.model.getTerminal(target, true),
        cells[0],
      )
    ) {
      const src = this.model.getTerminal(target, true)!
      const trg = this.model.getTerminal(target, false)!

      return (
        !this.model.isAncestor(cells[0], src) &&
        !this.model.isAncestor(cells[0], trg)
      )
    }

    return false
  }

  /**
   * Returns the given cell if it is a drop target for the given cells or the
   * nearest ancestor that may be used as a drop target for the given cells.
   *
   * @param cells Array of `Cell`s which are to be dropped onto the target.
   * @param e Mouseevent for the drag and drop.
   * @param cell `Cell` that is under the mousepointer.
   * @param clone Optional boolean to indicate of cells will be cloned.
   */
  getDropTarget(
    cells: Cell[],
    e: MouseEvent,
    cell: Cell | null,
    clone?: boolean,
  ) {
    if (!this.isSwimlaneNesting()) {
      for (let i = 0; i < cells.length; i += 1) {
        if (this.isSwimlane(cells[i])) {
          return null
        }
      }
    }

    const p = util.clientToGraph(
      this.container,
      DomEvent.getClientX(e),
      DomEvent.getClientY(e),
    )
    p.x -= this.panDx
    p.y -= this.panDy
    const swimlane = this.retrievalManager.getSwimlaneAt(p.x, p.y)

    if (cell == null) {
      // tslint:disable-next-line
      cell = swimlane!
    } else if (swimlane != null) {
      // Checks if the cell is an ancestor of the swimlane
      // under the mouse and uses the swimlane in that case
      let tmp = this.model.getParent(swimlane)

      while (tmp != null && this.isSwimlane(tmp) && tmp !== cell) {
        tmp = this.model.getParent(tmp)
      }

      if (tmp === cell) {
        // tslint:disable-next-line
        cell = swimlane
      }
    }

    while (
      cell != null &&
      !this.isValidDropTarget(cell, cells, e) &&
      !this.model.isLayer(cell)
    ) {
      // tslint:disable-next-line
      cell = this.model.getParent(cell)!
    }

    // Checks if parent is dropped into child if not cloning
    if (clone == null || !clone) {
      let parent = cell

      while (parent != null && util.indexOf(cells, parent) < 0) {
        parent = this.model.getParent(parent)!
      }
    }

    return !this.model.isLayer(cell) && parent == null ? cell : null
  }
}
