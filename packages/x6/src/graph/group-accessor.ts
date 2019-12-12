import { afterCreate } from './decorator'
import { Cell } from '../core/cell'
import { BaseGraph } from './base-graph'

export class GroupAccessor extends BaseGraph {
  @afterCreate()
  createGroup(cells: Cell[]) {
    const group = new Cell(null, null, { connectable: false })
    group.asNode(true)
    return group
  }

  /**
   * Adds the cells into the given group.
   *
   * @param group The target group. If null is specified then a new group
   * is created.
   * @param border Optional integer that specifies the border between the
   * child area and the group bounds. Default is `0`.
   * @param cells Optional array of `Cell`s to be grouped. If null is
   * specified then the selection cells are used.
   */
  groupCells(
    group: Cell | null = null,
    border: number = 0,
    cells: Cell[] = Cell.sortCells(this.getSelectedCells(), true),
  ) {
    return this.groupManager.groupCells(group!, border, cells)
  }

  ungroup(group: Cell) {
    return this.ungroups([group])
  }

  /**
   * Ungroups the given cells by moving the children to their parents parent
   * and removing the empty groups. Returns the children that have been
   * removed from the groups.
   *
   * @param cells Array of cells to be ungrouped. If null is specified then
   * the selection cells are used.
   */
  ungroups(cells?: Cell[]) {
    return this.groupManager.ungroupCells(cells)
  }

  /**
   * Updates the bounds of the given groups to include all children and
   * returns the passed-in cells. Call this with the groups in parent to
   * child order, top-most group first, the cells are processed in reverse
   * order and cells with no children are ignored.
   *
   * @param cells - The groups whose bounds should be updated. If this is
   * null, then the selection cells are used.
   * @param border - Optional border to be added in the group. Default is `0`.
   * @param moveGroup - Optional boolean that allows the group to be moved.
   * Default is `false`.
   * @param topBorder - Optional top border to be added in the group.
   * Default is `0`.
   * @param rightBorder - Optional top border to be added in the group.
   * Default is `0`.
   * @param bottomBorder - Optional top border to be added in the group.
   * Default is `0`.
   * @param leftBorder - Optional top border to be added in the group.
   * Default is `0`.
   */
  updateGroupBounds(
    cells: Cell[] = this.getSelectedCells(),
    border: number = 0,
    moveGroup: boolean = false,
    topBorder: number = 0,
    rightBorder: number = 0,
    bottomBorder: number = 0,
    leftBorder: number = 0,
  ) {
    return this.groupManager.updateGroupBounds(
      cells,
      border,
      moveGroup,
      topBorder,
      rightBorder,
      bottomBorder,
      leftBorder,
    )
  }

  /**
   * Uses the given cell as the root of the displayed cell hierarchy.
   */
  enterGroup(cell: Cell = this.getSelectedCell()) {
    this.groupManager.enterGroup(cell)
    return this
  }

  /**
   * Changes the current root to the next valid root.
   */
  exitGroup() {
    this.groupManager.exitGroup()
    return this
  }

  /**
   * Removes the specified cells from their parents and adds them to the
   * default parent. Returns the cells that were removed from their parents.
   */
  removeCellsFromParent(cells: Cell[] = this.getSelectedCells()) {
    return this.groupManager.removeCellsFromParent(cells)
  }
}
