import { Cell } from '../core/cell'
import { Style } from '../types'
import { BaseGraph } from './base-graph'

export class StyleAccessor extends BaseGraph {
  getStyle(cell: Cell | null) {
    const state = this.view.getState(cell)
    return state != null ? state.style : this.getCellStyle(cell)
  }

  /**
   * Returns a key-value pair object representing the cell style for
   * the given cell.
   *
   * Note: You should try to use the cached style in the state before
   * using this method.
   */
  getCellStyle(cell: Cell | null) {
    return this.styleManager.getCellStyle(cell)
  }

  /**
   * Sets the style of the specified cells. If no cells are given, then
   * the current selected cells are changed.
   */
  setCellStyle(style: Style, cells: Cell[] = this.getSelectedCells()) {
    this.styleManager.setCellStyle(style, cells)
    return this
  }

  /**
   * Toggles the boolean value for the given key in the style of the given
   * cell and returns the new value. Optional boolean default value if no
   * value is defined. If no cell is specified then the current selected
   * cell is used.
   */
  toggleCellStyle(
    key: string,
    defaultValue: boolean = false,
    cell: Cell = this.getSelectedCell(),
  ) {
    return this.toggleCellsStyle(key, defaultValue, [cell])
  }

  /**
   * Toggles the boolean value for the given key in the style of the given
   * cells and returns the new value. If no cells are specified, then the
   * current selected cells are used.
   */
  toggleCellsStyle(
    key: string,
    defaultValue: boolean = false,
    cells: Cell[] = this.getSelectedCells(),
  ) {
    return this.styleManager.toggleCellsStyle(key, defaultValue, cells)
  }

  updateStyle(style: Style, cell?: Cell): this
  updateStyle(style: Style, cells?: Cell[]): this
  updateStyle(
    key: string,
    value?: string | number | boolean | null,
    cell?: Cell,
  ): this
  updateStyle(
    key: string,
    value?: string | number | boolean | null,
    cells?: Cell[],
  ): this
  updateStyle(
    key: string | Style,
    value?: (string | number | boolean | null) | Cell | Cell[],
    cells?: Cell | Cell[],
  ) {
    const style: Style = typeof key === 'string' ? { [key]: value } : key
    let targets = (typeof key === 'string' ? cells : value) as Cell | Cell[]
    if (targets == null) {
      targets = this.getSelectedCells()
    }
    if (!Array.isArray(targets)) {
      targets = [targets as Cell]
    }

    Object.keys(style).forEach(name => {
      this.updateCellsStyle(name, (style as any)[name], targets as Cell[])
    })

    return this
  }

  updateCellStyle(
    key: string,
    value?: string | number | boolean | null,
    cell: Cell = this.getSelectedCell(),
  ) {
    this.updateCellsStyle(key, value, [cell])
    return this
  }

  /**
   * Sets the key to value in the styles of the given cells. This will modify
   * the existing cell styles in-place and override any existing assignment
   * for the given key. If no cells are specified, then the selection cells
   * are changed. If no value is specified, then the respective key is
   * removed from the styles.
   */
  updateCellsStyle(
    key: string,
    value?: string | number | boolean | null,
    cells: Cell[] = this.getSelectedCells(),
  ) {
    this.styleManager.updateCellsStyle(key, value, cells)
    return this
  }

  /**
   * Toggles the given bit for the given key in the styles of the specified
   * cells.
   */
  toggleCellsStyleFlag(
    key: string,
    flag: number,
    cells: Cell[] = this.getSelectedCells(),
  ) {
    this.setCellsStyleFlag(key, flag, null, cells)
    return this
  }

  /**
   * Sets or toggles the given bit for the given key in the styles of the
   * specified cells.
   */
  setCellsStyleFlag(
    key: string,
    flag: number,
    value: boolean | null,
    cells: Cell[] = this.getSelectedCells(),
  ) {
    this.styleManager.setCellsStyleFlag(key, flag, value, cells)
    return this
  }

  toggleCellsLocked(cells: Cell[] = this.getSelectedCells()) {
    this.styleManager.toggleCellsLocked(cells)
    return this
  }

  toggleCells(
    show: boolean,
    cells: Cell[] = this.getSelectedCells(),
    includeEdges: boolean = true,
  ) {
    return this.styleManager.toggleCells(show, cells, includeEdges)
  }

  /**
   * Toggles the style of the given edge between null (or empty) and
   * `alternateEdgeStyle`.
   */
  flipEdge(edge: Cell) {
    return this.styleManager.flipEdge(edge)
  }
}
