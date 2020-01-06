import { StringExt } from '../util'
import { Point, Rectangle } from '../geometry'
import { Cell } from '../core/cell'
import { BaseManager } from './base-manager'
import { globals } from '../option'

export class SizeManager extends BaseManager {
  autoSizeCell(cell: Cell, recurse: boolean) {
    if (recurse) {
      cell.eachChild(child => this.autoSizeCell(child, recurse))
    }

    if (this.model.isNode(cell) && this.graph.isAutoSizeCell(cell)) {
      this.updateCellSize(cell)
    }

    return cell
  }

  updateCellSize(cell: Cell, ignoreChildren: boolean = false) {
    this.model.batchUpdate(() => {
      this.cellSizeUpdated(cell, ignoreChildren)
    })

    return cell
  }

  cellSizeUpdated(cell: Cell, ignoreChildren: boolean) {
    if (cell != null) {
      this.model.batchUpdate(() => {
        const size = this.getCellPreferredSize(cell)
        let geo = this.model.getGeometry(cell)
        if (size != null && geo != null) {
          const collapsed = this.graph.isCellCollapsed(cell)
          geo = geo.clone()

          if (this.graph.isSwimlane(cell)) {
            const style = this.graph.getStyle(cell)
            const cellStyle = this.model.getStyle(cell) || {}

            if (style.horizontal !== false) {
              cellStyle.startSize = size.height + 8

              if (collapsed) {
                geo.bounds.height = size.height + 8
              }

              geo.bounds.width = size.width
            } else {
              cellStyle.startSize = size.width + 8

              if (collapsed) {
                geo.bounds.width = size.width + 8
              }

              geo.bounds.height = size.height
            }

            this.model.setStyle(cell, cellStyle)
          } else {
            geo.bounds.width = size.width
            geo.bounds.height = size.height
          }

          if (!ignoreChildren && !collapsed) {
            const bounds = this.view.getBounds(this.model.getChildren(cell))
            if (bounds != null) {
              const t = this.view.translate
              const s = this.view.scale

              const width = (bounds.x + bounds.width) / s - geo.bounds.x - t.x
              const height = (bounds.y + bounds.height) / s - geo.bounds.y - t.y

              geo.bounds.width = Math.max(geo.bounds.width, width)
              geo.bounds.height = Math.max(geo.bounds.height, height)
            }
          }

          this.cellsResized([cell], [geo.bounds], false)
        }
      })
    }
  }

  getCellPreferredSize(cell: Cell) {
    let result = null

    if (cell != null && !this.model.isEdge(cell)) {
      const state = this.view.getState(cell, true)!
      const style = state.style
      const fontSize = style.fontSize || 12

      let dx = 0
      let dy = 0

      // Adds dimension of image if shape is a label
      if (style.image != null) {
        if (style.shape === 'label') {
          if (style.verticalAlign === 'middle') {
            dx += style.imageWidth || 0
          }

          if (style.align !== 'center') {
            dy += style.imageHeight || 0
          }
        }
      }

      // Adds spacings
      dx += 2 * (style.spacing || 0)
      dx += style.spacingLeft || 0
      dx += style.spacingRight || 0

      dy += 2 * (style.spacing || 0)
      dy += style.spacingTop || 0
      dy += style.spacingBottom || 0

      // Add spacing for collapse/expand icon
      const image = this.graph.collapseManager.getFoldingImage(state)
      if (image != null) {
        dx += image.width + 8
      }

      // Adds space for label
      let value = this.renderer.getLabel(state)
      if (value != null && typeof value === 'string' && value.length > 0) {
        if (!this.graph.isHtmlLabel(state.cell)) {
          value = StringExt.escape(value)
        }

        value = value.replace(/\n/g, '<br>')

        const size = this.getSizeForString(value, fontSize, style.fontFamily)
        let width = size.width + dx
        let height = size.height + dy

        if (style.horizontal === false) {
          const tmp = height

          height = width
          width = tmp
        }

        if (this.graph.isGridEnabled()) {
          width = this.graph.snap(width + this.graph.getGridSize() / 2)
          height = this.graph.snap(height + this.graph.getGridSize() / 2)
        }

        result = new Rectangle(0, 0, width, height)
      } else {
        const gs2 = 4 * this.graph.getGridSize()
        result = new Rectangle(0, 0, gs2, gs2)
      }
    }

    return result
  }

  getSizeForString(
    text: string,
    fontSize: number = globals.defaultFontSize,
    fontFamily: string = globals.defaultFontFamily,
    textWidth?: number,
  ) {
    const div = document.createElement('div')

    div.style.fontFamily = fontFamily
    div.style.fontSize = `${Math.round(fontSize)}px`
    div.style.lineHeight = `${Math.round(fontSize * globals.defaultLineHeight)}`

    // Disables block layout and outside wrapping and hides the div
    div.style.position = 'absolute'
    div.style.visibility = 'hidden'
    div.style.display = 'inline-block'
    div.style.zoom = '1'

    if (textWidth != null) {
      div.style.width = `${textWidth}px`
      div.style.whiteSpace = 'normal'
    } else {
      div.style.whiteSpace = 'nowrap'
    }

    div.innerHTML = text
    document.body.appendChild(div)

    const size = {
      width: div.offsetWidth,
      height: div.offsetHeight,
    }

    document.body.removeChild(div)

    return size
  }

  resizeCells(cells: Cell[], bounds: Rectangle[], recurse: boolean) {
    this.model.batchUpdate(() => {
      this.graph.trigger('cells:resizing', { cells, bounds })
      this.cellsResized(cells, bounds, recurse)
    })

    return cells
  }

  cellsResized(cells: Cell[], bounds: Rectangle[], recurse: boolean = false) {
    if (cells != null && bounds != null && cells.length === bounds.length) {
      this.model.batchUpdate(() => {
        for (let i = 0, ii = cells.length; i < ii; i += 1) {
          this.cellResized(cells[i], bounds[i], false, recurse)

          if (this.graph.isExtendParent(cells[i])) {
            this.extendParent(cells[i])
          }

          this.constrainChild(cells[i])
        }

        if (this.graph.resetEdgesOnResize) {
          this.graph.movingManager.resetOtherEdges(cells)
        }
      })

      this.graph.trigger('cells:resized', { cells, bounds })
    }
  }

  protected cellResized(
    cell: Cell,
    bounds: Rectangle,
    ignoreRelative: boolean,
    recurse: boolean,
  ) {
    let geo = this.model.getGeometry(cell)
    if (
      geo != null &&
      (geo.bounds.x !== bounds.x ||
        geo.bounds.y !== bounds.y ||
        geo.bounds.width !== bounds.width ||
        geo.bounds.height !== bounds.height)
    ) {
      geo = geo.clone()

      if (!ignoreRelative && geo.relative) {
        const offset = geo.offset

        if (offset != null) {
          offset.x += bounds.x - geo.bounds.x
          offset.y += bounds.y - geo.bounds.y
        }
      } else {
        geo.bounds.x = bounds.x
        geo.bounds.y = bounds.y
      }

      geo.bounds.width = bounds.width
      geo.bounds.height = bounds.height

      if (
        !geo.relative &&
        this.model.isNode(cell) &&
        !this.graph.isNegativeCoordinatesAllowed()
      ) {
        geo.bounds.x = Math.max(0, geo.bounds.x)
        geo.bounds.y = Math.max(0, geo.bounds.y)
      }

      this.model.batchUpdate(() => {
        if (recurse) {
          this.graph.resizeChildCells(cell, geo!)
        }

        this.model.setGeometry(cell, geo!)
        this.constrainChildCells(cell)
      })
    }
  }

  scaleCell(cell: Cell, sx: number, sy: number, recurse: boolean) {
    let geo = this.model.getGeometry(cell)
    if (geo != null) {
      geo = geo.clone()

      // Stores values for restoring based on style
      const x = geo.bounds.x
      const y = geo.bounds.y
      const w = geo.bounds.width
      const h = geo.bounds.height

      const style = this.graph.getStyle(cell)
      geo.scale(sx, sy, style.aspect)

      if (style.resizeWidth === true) {
        geo.bounds.width = w * sx
      } else if (style.resizeWidth === false) {
        geo.bounds.width = w
      }

      if (style.resizeHeight === true) {
        geo.bounds.height = h * sy
      } else if (style.resizeHeight === false) {
        geo.bounds.height = h
      }

      if (!this.graph.isCellMovable(cell)) {
        geo.bounds.x = x
        geo.bounds.y = y
      }

      if (!this.graph.isCellResizable(cell)) {
        geo.bounds.width = w
        geo.bounds.height = h
      }

      if (this.model.isNode(cell)) {
        this.cellResized(cell, geo.bounds, true, recurse)
      } else {
        this.model.setGeometry(cell, geo)
      }
    }
    return cell
  }

  /**
   * Resizes the parents recursively so that they contain the complete
   * area of the resized child cell.
   */
  extendParent(cell: Cell | null) {
    if (cell != null) {
      const parent = this.model.getParent(cell)
      let pgeo = this.graph.getCellGeometry(parent!)

      if (
        parent != null &&
        pgeo != null &&
        !this.graph.isCellCollapsed(parent)
      ) {
        const geo = this.graph.getCellGeometry(cell)

        if (
          geo != null &&
          !geo.relative &&
          (pgeo.bounds.width < geo.bounds.x + geo.bounds.width ||
            pgeo.bounds.height < geo.bounds.y + geo.bounds.height)
        ) {
          pgeo = pgeo.clone()

          pgeo.bounds.width = Math.max(
            pgeo.bounds.width,
            geo.bounds.x + geo.bounds.width,
          )

          pgeo.bounds.height = Math.max(
            pgeo.bounds.height,
            geo.bounds.y + geo.bounds.height,
          )

          this.cellsResized([parent], [pgeo.bounds], false)
        }
      }
    }
  }

  /**
   * Keeps the given cell inside the bounds.
   *
   * @param cell - The cell will be constrained.
   * @param  sizeFirst - Specifies if the size should be changed first.
   * Default is `true`.
   */
  constrainChild(cell: Cell, sizeFirst: boolean = true) {
    if (cell != null) {
      let geo = this.graph.getCellGeometry(cell)
      if (
        geo != null &&
        (this.graph.isConstrainRelativeChildren() || !geo.relative)
      ) {
        const parent = this.model.getParent(cell)!
        // const pgeo = this.getCellGeometry(parent)
        let max = this.graph.getMaxGraphBounds()
        // Finds parent offset
        if (max != null) {
          const off = this.graph.getBoundingBoxFromGeometry([parent], false)
          if (off != null) {
            max = max.clone()
            max.x -= off.x
            max.y -= off.y
          }
        }

        if (this.graph.isConstrainChild(cell)) {
          let area = this.getCellContainmentArea(cell)
          if (area != null) {
            const overlap = this.graph.getOverlap(cell)

            if (overlap > 0) {
              area = area.clone()

              area.x -= area.width * overlap
              area.y -= area.height * overlap
              area.width += 2 * area.width * overlap
              area.height += 2 * area.height * overlap
            }

            // Find the intersection between max and tmp
            if (max == null) {
              max = area
            } else {
              max = max.intersect(area)
            }
          }
        }

        if (max != null) {
          const cells = [cell]

          if (!this.graph.isCellCollapsed(cell)) {
            const desc = this.model.getDescendants(cell)

            for (let i = 0; i < desc.length; i += 1) {
              if (this.graph.isCellVisible(desc[i])) {
                cells.push(desc[i])
              }
            }
          }

          const bbox = this.graph.getBoundingBoxFromGeometry(cells, false)

          if (bbox != null) {
            geo = geo.clone()

            // Cumulative horizontal movement
            let dx = 0

            if (geo.bounds.width > max.width) {
              dx = geo.bounds.width - max.width
              geo.bounds.width -= dx
            }

            if (bbox.x + bbox.width > max.x + max.width) {
              dx -= bbox.x + bbox.width - max.x - max.width - dx
            }

            // Cumulative vertical movement
            let dy = 0

            if (geo.bounds.height > max.height) {
              dy = geo.bounds.height - max.height
              geo.bounds.height -= dy
            }

            if (bbox.y + bbox.height > max.y + max.height) {
              dy -= bbox.y + bbox.height - max.y - max.height - dy
            }

            if (bbox.x < max.x) {
              dx -= bbox.x - max.x
            }

            if (bbox.y < max.y) {
              dy -= bbox.y - max.y
            }

            if (dx !== 0 || dy !== 0) {
              if (geo.relative) {
                // Relative geometries are moved via absolute offset
                if (geo.offset == null) {
                  geo.offset = new Point()
                }

                geo.offset.x += dx
                geo.offset.y += dy
              } else {
                geo.bounds.x += dx
                geo.bounds.y += dy
              }
            }

            this.model.setGeometry(cell, geo)
          }
        }
      }
    }
  }

  /**
   * Constrains the children of the given cell.
   */
  constrainChildCells(cell: Cell) {
    cell.eachChild(child => this.constrainChild(child))
  }

  getCellContainmentArea(cell: Cell) {
    if (cell != null && !this.model.isEdge(cell)) {
      const parent = this.model.getParent(cell)
      if (parent != null && parent !== this.graph.getDefaultParent()) {
        const geo = this.model.getGeometry(parent)
        if (geo != null) {
          let x = 0
          let y = 0
          let w = geo.bounds.width
          let h = geo.bounds.height

          if (this.graph.isSwimlane(parent)) {
            const size = this.graph.getStartSize(parent)
            const style = this.graph.getStyle(parent)

            const dir = style.direction || 'east'
            const flipH = style.flipH === true
            const flipV = style.flipV === true

            if (dir === 'south' || dir === 'north') {
              const tmp = size.width
              size.width = size.height
              size.height = tmp
            }

            if (
              (dir === 'east' && !flipV) ||
              (dir === 'north' && !flipH) ||
              (dir === 'west' && flipV) ||
              (dir === 'south' && flipH)
            ) {
              x = size.width
              y = size.height
            }

            w -= size.width
            h -= size.height
          }

          return new Rectangle(x, y, w, h)
        }
      }
    }

    return null
  }

  getBoundingBox(cells: Cell[]) {
    let result: Rectangle | null = null

    if (cells == null || cells.length <= 0) {
      return result
    }

    cells.forEach(cell => {
      if (this.model.isNode(cell) || this.model.isEdge(cell)) {
        const bbox = this.view.getBoundingBox(this.view.getState(cell), true)
        if (bbox != null) {
          if (result == null) {
            result = bbox.clone()
          } else {
            result.add(bbox)
          }
        }
      }
    })

    return result
  }
}
