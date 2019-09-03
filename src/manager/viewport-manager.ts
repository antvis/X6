import * as util from '../util'
import { Graph, Cell } from '../core'
import { detector } from '../common'
import { BaseManager } from './manager-base'
import { Rectangle, Point } from '../struct'
import { Polyline } from '../shape'

export class ViewportManager extends BaseManager {
  constructor(graph: Graph) {
    super(graph)
  }

  get container() {
    return this.graph.container
  }

  getCellBounds(
    cell: Cell,
    includeEdges: boolean,
    includeDescendants: boolean,
  ) {
    let cells = [cell]

    // Includes all connected edges
    if (includeEdges) {
      cells = cells.concat(this.model.getEdges(cell))
    }

    let result = this.view.getBounds(cells)

    // Recursively includes the bounds of the children
    if (includeDescendants) {
      const childCount = this.model.getChildCount(cell)

      for (let i = 0; i < childCount; i += 1) {
        const tmp = this.getCellBounds(
          this.model.getChildAt(cell, i)!,
          includeEdges,
          true,
        )!

        if (result != null) {
          result.add(tmp)
        } else {
          result = tmp
        }
      }
    }

    return result
  }

  getBoundingBoxFromGeometry(cells: Cell[], includeEdges: boolean) {
    let result = null

    if (cells != null) {
      for (let i = 0; i < cells.length; i += 1) {
        if (includeEdges || this.model.isNode(cells[i])) {
          // Computes the bounding box for the points in the geometry
          const geo = this.graph.getCellGeometry(cells[i])

          if (geo != null) {
            let bbox = null

            if (this.model.isEdge(cells[i])) {

              const pts = geo.points
              let tmp = new Rectangle(pts[0].x, pts[0].y, 0, 0)

              const addPoint = (pt: Point | null) => {
                if (pt != null) {
                  if (tmp == null) {
                    tmp = new Rectangle(pt.x, pt.y, 0, 0)
                  } else {
                    tmp.add(new Rectangle(pt.x, pt.y, 0, 0))
                  }
                }
              }

              if (this.model.getTerminal(cells[i], true) == null) {
                addPoint(geo.getTerminalPoint(true))
              }

              if (this.model.getTerminal(cells[i], false) == null) {
                addPoint(geo.getTerminalPoint(false))
              }

              if (pts != null && pts.length > 0) {
                for (let j = 1; j < pts.length; j += 1) {
                  addPoint(pts[j])
                }
              }

              bbox = tmp
            } else {
              const parent = this.model.getParent(cells[i])!

              if (geo.relative) {
                if (
                  this.model.isNode(parent) &&
                  parent !== this.view.currentRoot
                ) {
                  const tmp = this.getBoundingBoxFromGeometry([parent], false)

                  if (tmp != null) {
                    bbox = new Rectangle(
                      geo.bounds.x * tmp.width,
                      geo.bounds.y * tmp.height,
                      geo.bounds.width,
                      geo.bounds.height,
                    )

                    if (util.indexOf(cells, parent) >= 0) {
                      bbox.x += tmp.x
                      bbox.y += tmp.y
                    }
                  }
                }
              } else {
                bbox = Rectangle.clone(geo.bounds)

                if (this.model.isNode(parent) && util.indexOf(cells, parent) >= 0) {
                  const tmp = this.getBoundingBoxFromGeometry([parent], false)

                  if (tmp != null) {
                    bbox.x += tmp.x
                    bbox.y += tmp.y
                  }
                }
              }

              if (bbox != null && geo.offset != null) {
                bbox.x += geo.offset.x
                bbox.y += geo.offset.y
              }
            }

            if (bbox != null) {
              if (result == null) {
                result = Rectangle.clone(bbox)
              } else {
                result.add(bbox)
              }
            }
          }
        }
      }
    }

    return result
  }

  protected shiftPreview1: HTMLElement | null
  protected shiftPreview2: HTMLElement | null

  panGraph(dx: number, dy: number) {
    if (
      this.graph.useScrollbarsForPanning &&
      util.hasScrollbars(this.container)
    ) {
      this.container.scrollLeft = -dx
      this.container.scrollTop = -dy
    } else {
      const canvas = this.view.getStage()!

      if (this.graph.dialect === 'svg') {
        // Puts everything inside the container in a DIV so that it
        // can be moved without changing the state of the container
        if (dx === 0 && dy === 0) {
          // Workaround for ignored removeAttribute on SVG element in IE9 standards
          if (detector.IS_IE) {
            canvas.setAttribute('transform', `translate(${dx},${dy})`)
          } else {
            canvas.removeAttribute('transform')
          }

          if (this.shiftPreview1 != null) {
            let child = this.shiftPreview1.firstChild

            while (child != null) {
              const next = child.nextSibling
              this.container.appendChild(child)
              child = next
            }

            if (this.shiftPreview1.parentNode != null) {
              this.shiftPreview1.parentNode.removeChild(this.shiftPreview1)
            }

            this.shiftPreview1 = null

            this.container.appendChild(canvas.parentNode!)

            child = this.shiftPreview2!.firstChild

            while (child != null) {
              const next = child.nextSibling
              this.container.appendChild(child)
              child = next
            }

            if (this.shiftPreview2!.parentNode != null) {
              this.shiftPreview2!.parentNode.removeChild(this.shiftPreview2!)
            }

            this.shiftPreview2 = null
          }
        } else {
          canvas.setAttribute('transform', `translate(${dx},${dy})`)

          if (this.shiftPreview1 == null) {
            // Needs two divs for stuff before and after the SVG element
            this.shiftPreview1 = document.createElement('div')
            this.shiftPreview1.style.position = 'absolute'
            this.shiftPreview1.style.overflow = 'visible'

            this.shiftPreview2 = document.createElement('div')
            this.shiftPreview2.style.position = 'absolute'
            this.shiftPreview2.style.overflow = 'visible'

            let current = this.shiftPreview1
            let child = this.container.firstChild as HTMLElement

            while (child != null) {
              const next = child.nextSibling as HTMLElement

              // SVG element is moved via transform attribute
              if (child !== canvas.parentNode) {
                current.appendChild(child)
              } else {
                current = this.shiftPreview2
              }

              child = next
            }

            // Inserts elements only if not empty
            if (this.shiftPreview1.firstChild != null) {
              this.container.insertBefore(this.shiftPreview1, canvas.parentNode)
            }

            if (this.shiftPreview2.firstChild != null) {
              this.container.appendChild(this.shiftPreview2)
            }
          }

          this.shiftPreview1.style.left = `${dx}px`
          this.shiftPreview1.style.top = `${dy}px`
          this.shiftPreview2!.style.left = util.toPx(dx)
          this.shiftPreview2!.style.top = util.toPx(dy)
        }
      } else {
        canvas.style.left = util.toPx(dx)
        canvas.style.top = util.toPx(dy)
      }

      this.graph.panDx = dx
      this.graph.panDy = dy

      this.graph.trigger(Graph.events.pan)
    }
  }

  center(
    horizontal: boolean,
    vertical: boolean,
    cx: number,
    cy: number,
  ) {
    const hasScrollbars = util.hasScrollbars(this.container)
    const cw = this.container.clientWidth
    const ch = this.container.clientHeight
    const bounds = this.graph.getGraphBounds()

    const t = this.view.translate
    const s = this.view.scale

    let dx = (horizontal) ? cw - bounds.width : 0
    let dy = (vertical) ? ch - bounds.height : 0

    if (!hasScrollbars) {
      this.view.setTranslate(
        horizontal
          ? Math.floor(t.x - bounds.x * s + dx * cx / s)
          : t.x,
        vertical
          ? Math.floor(t.y - bounds.y * s + dy * cy / s)
          : t.y,
      )
    } else {
      bounds.x -= t.x
      bounds.y -= t.y

      const sw = this.container.scrollWidth
      const sh = this.container.scrollHeight

      if (sw > cw) {
        dx = 0
      }

      if (sh > ch) {
        dy = 0
      }

      this.view.setTranslate(
        Math.floor(dx / 2 - bounds.x),
        Math.floor(dy / 2 - bounds.y),
      )

      this.container.scrollLeft = (sw - cw) / 2
      this.container.scrollTop = (sh - ch) / 2
    }
  }

  zoom(factor: number, center: boolean) {
    const scale = Math.round(this.view.scale * factor * 100) / 100
    const state = this.view.getState(this.graph.getSelectedCell())
    // tslint:disable-next-line
    factor = scale / this.view.scale

    if (this.graph.keepSelectionVisibleOnZoom && state != null) {
      const rect = new Rectangle(
        state.bounds.x * factor,
        state.bounds.y * factor,
        state.bounds.width * factor,
        state.bounds.height * factor,
      )

      // Refreshes the display only once if a scroll is carried out
      this.view.scale = scale

      if (!this.scrollRectToVisible(rect)) {
        this.view.revalidate()

        // Forces an event to be fired but does not revalidate again
        this.view.setScale(scale)
      }
    } else {
      const hasScrollbars = util.hasScrollbars(this.container)

      if (center && !hasScrollbars) {
        let dx = this.container.offsetWidth
        let dy = this.container.offsetHeight

        if (factor > 1) {
          const f = (factor - 1) / (scale * 2)
          dx *= -f
          dy *= -f
        } else {
          const f = (1 / factor - 1) / (this.view.scale * 2)
          dx *= f
          dy *= f
        }

        this.view.scaleAndTranslate(
          scale,
          this.view.translate.x + dx,
          this.view.translate.y + dy,
        )
      } else {
        // Allows for changes of translate and scrollbars during setscale
        const tx = this.view.translate.x
        const ty = this.view.translate.y
        const sl = this.container.scrollLeft
        const st = this.container.scrollTop

        this.view.setScale(scale)

        if (hasScrollbars) {
          let dx = 0
          let dy = 0

          if (center) {
            dx = this.container.offsetWidth * (factor - 1) / 2
            dy = this.container.offsetHeight * (factor - 1) / 2
          }

          this.container.scrollLeft = (this.view.translate.x - tx) * this.view.scale
            + Math.round(sl * factor + dx)
          this.container.scrollTop = (this.view.translate.y - ty) * this.view.scale
            + Math.round(st * factor + dy)
        }
      }
    }
  }

  zoomToRect(rect: Rectangle) {
    const scaleX = this.container.clientWidth / rect.width
    const scaleY = this.container.clientHeight / rect.height
    const aspectFactor = scaleX / scaleY

    // Remove any overlap of the rect outside the client area
    rect.x = Math.max(0, rect.x)
    rect.y = Math.max(0, rect.y)
    let rectRight = Math.min(this.container.scrollWidth, rect.x + rect.width)
    let rectBottom = Math.min(this.container.scrollHeight, rect.y + rect.height)
    rect.width = rectRight - rect.x
    rect.height = rectBottom - rect.y

    // The selection area has to be increased to the same aspect
    // ratio as the container, centred around the centre point of the
    // original rect passed in.
    if (aspectFactor < 1.0) {
      // Height needs increasing
      const newHeight = rect.height / aspectFactor
      const deltaHeightBuffer = (newHeight - rect.height) / 2.0
      rect.height = newHeight

      // Assign up to half the buffer to the upper part of the rect, not crossing 0
      // put the rest on the bottom
      const upperBuffer = Math.min(rect.y, deltaHeightBuffer)
      rect.y = rect.y - upperBuffer

      // Check if the bottom has extended too far
      rectBottom = Math.min(this.container.scrollHeight, rect.y + rect.height)
      rect.height = rectBottom - rect.y
    } else {
      // Width needs increasing
      const newWidth = rect.width * aspectFactor
      const deltaWidthBuffer = (newWidth - rect.width) / 2.0
      rect.width = newWidth

      // Assign up to half the buffer to the upper part of the rect, not crossing 0
      // put the rest on the bottom
      const leftBuffer = Math.min(rect.x, deltaWidthBuffer)
      rect.x = rect.x - leftBuffer

      // Check if the right hand side has extended too far
      rectRight = Math.min(this.container.scrollWidth, rect.x + rect.width)
      rect.width = rectRight - rect.x
    }

    const scale = this.container.clientWidth / rect.width
    const newScale = this.view.scale * scale

    if (!util.hasScrollbars(this.container)) {
      this.view.scaleAndTranslate(
        newScale,
        (this.view.translate.x - rect.x / this.view.scale),
        (this.view.translate.y - rect.y / this.view.scale),
      )
    } else {
      this.view.setScale(newScale)
      this.container.scrollLeft = Math.round(rect.x * scale)
      this.container.scrollTop = Math.round(rect.y * scale)
    }
  }

  scrollCellToVisible(cell: Cell, center: boolean = false) {
    const x = -this.view.translate.x
    const y = -this.view.translate.y

    const state = this.view.getState(cell)

    if (state != null) {
      const bounds = new Rectangle(
        x + state.bounds.x,
        y + state.bounds.y,
        state.bounds.width,
        state.bounds.height,
      )

      if (center && this.container != null) {
        const w = this.container.clientWidth
        const h = this.container.clientHeight

        bounds.x = bounds.getCenterX() - w / 2
        bounds.width = w
        bounds.y = bounds.getCenterY() - h / 2
        bounds.height = h
      }

      const tr = new Point(this.view.translate.x, this.view.translate.y)

      if (this.scrollRectToVisible(bounds)) {
        // Triggers an update via the view's event source
        const tr2 = new Point(this.view.translate.x, this.view.translate.y)
        this.view.translate.x = tr.x
        this.view.translate.y = tr.y
        this.view.setTranslate(tr2.x, tr2.y)
      }
    }
  }

  scrollRectToVisible(rect: Rectangle) {
    let isChanged = false

    if (rect != null) {
      const w = this.container.offsetWidth
      const h = this.container.offsetHeight

      const widthLimit = Math.min(w, rect.width)
      const heightLimit = Math.min(h, rect.height)

      if (util.hasScrollbars(this.container)) {
        const c = this.container
        rect.x += this.view.translate.x
        rect.y += this.view.translate.y
        let dx = c.scrollLeft - rect.x
        const ddx = Math.max(dx - c.scrollLeft, 0)

        if (dx > 0) {
          c.scrollLeft -= dx + 2
        } else {
          dx = rect.x + widthLimit - c.scrollLeft - c.clientWidth

          if (dx > 0) {
            c.scrollLeft += dx + 2
          }
        }

        let dy = c.scrollTop - rect.y
        const ddy = Math.max(0, dy - c.scrollTop)

        if (dy > 0) {
          c.scrollTop -= dy + 2
        } else {
          dy = rect.y + heightLimit - c.scrollTop - c.clientHeight

          if (dy > 0) {
            c.scrollTop += dy + 2
          }
        }

        if (!this.graph.useScrollbarsForPanning && (ddx !== 0 || ddy !== 0)) {
          this.view.setTranslate(ddx, ddy)
        }
      } else {
        const x = -this.view.translate.x
        const y = -this.view.translate.y

        const s = this.view.scale

        if (rect.x + widthLimit > x + w) {
          this.view.translate.x -= (rect.x + widthLimit - w - x) / s
          isChanged = true
        }

        if (rect.y + heightLimit > y + h) {
          this.view.translate.y -= (rect.y + heightLimit - h - y) / s
          isChanged = true
        }

        if (rect.x < x) {
          this.view.translate.x += (x - rect.x) / s
          isChanged = true
        }

        if (rect.y < y) {
          this.view.translate.y += (y - rect.y) / s
          isChanged = true
        }

        if (isChanged) {
          this.view.refresh()
          // Repaints selection marker (ticket 18)
          this.graph.selectionHandler.refresh()
        }
      }
    }

    return isChanged
  }

  scrollPointToVisible(
    x: number,
    y: number,
    extend: boolean,
    border: number,
  ) {
    if (
      !this.graph.timerAutoScroll && (
        this.graph.ignoreScrollbars ||
        util.hasScrollbars(this.container)
      )
    ) {
      const c = this.container

      if (
        x >= c.scrollLeft &&
        y >= c.scrollTop &&
        x <= c.scrollLeft + c.clientWidth &&
        y <= c.scrollTop + c.clientHeight
      ) {
        let dx = c.scrollLeft + c.clientWidth - x

        if (dx < border) {
          const old = c.scrollLeft
          c.scrollLeft += border - dx

          // Automatically extends the canvas size to the bottom, right
          // if the event is outside of the canvas and the edge of the
          // canvas has been reached. Notes: Needs fix for IE.
          if (extend && old === c.scrollLeft) {
            if (this.graph.dialect === 'svg') {
              const root = (this.view.getDrawPane() as SVGElement).ownerSVGElement!
              const width = this.container.scrollWidth + border - dx

              // Updates the clipping region. This is an expensive
              // operation that should not be executed too often.
              root.style.width = util.toPx(width)
            } else {
              const width = Math.max(c.clientWidth, c.scrollWidth) + border - dx
              const stage = this.view.getStage()!
              stage.style.width = util.toPx(width)
            }

            c.scrollLeft += border - dx
          }
        } else {
          dx = x - c.scrollLeft

          if (dx < border) {
            c.scrollLeft -= border - dx
          }
        }

        let dy = c.scrollTop + c.clientHeight - y

        if (dy < border) {
          const old = c.scrollTop
          c.scrollTop += border - dy

          if (old === c.scrollTop && extend) {
            if (this.graph.dialect === 'svg') {
              const root = (this.view.getDrawPane() as SVGElement).ownerSVGElement!
              const height = this.container.scrollHeight + border - dy

              // Updates the clipping region. This is an expensive
              // operation that should not be executed too often.
              root.style.height = util.toPx(height)
            } else {
              const height = Math.max(c.clientHeight, c.scrollHeight) + border - dy
              const canvas = this.view.getStage()!
              canvas.style.height = util.toPx(height)
            }

            c.scrollTop += border - dy
          }
        } else {
          dy = y - c.scrollTop

          if (dy < border) {
            c.scrollTop -= border - dy
          }
        }
      }
    } else if (
      this.graph.allowAutoPanning &&
      !this.graph.panningHandler.isActive()
    ) {
      if (this.graph.panningManager == null) {
        this.graph.panningManager = this.createPanningManager()
      }

      this.graph.panningManager.panTo(
        x + this.graph.panDx,
        y + this.graph.panDy,
      )
    }
  }

  createPanningManager() {
    // TODO: xx
    // return new PanningManager(this)
  }

  /**
   * Returns the size of the border and padding on all four sides of the
   * container. The left, top, right and bottom borders are stored in the x, y,
   * width and height of the returned <Rect>, respectively.
   */
  getBorderSizes() {
    const css = util.getCurrentStyle(this.container)
    return new Rectangle(
      util.parseCssNumber(css.paddingLeft) +
      (css.borderLeftStyle !== 'none' ? util.parseCssNumber(css.borderLeftWidth) : 0),
      util.parseCssNumber(css.paddingTop) +
      (css.borderTopStyle !== 'none' ? util.parseCssNumber(css.borderTopWidth) : 0),
      util.parseCssNumber(css.paddingRight) +
      (css.borderRightStyle !== 'none' ? util.parseCssNumber(css.borderRightWidth) : 0),
      util.parseCssNumber(css.paddingBottom) +
      (css.borderBottomStyle !== 'none' ? util.parseCssNumber(css.borderBottomWidth) : 0))
  }

  fit(
    border: number,
    keepOrigin: boolean,
    margin: number,
    enabled: boolean,
    ignoreWidth: boolean,
    ignoreHeight: boolean,
    maxHeight?: number,
  ) {
    if (this.container != null) {
      // Adds spacing and border from css
      const cssBorder = this.getBorderSizes()
      let w1 = this.container.offsetWidth - cssBorder.x - cssBorder.width - 1
      let h1 = maxHeight != null
        ? maxHeight
        : this.container.offsetHeight - cssBorder.y - cssBorder.height - 1
      let bounds = this.view.getGraphBounds()

      if (bounds.width > 0 && bounds.height > 0) {
        if (keepOrigin && bounds.x != null && bounds.y != null) {
          bounds = bounds.clone()
          bounds.width += bounds.x
          bounds.height += bounds.y
          bounds.x = 0
          bounds.y = 0
        }

        // LATER: Use unscaled bounding boxes to fix rounding errors
        const s = this.view.scale
        let w2 = bounds.width / s
        let h2 = bounds.height / s

        // Fits to the size of the background image if required
        if (this.graph.backgroundImage != null) {
          w2 = Math.max(w2, this.graph.backgroundImage.width - bounds.x / s)
          h2 = Math.max(h2, this.graph.backgroundImage.height - bounds.y / s)
        }

        const b = ((keepOrigin) ? border : 2 * border) + margin + 1

        w1 -= b
        h1 -= b

        let s2 = (((ignoreWidth) ? h1 / h2 : (ignoreHeight) ? w1 / w2 :
          Math.min(w1 / w2, h1 / h2)))

        if (this.graph.minFitScale != null) {
          s2 = Math.max(s2, this.graph.minFitScale)
        }

        if (this.graph.maxFitScale != null) {
          s2 = Math.min(s2, this.graph.maxFitScale)
        }

        if (enabled) {
          if (!keepOrigin) {
            if (!util.hasScrollbars(this.container)) {
              const x0 = (bounds.x != null)
                ? Math.floor(this.view.translate.x - bounds.x / s + border / s2 + margin / 2)
                : border

              const y0 = (bounds.y != null)
                ? Math.floor(this.view.translate.y - bounds.y / s + border / s2 + margin / 2)
                : border

              this.view.scaleAndTranslate(s2, x0, y0)
            } else {
              this.view.setScale(s2)
              const b2 = this.graph.getGraphBounds()

              if (b2.x != null) {
                this.container.scrollLeft = b2.x
              }

              if (b2.y != null) {
                this.container.scrollTop = b2.y
              }
            }
          } else if (this.view.scale !== s2) {
            this.view.setScale(s2)
          }
        } else {
          return s2
        }
      }
    }

    return this.view.scale
  }

  /**
   * Called when the size of the graph has changed.
   */
  sizeDidChange() {
    const bounds = this.graph.getGraphBounds()

    if (this.container != null) {
      const border = this.graph.getBorder()

      let width = Math.max(0, bounds.x + bounds.width + 2 * border * this.view.scale)
      let height = Math.max(0, bounds.y + bounds.height + 2 * border * this.view.scale)

      if (this.graph.minimumContainerSize != null) {
        width = Math.max(width, this.graph.minimumContainerSize.width)
        height = Math.max(height, this.graph.minimumContainerSize.height)
      }

      if (this.graph.resizeContainer) {
        this.doResizeContainer(width, height)
      }

      if (this.graph.preferPageSize || (!detector.IS_IE && this.graph.pageVisible)) {
        const size = this.getPreferredPageSize(bounds, Math.max(1, width), Math.max(1, height))

        if (size != null) {
          width = size.width * this.view.scale
          height = size.height * this.view.scale
        }
      }

      if (this.graph.minimumGraphSize != null) {
        width = Math.max(width, this.graph.minimumGraphSize.width * this.view.scale)
        height = Math.max(height, this.graph.minimumGraphSize.height * this.view.scale)
      }

      width = Math.ceil(width)
      height = Math.ceil(height)

      if (this.graph.dialect === 'svg') {
        const root = (this.view.getDrawPane() as SVGGElement).ownerSVGElement
        if (root != null) {
          root.style.minWidth = `${Math.max(1, width)}px`
          root.style.minHeight = `${Math.max(1, height)}px`
          root.style.width = '100%'
          root.style.height = '100%'
        }
      } else {
        if (detector.IS_QUIRKS) {
          // Quirks mode does not support minWidth/-Height
          this.view.updateHtmlStageSize(Math.max(1, width), Math.max(1, height))
        } else {
          const canvas = this.view.getStage()!
          canvas.style.minWidth = `${Math.max(1, width)}px`
          canvas.style.minHeight = `${Math.max(1, height)}px`
        }
      }

      this.updatePageBreaks(this.graph.pageBreaksVisible, width, height)
    }

    this.graph.trigger(Graph.events.size, bounds)
  }

  /**
   * Returns the preferred size of the background page if <preferPageSize> is true.
   */
  protected getPreferredPageSize(
    bounds: Rectangle,
    width: number,
    height: number,
  ) {
    // const scale = this.view.scale
    const tr = this.view.translate
    const fmt = this.graph.pageFormat
    const ps = this.graph.pageScale
    const page = new Rectangle(0, 0, Math.ceil(fmt.width * ps), Math.ceil(fmt.height * ps))

    const hCount = (this.graph.pageBreaksVisible) ? Math.ceil(width / page.width) : 1
    const vCount = (this.graph.pageBreaksVisible) ? Math.ceil(height / page.height) : 1

    return new Rectangle(0, 0, hCount * page.width + 2 + tr.x, vCount * page.height + 2 + tr.y)
  }

  /**
   * Resizes the container for the given graph width and height.
   */
  protected doResizeContainer(width: number, height: number) {
    const w = this.graph.maximumContainerSize != null
      ? Math.min(this.graph.maximumContainerSize.width, width)
      : width

    const h = this.graph.maximumContainerSize != null
      ? Math.min(this.graph.maximumContainerSize.height, height)
      : height

    this.container.style.width = `${Math.ceil(w)}px`
    this.container.style.height = `${Math.ceil(h)}px`
  }

  protected verticalPageBreaks: Polyline[]
  protected horizontalPageBreaks: Polyline[]

  /**
   * Invokes from <sizeDidChange> to redraw the page breaks.
   *
   * Parameters:
   *
   * visible - Boolean that specifies if page breaks should be shown.
   * width - Specifies the width of the container in pixels.
   * height - Specifies the height of the container in pixels.
   */
  protected updatePageBreaks(visible: boolean, width: number, height: number) {
    const scale = this.view.scale
    const tr = this.view.translate
    const fmt = this.graph.pageFormat
    const ps = scale * this.graph.pageScale
    const bounds = new Rectangle(0, 0, fmt.width * ps, fmt.height * ps)

    const gb = Rectangle.clone(this.graph.getGraphBounds())
    gb.width = Math.max(1, gb.width)
    gb.height = Math.max(1, gb.height)

    bounds.x = Math.floor((gb.x - tr.x * scale) / bounds.width) * bounds.width + tr.x * scale
    bounds.y = Math.floor((gb.y - tr.y * scale) / bounds.height) * bounds.height + tr.y * scale

    gb.width = Math.ceil((gb.width + (gb.x - bounds.x)) / bounds.width) * bounds.width
    gb.height = Math.ceil((gb.height + (gb.y - bounds.y)) / bounds.height) * bounds.height

    // Does not show page breaks if the scale is too small
    // tslint:disable-next-line
    visible = visible && Math.min(bounds.width, bounds.height) > this.graph.minPageBreakDist

    const horizontalCount = (visible) ? Math.ceil(gb.height / bounds.height) + 1 : 0
    const verticalCount = (visible) ? Math.ceil(gb.width / bounds.width) + 1 : 0
    const right = (verticalCount - 1) * bounds.width
    const bottom = (horizontalCount - 1) * bounds.height

    if (this.horizontalPageBreaks == null && horizontalCount > 0) {
      this.horizontalPageBreaks = []
    }

    if (this.verticalPageBreaks == null && verticalCount > 0) {
      this.verticalPageBreaks = []
    }

    const drawPageBreaks = (breaks: Polyline[]) => {
      if (breaks != null) {
        const count = breaks === this.horizontalPageBreaks
          ? horizontalCount
          : verticalCount

        for (let i = 0; i <= count; i += 1) {
          const pts = breaks === this.horizontalPageBreaks
            ? [
              new Point(Math.round(bounds.x), Math.round(bounds.y + i * bounds.height)),
              new Point(Math.round(bounds.x + right), Math.round(bounds.y + i * bounds.height)),
            ]
            : [
              new Point(Math.round(bounds.x + i * bounds.width), Math.round(bounds.y)),
              new Point(Math.round(bounds.x + i * bounds.width), Math.round(bounds.y + bottom)),
            ]

          if (breaks[i] != null) {
            breaks[i].points = pts
            breaks[i].redraw()
          } else {
            const pageBreak = new Polyline(pts, this.graph.pageBreakColor)
            pageBreak.dialect = this.graph.dialect
            pageBreak.pointerEvents = false
            pageBreak.dashed = this.graph.pageBreakDashed
            pageBreak.init(this.view.getBackgroundPane()!)
            pageBreak.redraw()

            breaks[i] = pageBreak
          }
        }

        for (let i = count; i < breaks.length; i += 1) {
          breaks[i].dispose()
        }

        breaks.splice(count, breaks.length - count)
      }
    }

    drawPageBreaks(this.horizontalPageBreaks)
    drawPageBreaks(this.verticalPageBreaks)
  }
}
