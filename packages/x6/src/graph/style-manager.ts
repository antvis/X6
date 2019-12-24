import { Cell } from '../core/cell'
import { Style } from '../types'
import { BaseManager } from './base-manager'

export class StyleManager extends BaseManager {
  getCellStyle(cell: Cell | null): Style {
    if (cell != null) {
      const preset = this.model.isEdge(cell)
        ? this.graph.options.edgeStyle
        : this.graph.options.nodeStyle
      const style = this.model.getStyle(cell) || {}
      return {
        ...preset,
        ...style,
      }
    }

    return {}
  }

  setCellStyle(style: Style, cells: Cell[]) {
    if (cells != null) {
      this.model.batchUpdate(() => {
        cells.forEach(cell => this.model.setStyle(cell, style))
      })
    }
  }

  updateCellsStyle(
    key: string,
    value?: string | number | boolean | null,
    cells?: Cell[],
  ) {
    if (cells != null && cells.length > 0) {
      this.model.batchUpdate(() => {
        cells.forEach(cell => {
          if (cell != null) {
            const raw = this.model.getStyle(cell)
            const style = raw != null ? { ...raw } : {}
            if (value == null) {
              delete (style as any)[key]
            } else {
              const tmp = style as any
              tmp[key] = value
            }
            this.model.setStyle(cell, style)
          }
        })
      })
    }
  }

  toggleCellsStyle(key: string, defaultValue: boolean = false, cells: Cell[]) {
    let value = null
    if (cells != null && cells.length > 0) {
      const state = this.view.getState(cells[0])
      const style = state != null ? state.style : this.getCellStyle(cells[0])
      if (style != null) {
        const cur = (style as any)[key]
        if (cur == null) {
          value = defaultValue
        } else {
          value = cur ? false : true
        }
        this.updateCellsStyle(key, value, cells)
      }
    }

    return value
  }

  setCellsStyleFlag(
    key: string,
    flag: number,
    add: boolean | null,
    cells: Cell[],
  ) {
    if (cells != null && cells.length > 0) {
      if (add == null) {
        const style = this.graph.getStyle(cells[0])
        const current = parseInt((style as any)[key], 10) || 0
        add = !((current & flag) === flag) // tslint:disable-line
      }

      this.model.batchUpdate(() => {
        cells.forEach(cell => {
          if (cell != null) {
            this.setCellStyleFlag(key, flag, add!, cell)
          }
        })
      })
    }
  }

  setCellStyleFlag(key: string, flag: number, add: boolean, cell: Cell) {
    const style = this.graph.getStyle(cell)
    const current = parseInt((style as any)[key], 10) || 0
    const exists = (current & flag) === flag
    let target = current
    if (add && !exists) {
      target += flag
    } else if (!add && exists) {
      target -= flag
    }

    if (target !== current) {
      this.updateCellsStyle(key, target, [cell])
    }
  }

  toggleCellsLocked(cells: Cell[]) {
    if (cells.length > 0) {
      const style = this.graph.getStyle(cells[0])
      this.toggleCellsStyle('locked', !!style.locked, cells)
    }
  }

  flipEdge(edge: Cell) {
    if (edge != null && this.graph.alternateEdgeStyle != null) {
      this.graph.trigger('edge:flipping', { edge })

      this.model.batchUpdate(() => {
        const style = this.model.getStyle(edge)
        if (style == null) {
          this.model.setStyle(edge, this.graph.alternateEdgeStyle!)
        } else {
          this.model.setStyle(edge, {})
        }

        // Removes all control points
        this.graph.resetEdge(edge)
      })

      this.graph.trigger('edge:flipped', { edge })
    }

    return edge
  }

  toggleCells(visbile: boolean, cells: Cell[], includeEdges: boolean) {
    // tslint:disable-next-line
    cells = includeEdges ? this.graph.creationManager.addAllEdges(cells) : cells

    if (cells != null && cells.length > 0) {
      this.graph.trigger('cells:showing', { visbile, cells })
      this.model.batchUpdate(() => {
        cells.forEach(cell => this.model.setVisible(cell, visbile))
      })
      this.graph.trigger('cells:showed', { visbile, cells })
    }

    return cells
  }
}
