import { Rectangle } from '../geometry'
import { Cell } from '../core/cell'
import { BaseGraph } from './base-graph'

export class ViewportAccessor extends BaseGraph {
  /**
   * Clears all cell states or the states for the hierarchy starting
   * at the given cell and validates the graph.
   */
  refresh(cell?: Cell) {
    this.view.clear(cell, cell == null)
    this.view.validate()
    this.sizeDidChange()
    this.trigger('refresh')
    return this
  }

  sizeDidChange() {
    this.viewportManager.sizeDidChange()
    return this
  }

  /**
   * Get the bounds of the visible graph.
   */
  getGraphBounds() {
    return this.viewportManager.getGraphBounds()
  }

  /**
   * Get the scaled, translated bounds for the given cell.
   *
   * @param cell The `Cell` whose bounds should be returned.
   * @param includeEdges Optional boolean that specifies if the bounds of
   * the connected edges should be included. Default is `false`.
   * @param includeDescendants Optional boolean that specifies if the bounds
   * of all descendants should be included. Default is `false`.
   */
  getCellBounds(
    cell: Cell,
    includeEdges: boolean = false,
    includeDescendants: boolean = false,
  ) {
    return this.viewportManager.getCellBounds(
      cell,
      includeEdges,
      includeDescendants,
    )
  }

  /**
   * Get the bounding box from the geometries of the cells.
   */
  getBoundingBoxFromGeometry(
    cells: Cell[],
    includeEdges: boolean = false,
  ): Rectangle | null {
    return this.viewportManager.getBoundingBox(cells, includeEdges)
  }
}
