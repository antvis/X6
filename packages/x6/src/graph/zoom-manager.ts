import { DomUtil } from '../dom'
import { Point, Rectangle } from '../geometry'
import { ObjectExt, NumberExt } from '../util'
import { Cell } from '../core/cell'
import { BaseManager } from './base-manager'

export class ZoomManager extends BaseManager {
  center(horizontal: boolean, vertical: boolean, cx: number, cy: number) {
    const hasScrollbars = DomUtil.hasScrollbars(this.container)
    const bounds = this.graph.getGraphBounds()
    const cw = this.container.clientWidth
    const ch = this.container.clientHeight

    if (!hasScrollbars) {
      const s = this.view.scale
      const t = this.view.translate
      const dx = horizontal ? cw - bounds.width : 0
      const dy = vertical ? ch - bounds.height : 0
      const tx = horizontal
        ? Math.floor(t.x - bounds.x * s + (dx * cx) / s)
        : t.x
      const ty = vertical ? Math.floor(t.y - bounds.y * s + (dy * cy) / s) : t.y
      this.view.setTranslate(tx, ty)
    } else {
      const center = bounds.getCenter()
      if (horizontal) {
        this.container.scrollLeft = (center.x - cw / 2) * 2 * cx
      }
      if (vertical) {
        this.container.scrollTop = (center.y - ch / 2) * 2 * cy
      }
    }
  }

  fit(
    border: number,
    keepOrigin: boolean,
    margin: number,
    applyScale: boolean,
    ignoreWidth: boolean,
    ignoreHeight: boolean,
    maxHeight?: number,
  ) {
    const container = this.container
    if (container != null) {
      const cssBorder = this.getBorderSizes()
      let w1 = container.offsetWidth - cssBorder.x - cssBorder.width - 1
      let h1 = ObjectExt.ensure(
        maxHeight,
        container.offsetHeight - cssBorder.y - cssBorder.height - 1,
      )

      let bounds = this.view.getGraphBounds()
      if (bounds.width > 0 && bounds.height > 0) {
        if (keepOrigin && bounds.x != null && bounds.y != null) {
          bounds = bounds.clone()
          bounds.width += bounds.x
          bounds.height += bounds.y
          bounds.x = 0
          bounds.y = 0
        }

        const scale = this.view.scale
        const w2 = bounds.width / scale
        const h2 = bounds.height / scale
        const space = (keepOrigin ? border : 2 * border) + margin + 1

        w1 -= space
        h1 -= space

        let newScale = ignoreWidth
          ? h1 / h2
          : ignoreHeight
          ? w1 / w2
          : Math.min(w1 / w2, h1 / h2)

        if (this.graph.minFitScale != null) {
          newScale = Math.max(newScale, this.graph.minFitScale)
        }

        if (this.graph.maxFitScale != null) {
          newScale = Math.min(newScale, this.graph.maxFitScale)
        }

        if (applyScale) {
          if (!keepOrigin) {
            if (!DomUtil.hasScrollbars(this.container)) {
              const x0 =
                bounds.x != null
                  ? Math.floor(
                      this.view.translate.x -
                        bounds.x / scale +
                        border / newScale +
                        margin / 2,
                    )
                  : border

              const y0 =
                bounds.y != null
                  ? Math.floor(
                      this.view.translate.y -
                        bounds.y / scale +
                        border / newScale +
                        margin / 2,
                    )
                  : border

              this.view.scaleAndTranslate(newScale, x0, y0)
            } else {
              this.view.setScale(newScale)
              const newBounds = this.graph.getGraphBounds()
              const center = newBounds.getCenter()
              if (newBounds.x != null) {
                container.scrollLeft = center.x - container.clientWidth / 2
              }
              if (newBounds.y != null) {
                container.scrollTop = center.y - container.clientHeight / 2
              }
            }
          } else if (this.view.scale !== newScale) {
            this.view.setScale(newScale)
          }
        } else {
          return newScale
        }
      }
    }

    return this.view.scale
  }

  zoom(factor: number, center: boolean) {
    let scale = Math.round(this.view.scale * factor * 100) / 100
    scale = NumberExt.clamp(scale, this.graph.minScale, this.graph.maxScale)
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
      const hasScrollbars = DomUtil.hasScrollbars(this.container)
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

    if (!DomUtil.hasScrollbars(container)) {
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

      if (DomUtil.hasScrollbars(this.container)) {
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
    const container = this.container

    if (
      !this.graph.timerAutoScroll &&
      (this.graph.ignoreScrollbars || DomUtil.hasScrollbars(container))
    ) {
      if (
        x >= container.scrollLeft &&
        y >= container.scrollTop &&
        x <= container.scrollLeft + container.clientWidth &&
        y <= container.scrollTop + container.clientHeight
      ) {
        let dx = container.scrollLeft + container.clientWidth - x

        if (dx < border) {
          const old = container.scrollLeft
          container.scrollLeft += border - dx

          // Automatically extends the canvas size to the bottom, right
          // if the event is outside of the canvas and the edge of the
          // canvas has been reached. Notes: Needs fix for IE.
          if (extend && old === container.scrollLeft) {
            if (this.graph.dialect === 'svg') {
              const root = (this.view.getDrawPane() as SVGElement)
                .ownerSVGElement!
              const width = this.container.scrollWidth + border - dx

              // Updates the clipping region. This is an expensive
              // operation that should not be executed too often.
              root.style.width = DomUtil.toPx(width)
            } else {
              const width =
                Math.max(container.clientWidth, container.scrollWidth) +
                border -
                dx
              const stage = this.view.getStage()!
              stage.style.width = DomUtil.toPx(width)
            }

            container.scrollLeft += border - dx
          }
        } else {
          dx = x - container.scrollLeft

          if (dx < border) {
            container.scrollLeft -= border - dx
          }
        }

        let dy = container.scrollTop + container.clientHeight - y

        if (dy < border) {
          const old = container.scrollTop
          container.scrollTop += border - dy

          if (old === container.scrollTop && extend) {
            if (this.graph.dialect === 'svg') {
              const root = (this.view.getDrawPane() as SVGElement)
                .ownerSVGElement!
              const height = this.container.scrollHeight + border - dy

              // Updates the clipping region. This is an expensive
              // operation that should not be executed too often.
              root.style.height = DomUtil.toPx(height)
            } else {
              const height =
                Math.max(container.clientHeight, container.scrollHeight) +
                border -
                dy
              const canvas = this.view.getStage()!
              canvas.style.height = DomUtil.toPx(height)
            }

            container.scrollTop += border - dy
          }
        } else {
          dy = y - container.scrollTop

          if (dy < border) {
            container.scrollTop -= border - dy
          }
        }
      }
    } else if (
      this.graph.allowAutoPanning &&
      !this.graph.panningHandler.isActive()
    ) {
      this.graph.panningManager.panRectToVisible(
        x + this.graph.panX,
        y + this.graph.panY,
      )
    }
  }

  /**
   * Returns the size of the border and padding on all four sides of the
   * container. The left, top, right and bottom borders are stored in the
   * x, y, width and height of the returned `Rectangle`, respectively.
   */
  getBorderSizes() {
    const css = DomUtil.getComputedStyle(this.container)
    return new Rectangle(
      this.parseCssNumber(css.paddingLeft) +
        (css.borderLeftStyle !== 'none'
          ? this.parseCssNumber(css.borderLeftWidth)
          : 0),
      this.parseCssNumber(css.paddingTop) +
        (css.borderTopStyle !== 'none'
          ? this.parseCssNumber(css.borderTopWidth)
          : 0),
      this.parseCssNumber(css.paddingRight) +
        (css.borderRightStyle !== 'none'
          ? this.parseCssNumber(css.borderRightWidth)
          : 0),
      this.parseCssNumber(css.paddingBottom) +
        (css.borderBottomStyle !== 'none'
          ? this.parseCssNumber(css.borderBottomWidth)
          : 0),
    )
  }

  protected parseCssNumber(value: string) {
    if (value === 'thin') {
      return 2
    }

    if (value === 'medium') {
      return 4
    }

    if (value === 'thick') {
      return 6
    }

    const ret = parseFloat(value)
    return isNaN(ret) ? 0 : ret
  }
}
