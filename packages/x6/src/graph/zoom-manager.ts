import * as util from '../util'
import { Cell } from '../core/cell'
import { Rectangle, Point } from '../struct'
import { BaseManager } from './base-manager'

export class ZoomManager extends BaseManager {
  center(horizontal: boolean, vertical: boolean, cx: number, cy: number) {
    const hasScrollbars = util.hasScrollbars(this.container)
    const bounds = this.graph.getGraphBounds()
    const cw = this.container.clientWidth
    const ch = this.container.clientHeight

    const t = this.view.translate
    const s = this.view.scale

    let dx = horizontal ? cw - bounds.width : 0
    let dy = vertical ? ch - bounds.height : 0

    if (!hasScrollbars) {
      const tx = horizontal
        ? Math.floor(t.x - bounds.x * s + (dx * cx) / s)
        : t.x
      const ty = vertical ? Math.floor(t.y - bounds.y * s + (dy * cy) / s) : t.y
      this.view.setTranslate(tx, ty)
    } else {
      const sw = this.container.scrollWidth
      const sh = this.container.scrollHeight

      if (sw > cw) {
        dx = 0
      }

      if (sh > ch) {
        dy = 0
      }

      this.view.setTranslate(
        Math.floor(dx / 2 - (bounds.x - t.x)),
        Math.floor(dy / 2 - (bounds.y - t.y)),
      )

      this.container.scrollLeft = (sw - cw) / 2
      this.container.scrollTop = (sh - ch) / 2
    }
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
      let h1 =
        maxHeight != null
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

        const s = this.view.scale
        const w2 = bounds.width / s
        const h2 = bounds.height / s
        const b = (keepOrigin ? border : 2 * border) + margin + 1

        w1 -= b
        h1 -= b

        let s2 = ignoreWidth
          ? h1 / h2
          : ignoreHeight
          ? w1 / w2
          : Math.min(w1 / w2, h1 / h2)

        if (this.graph.minFitScale != null) {
          s2 = Math.max(s2, this.graph.minFitScale)
        }

        if (this.graph.maxFitScale != null) {
          s2 = Math.min(s2, this.graph.maxFitScale)
        }

        if (enabled) {
          if (!keepOrigin) {
            if (!util.hasScrollbars(this.container)) {
              const x0 =
                bounds.x != null
                  ? Math.floor(
                      this.view.translate.x -
                        bounds.x / s +
                        border / s2 +
                        margin / 2,
                    )
                  : border

              const y0 =
                bounds.y != null
                  ? Math.floor(
                      this.view.translate.y -
                        bounds.y / s +
                        border / s2 +
                        margin / 2,
                    )
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

  zoom(factor: number, center: boolean) {
    let scale = Math.round(this.view.scale * factor * 100) / 100
    scale = util.clamp(scale, this.graph.minScale, this.graph.maxScale)
    factor = scale / this.view.scale // tslint:disable-line

    const state = this.view.getState(this.graph.getSelectedCell())
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
            dx = (this.container.offsetWidth * (factor - 1)) / 2
            dy = (this.container.offsetHeight * (factor - 1)) / 2
          }

          const t = this.view.translate
          const s = this.view.scale
          this.container.scrollLeft =
            (t.x - tx) * s + Math.round(sl * factor + dx)
          this.container.scrollTop =
            (t.y - ty) * s + Math.round(st * factor + dy)
        }
      }
    }
  }

  zoomToRect(rect: Rectangle) {
    const container = this.container
    const scaleX = container.clientWidth / rect.width
    const scaleY = container.clientHeight / rect.height
    const aspectFactor = scaleX / scaleY

    // Remove any overlap of the rect outside the client area
    rect.x = Math.max(0, rect.x)
    rect.y = Math.max(0, rect.y)
    let rectRight = Math.min(container.scrollWidth, rect.x + rect.width)
    let rectBottom = Math.min(container.scrollHeight, rect.y + rect.height)
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

      // Assign up to half the buffer to the upper part of the rect,
      // not crossing 0 put the rest on the bottom
      const upperBuffer = Math.min(rect.y, deltaHeightBuffer)
      rect.y = rect.y - upperBuffer

      // Check if the bottom has extended too far
      rectBottom = Math.min(container.scrollHeight, rect.y + rect.height)
      rect.height = rectBottom - rect.y
    } else {
      // Width needs increasing
      const newWidth = rect.width * aspectFactor
      const deltaWidthBuffer = (newWidth - rect.width) / 2.0
      rect.width = newWidth

      // Assign up to half the buffer to the upper part of the rect,
      // not crossing 0 put the rest on the bottom
      const leftBuffer = Math.min(rect.x, deltaWidthBuffer)
      rect.x = rect.x - leftBuffer

      // Check if the right hand side has extended too far
      rectRight = Math.min(container.scrollWidth, rect.x + rect.width)
      rect.width = rectRight - rect.x
    }

    const scale = container.clientWidth / rect.width
    const newScale = this.view.scale * scale

    if (!util.hasScrollbars(container)) {
      this.view.scaleAndTranslate(
        newScale,
        this.view.translate.x - rect.x / this.view.scale,
        this.view.translate.y - rect.y / this.view.scale,
      )
    } else {
      this.view.setScale(newScale)
      container.scrollLeft = Math.round(rect.x * scale)
      container.scrollTop = Math.round(rect.y * scale)
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

  scrollPointToVisible(x: number, y: number, extend: boolean, border: number) {
    if (
      !this.graph.timerAutoScroll &&
      (this.graph.ignoreScrollbars || util.hasScrollbars(this.container))
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
              const root = (this.view.getDrawPane() as SVGElement)
                .ownerSVGElement!
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
              const root = (this.view.getDrawPane() as SVGElement)
                .ownerSVGElement!
              const height = this.container.scrollHeight + border - dy

              // Updates the clipping region. This is an expensive
              // operation that should not be executed too often.
              root.style.height = util.toPx(height)
            } else {
              const height =
                Math.max(c.clientHeight, c.scrollHeight) + border - dy
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
    const css = util.getComputedStyle(this.container)
    return new Rectangle(
      util.parseCssNumber(css.paddingLeft) +
        (css.borderLeftStyle !== 'none'
          ? util.parseCssNumber(css.borderLeftWidth)
          : 0),
      util.parseCssNumber(css.paddingTop) +
        (css.borderTopStyle !== 'none'
          ? util.parseCssNumber(css.borderTopWidth)
          : 0),
      util.parseCssNumber(css.paddingRight) +
        (css.borderRightStyle !== 'none'
          ? util.parseCssNumber(css.borderRightWidth)
          : 0),
      util.parseCssNumber(css.paddingBottom) +
        (css.borderBottomStyle !== 'none'
          ? util.parseCssNumber(css.borderBottomWidth)
          : 0),
    )
  }
}
