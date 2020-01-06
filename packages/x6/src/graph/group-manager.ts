import { Cell } from '../core/cell'
import { Geometry } from '../core/geometry'
import { BaseManager } from './base-manager'

export class GroupManager extends BaseManager {
  groupCells(group: Cell, border: number, cells: Cell[]) {
    cells = this.getCellsForGroup(cells) // tslint:disable-line

    if (group == null) {
      group = this.graph.createGroup(cells) // tslint:disable-line
    }

    this.graph.trigger('cells:grouping', { group, cells, border })

    if (cells.length > 0) {
      const bounds = this.getBoundsForGroup(group, cells, border)
      if (bounds != null) {
        // Uses parent of group or previous parent of first child
        let parent = this.model.getParent(group)
        if (parent == null) {
          parent = this.model.getParent(cells[0])
        }

        this.model.batchUpdate(() => {
          // Ensure the group's geometry
          if (this.graph.getCellGeometry(group) == null) {
            this.model.setGeometry(group, new Geometry())
          }

          // Add the group into the parent
          let index = this.model.getChildCount(parent!)
          this.graph.creationManager.cellsAdded(
            [group],
            parent!,
            index,
            null,
            null,
            false,
            false,
            false,
          )

          // Add the children into the group and moves
          index = this.model.getChildCount(group)

          this.graph.creationManager.cellsAdded(
            cells,
            group,
            index,
            null,
            null,
            false,
            false,
            false,
          )

          this.graph.movingManager.cellsMoved(
            cells,
            -bounds.x,
            -bounds.y,
            false,
            false,
            false,
          )

          // Resize the group
          this.graph.sizeManager.cellsResized([group], [bounds], false)
          this.graph.trigger('cells:grouped', { group, cells, border })
        })
      }
    }

    return group
  }

  /**
   * Returns the cells with the same parent as the first cell
   * in the given array.
   */
  protected getCellsForGroup(cells: Cell[]) {
    const result = []

    if (cells != null && cells.length > 0) {
      const parent = this.model.getParent(cells[0])
      result.push(cells[0])

      // Filters selection cells with the same parent
      for (let i = 1, ii = cells.length; i < ii; i += 1) {
        if (this.model.getParent(cells[i]) === parent) {
          result.push(cells[i])
        }
      }
    }

    return result
  }

  /**
   * Returns the bounds to be used for the given group and children.
   */
  protected getBoundsForGroup(group: Cell, children: Cell[], border: number) {
    const result = this.graph.getBoundingBoxFromGeometry(children, true)
    if (result != null) {
      if (this.graph.isSwimlane(group)) {
        const size = this.graph.getStartSize(group)
        result.x -= size.width
        result.y -= size.height
        result.width += size.width
        result.height += size.height
      }

      if (border != null) {
        result.inflate(border)
      }
    }

    return result
  }

  ungroupCells(cells?: Cell[]) {
    let result: Cell[] = []

    if (cells == null) {
      const selected = this.graph.getSelectedCells()
      // Finds the cells with children
      // tslint:disable-next-line
      cells = selected.filter(cell => this.model.getChildCount(cell) > 0)
    }

    if (cells != null && cells.length > 0) {
      this.graph.trigger('cells:ungrouping', { cells })

      this.model.batchUpdate(() => {
        cells!.forEach(cell => {
          let children = this.model.getChildren(cell)
          if (children != null && children.length > 0) {
            children = children.slice()
            const parent = this.model.getParent(cell)!
            const index = this.model.getChildCount(parent)

            this.graph.creationManager.cellsAdded(
              children,
              parent,
              index,
              null,
              null,
              true,
            )
            result = result.concat(children)
          }
        })
        this.removeGroupsAfterUngroup(cells!)
      })

      this.graph.trigger('cells:ungrouped', { cells })
    }

    return result
  }

  removeGroupsAfterUngroup(cells: Cell[]) {
    this.graph.creationManager.cellsRemoved(
      this.graph.creationManager.addAllEdges(cells),
    )
  }

  updateGroupBounds(
    cells: Cell[],
    border: number = 0,
    moveGroup: boolean = false,
    topBorder: number = 0,
    rightBorder: number = 0,
    bottomBorder: number = 0,
    leftBorder: number = 0,
  ) {
    this.model.batchUpdate(() => {
      for (let i = cells.length - 1; i >= 0; i -= 1) {
        let geo = this.graph.getCellGeometry(cells[i])
        if (geo != null) {
          const children = this.graph.getVisibleChildren(cells[i])
          if (children != null && children.length > 0) {
            const bounds = this.graph.getBoundingBoxFromGeometry(children, true)
            if (bounds != null && bounds.width > 0 && bounds.height > 0) {
              let left = 0
              let top = 0

              // Adds the size of the title area for swimlanes
              if (this.graph.isSwimlane(cells[i])) {
                const size = this.graph.getStartSize(cells[i])
                left = size.width
                top = size.height
              }

              geo = geo.clone()

              if (moveGroup) {
                geo.bounds.x = Math.round(
                  geo.bounds.x + bounds.x - border - left - leftBorder,
                )

                geo.bounds.y = Math.round(
                  geo.bounds.y + bounds.y - border - top - topBorder,
                )
              }

              geo.bounds.width = Math.round(
                bounds.width + 2 * border + left + leftBorder + rightBorder,
              )

              geo.bounds.height = Math.round(
                bounds.height + 2 * border + top + topBorder + bottomBorder,
              )

              this.model.setGeometry(cells[i], geo)

              this.graph.movingManager.moveCells(
                children,
                border + left - bounds.x + leftBorder,
                border + top - bounds.y + topBorder,
              )
            }
          }
        }
      }
    })

    return cells
  }

  enterGroup(cell: Cell) {
    if (cell != null && this.graph.isValidRoot(cell)) {
      this.view.setCurrentRoot(cell)
      this.graph.clearSelection()
    }
  }

  exitGroup() {
    const root = this.model.getRoot()
    const current = this.graph.getCurrentRoot()
    if (current != null) {
      let next = this.model.getParent(current)

      // Finds the next valid root in the hierarchy
      while (
        next !== root &&
        !this.graph.isValidRoot(next) &&
        this.model.getParent(next) !== root
      ) {
        next = this.model.getParent(next)!
      }

      // Clears the current root if the new root is
      // the model's root or one of the layers.
      if (next === root || this.model.getParent(next) === root) {
        this.view.setCurrentRoot(null)
      } else {
        this.view.setCurrentRoot(next)
      }

      // Selects the previous root in the graph
      const state = this.view.getState(current)
      if (state != null) {
        this.graph.setCellSelected(current)
      }
    }
  }

  removeCellsFromParent(cells: Cell[]) {
    this.model.batchUpdate(() => {
      const parent = this.graph.getDefaultParent()!
      const index = this.model.getChildCount(parent)

      this.graph.creationManager.cellsAdded(
        cells,
        parent,
        index,
        null,
        null,
        true,
      )
    })
    this.graph.trigger('cells:removedFromParent', { cells })
    return cells
  }
}
