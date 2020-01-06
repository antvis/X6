import { Point } from '../geometry'
import { Cell } from '../core/cell'
import { BaseManager } from './base-manager'
import { Align, VAlign } from '../types'

export class MovingManager extends BaseManager {
  moveCells(
    cells: Cell[],
    dx: number = 0,
    dy: number = 0,
    clone: boolean = false,
    target?: Cell | null,
    e?: MouseEvent,
    cache?: WeakMap<Cell, Cell>,
  ) {
    if (cells != null && (dx !== 0 || dy !== 0 || clone || target != null)) {
      // Removes descendants with ancestors in cells to avoid multiple moving
      cells = this.model.getTopmostCells(cells) // tslint:disable-line

      this.model.batchUpdate(() => {
        const dict = new WeakMap<Cell, boolean>()
        cells.forEach(c => dict.set(c, true))

        const isSelected = (cell: Cell | null) => {
          let node = cell
          while (node != null) {
            if (dict.get(node)) {
              return true
            }

            node = this.model.getParent(node)!
          }

          return false
        }

        // Removes relative edge labels with selected terminals
        const checked = []

        for (let i = 0; i < cells.length; i += 1) {
          const geo = this.graph.getCellGeometry(cells[i])
          const parent = this.model.getParent(cells[i])!

          if (
            geo == null ||
            !geo.relative ||
            !this.model.isEdge(parent) ||
            (!isSelected(this.model.getTerminal(parent, true)) &&
              !isSelected(this.model.getTerminal(parent, false)))
          ) {
            checked.push(cells[i])
          }
        }

        // tslint:disable-next-line
        cells = checked

        if (clone) {
          // tslint:disable-next-line
          cells = this.graph.creationManager.cloneCells(
            cells,
            this.graph.isInvalidEdgesClonable(),
            cache,
          )!

          if (target == null) {
            // tslint:disable-next-line
            target = this.graph.getDefaultParent()!
          }
        }

        const previous = this.graph.isNegativeCoordinatesAllowed()

        if (target != null) {
          this.graph.setNegativeCoordinatesAllowed(true)
        }

        this.graph.trigger('cells:moving', {
          cells,
          dx,
          dy,
          clone,
          target,
          e,
        })

        this.cellsMoved(
          cells,
          dx,
          dy,
          !clone &&
            this.graph.isDisconnectOnMove() &&
            this.graph.isDanglingEdgesEnabled(),
          target == null,
          this.graph.isExtendParentsOnMove() && target == null,
        )

        this.graph.setNegativeCoordinatesAllowed(previous)

        if (target != null) {
          const index = this.model.getChildCount(target)
          this.graph.creationManager.cellsAdded(
            cells,
            target,
            index,
            null,
            null,
            true,
          )
        }
      })
    }

    return cells
  }

  cellsMoved(
    cells: Cell[],
    dx: number,
    dy: number,
    disconnect: boolean,
    constrain: boolean,
    extend: boolean = false,
  ) {
    if (cells != null && (dx !== 0 || dy !== 0)) {
      this.model.batchUpdate(() => {
        if (disconnect) {
          this.graph.disconnectGraph(cells)
        }

        cells.forEach(cell => {
          this.translateCell(cell, dx, dy)
          if (extend && this.graph.isExtendParent(cell)) {
            this.graph.sizeManager.extendParent(cell)
          } else if (constrain) {
            this.graph.sizeManager.constrainChild(cell)
          }
        })

        if (this.graph.resetEdgesOnMove) {
          this.resetOtherEdges(cells)
        }
      })

      this.graph.trigger('cells:moved', {
        cells,
        dx,
        dy,
        disconnect,
      })
    }
  }

  translateCell(cell: Cell, dx: number, dy: number) {
    let geo = this.model.getGeometry(cell)
    if (geo != null) {
      geo = geo.clone()
      geo.translate(dx, dy)

      if (
        !geo.relative &&
        this.model.isNode(cell) &&
        !this.graph.isNegativeCoordinatesAllowed()
      ) {
        geo.bounds.x = Math.max(0, geo.bounds.x)
        geo.bounds.y = Math.max(0, geo.bounds.y)
      }

      if (geo.relative && !this.model.isEdge(cell)) {
        const parent = this.model.getParent(cell)!
        let rot = 0

        if (this.model.isNode(parent)) {
          const style = this.graph.getStyle(parent)
          rot = style.rotation || 0
        }

        if (rot !== 0) {
          const pt = new Point(dx, dy).rotate(-rot, new Point(0, 0))
          dx = pt.x // tslint:disable-line
          dy = pt.y // tslint:disable-line
        }

        if (geo.offset == null) {
          geo.offset = new Point(dx, dy)
        } else {
          geo.offset.x = geo.offset.x + dx
          geo.offset.y = geo.offset.y + dy
        }
      }

      this.model.setGeometry(cell, geo)
    }
  }

  resetOtherEdges(cells: Cell[]) {
    if (cells != null) {
      // Prepares faster cells lookup
      const dict = new WeakMap<Cell, boolean>()
      cells.forEach(c => dict.set(c, true))

      this.model.batchUpdate(() => {
        cells.forEach(cell => {
          const edges = this.model.getEdges(cell)
          if (edges != null) {
            edges.forEach(edge => {
              const [
                source,
                target,
              ] = this.graph.retrievalManager.getVisibleTerminals(edge)

              // Checks if one of the terminals is not in the given array
              if (!dict.get(source!) || !dict.get(target!)) {
                this.resetEdge(edge)
              }
            })
          }

          this.resetOtherEdges(this.model.getChildren(cell))
        })
      })
    }
  }

  resetEdge(edge: Cell) {
    let geo = this.model.getGeometry(edge)
    if (geo != null && geo.points != null && geo.points.length > 0) {
      geo = geo.clone()
      geo.points = []
      this.model.setGeometry(edge, geo)
    }
  }

  alignCells(align: Align | VAlign, cells: Cell[], param?: number) {
    if (cells != null && cells.length > 1) {
      this.graph.trigger('cells:aligning', { align, cells })

      let coord = param

      // Finds the required coordinate for the alignment
      if (coord == null) {
        for (let i = 0, ii = cells.length; i < ii; i += 1) {
          const state = this.view.getState(cells[i])
          if (state != null && !this.model.isEdge(cells[i])) {
            if (coord == null) {
              if (align === 'center') {
                coord = state.bounds.x + state.bounds.width / 2
              } else if (align === 'right') {
                coord = state.bounds.x + state.bounds.width
              } else if (align === 'top') {
                coord = state.bounds.y
              } else if (align === 'middle') {
                coord = state.bounds.y + state.bounds.height / 2
              } else if (align === 'bottom') {
                coord = state.bounds.y + state.bounds.height
              } else {
                coord = state.bounds.x
              }
            } else {
              if (align === 'right') {
                coord = Math.max(coord, state.bounds.x + state.bounds.width)
              } else if (align === 'top') {
                coord = Math.min(coord, state.bounds.y)
              } else if (align === 'bottom') {
                coord = Math.max(coord, state.bounds.y + state.bounds.height)
              } else {
                coord = Math.min(coord, state.bounds.x)
              }
            }
          }
        }
      }

      // Aligns the cells to the coordinate
      this.model.batchUpdate(() => {
        const s = this.view.scale
        cells.forEach(cell => {
          const state = this.view.getState(cell)
          if (state != null && coord != null) {
            const bounds = state.bounds
            let geo = this.graph.getCellGeometry(cell)
            if (geo != null && !this.model.isEdge(cell)) {
              geo = geo.clone()

              if (align === 'center') {
                geo.bounds.x += (coord - bounds.x - bounds.width / 2) / s
              } else if (align === 'right') {
                geo.bounds.x += (coord - bounds.x - bounds.width) / s
              } else if (align === 'top') {
                geo.bounds.y += (coord - bounds.y) / s
              } else if (align === 'middle') {
                geo.bounds.y += (coord - bounds.y - bounds.height / 2) / s
              } else if (align === 'bottom') {
                geo.bounds.y += (coord - bounds.y - bounds.height) / s
              } else {
                geo.bounds.x += (coord - bounds.x) / s
              }

              this.graph.resizeCell(cell, geo.bounds)
            }
          }
        })
      })

      this.graph.trigger('cells:aligned', { align, cells })
    }

    return cells
  }

  orderCells(toBack: boolean, cells: Cell[]) {
    this.graph.trigger('cells:ordering', { cells, toBack })
    this.model.batchUpdate(() => {
      this.cellsOrdered(cells, toBack)
    })
    return cells
  }

  cellsOrdered(cells: Cell[], toBack: boolean) {
    this.model.batchUpdate(() => {
      cells.forEach((cell, i) => {
        const parent = this.model.getParent(cell)!

        if (toBack) {
          this.model.add(parent, cell, i)
        } else {
          this.model.add(parent, cell, this.model.getChildCount(parent) - 1)
        }
      })
    })

    this.graph.trigger('cells:ordered', { cells, toBack })
  }
}
