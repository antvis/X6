import * as util from '../util'
import { Cell } from '../core/cell'
import { Geometry } from '../core/geometry'
import { Rectangle } from '../struct'
import { Graph } from './graph'
import { BaseManager } from './base-manager'

export class CollapseManager extends BaseManager {
  foldCells(
    collapse: boolean,
    recurse: boolean,
    cells: Cell[],
    checkFoldable: boolean,
  ) {
    this.graph.stopEditing(false)
    this.model.batchUpdate(() => {
      this.graph.trigger(Graph.events.foldCells, { collapse, recurse, cells })
      this.cellsFolded(cells, collapse, recurse, checkFoldable)
    })
    return cells
  }

  cellsFolded(
    cells: Cell[],
    collapse: boolean,
    recurse: boolean,
    checkFoldable: boolean = false,
  ) {
    if (cells != null && cells.length > 0) {
      this.model.batchUpdate(() => {
        cells.forEach(cell => {
          if (
            (!checkFoldable || this.graph.isCellFoldable(cell, collapse)) &&
            collapse !== this.graph.isCellCollapsed(cell)
          ) {
            this.model.setCollapsed(cell, collapse)
            this.swapBounds(cell, collapse)

            if (this.graph.isExtendParent(cell)) {
              this.graph.sizeManager.extendParent(cell)
            }

            if (recurse) {
              const children = this.model.getChildren(cell)
              this.cellsFolded(children, collapse, recurse)
            }

            this.graph.sizeManager.constrainChild(cell)
          }
        })
      })
      this.graph.trigger(Graph.events.cellsFolded, { cells, collapse, recurse })
    }
  }

  swapBounds(cell: Cell, willCollapse: boolean) {
    if (cell != null) {
      let geo = this.model.getGeometry(cell)
      if (geo != null) {
        geo = geo.clone()
        this.updateAlternateBounds(cell, geo, willCollapse)
        geo.swap()
        this.model.setGeometry(cell, geo)
      }
    }
  }

  /**
   * Specifies if the cell size should be changed to the preferred size when
   * a cell is first collapsed.
   *
   * Default is `true`.
   */
  collapseToPreferredSize: boolean = true

  /**
   * Updates or sets the alternate bounds in the given geometry for the
   * given cell depending on whether the cell is going to be collapsed.
   * If no alternate bounds are defined in the geometry and
   * `collapseToPreferredSize` is true, then the preferred size is used for
   * the alternate bounds. The top, left corner is always kept at the same
   * location.
   */
  updateAlternateBounds(cell: Cell, geo: Geometry, willCollapse: boolean) {
    if (cell != null && geo != null) {
      const style = this.graph.getStyle(cell)

      if (geo.alternateBounds == null) {
        let bounds = geo.bounds

        if (this.collapseToPreferredSize) {
          const tmp = this.graph.sizeManager.getCellPreferredSize(cell)
          if (tmp != null) {
            bounds = tmp
            const startSize = style.startSize || 0
            if (startSize > 0) {
              bounds.height = Math.max(bounds.height, startSize)
            }
          }
        }

        geo.alternateBounds = new Rectangle(0, 0, bounds.width, bounds.height)
      }

      if (geo.alternateBounds != null) {
        geo.alternateBounds.x = geo.bounds.x
        geo.alternateBounds.y = geo.bounds.y

        const alpha = util.toRad(style.rotation || 0)
        if (alpha !== 0) {
          const dx = geo.alternateBounds.getCenterX() - geo.bounds.getCenterX()
          const dy = geo.alternateBounds.getCenterY() - geo.bounds.getCenterY()

          const cos = Math.cos(alpha)
          const sin = Math.sin(alpha)

          const dx2 = cos * dx - sin * dy
          const dy2 = sin * dx + cos * dy

          geo.alternateBounds.x += dx2 - dx
          geo.alternateBounds.y += dy2 - dy
        }
      }
    }
  }
}
