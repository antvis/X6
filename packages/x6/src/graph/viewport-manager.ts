import { Platform } from '../util'
import { DomUtil, DomEvent } from '../dom'
import { Point, Rectangle } from '../geometry'
import * as sizeSensor from 'size-sensor'
import { Cell } from '../core/cell'
import { Size } from '../types'
import { BaseManager } from './base-manager'

export class ViewportManager extends BaseManager {
  getPageSize() {
    const pageScale = this.graph.pageScale
    const pageFormat = this.graph.pageFormat
    return {
      width: pageFormat.width * pageScale,
      height: pageFormat.height * pageScale,
    }
  }

  getPagePadding() {
    const scale = this.view.scale
    const container = this.container
    if (this.graph.pageVisible) {
      return [
        Math.max(0, Math.round((container.offsetWidth - 40) / scale)),
        Math.max(0, Math.round((container.offsetHeight - 40) / scale)),
      ]
    }

    return [
      Math.max(0, Math.round(container.offsetWidth / 2 / scale)),
      Math.max(0, Math.round(container.offsetHeight / 2 / scale)),
    ]
  }

  getPageLayout() {
    const size = this.getPageSize()
    const bounds = this.getGraphBounds()

    if (bounds.width === 0 || bounds.height === 0) {
      return new Rectangle(0, 0, 1, 1)
    }

    const s = this.view.scale
    const t = this.view.translate
    const x = Math.ceil(bounds.x / s - t.x)
    const y = Math.ceil(bounds.y / s - t.y)
    const w = Math.floor(bounds.width / s)
    const h = Math.floor(bounds.height / s)

    const x0 = Math.floor(x / size.width)
    const y0 = Math.floor(y / size.height)
    const w0 = Math.ceil((x + w) / size.width) - x0
    const h0 = Math.ceil((y + h) / size.height) - y0

    return new Rectangle(x0, y0, w0, h0)
  }

  getPreferredPageSize(bounds: Rectangle, width: number, height: number): Size {
    if (this.graph.infinite) {
      const size = this.getPageSize()
      const pages = this.getPageLayout()

      return {
        width: pages.width * size.width,
        height: pages.height * size.height,
      }
    }

    const format = this.graph.pageFormat
    const pageScale = this.graph.pageScale
    const translate = this.view.translate
    const pageWidth = Math.ceil(format.width * pageScale)
    const pageHeight = Math.ceil(format.height * pageScale)
    const pageBreakEnabled = this.graph.isPageBreakEnabled()
    const hCount = pageBreakEnabled ? Math.ceil(width / pageWidth) : 1
    const vCount = pageBreakEnabled ? Math.ceil(height / pageHeight) : 1

    return {
      width: hCount * pageWidth + 2 + translate.x,
      height: vCount * pageHeight + 2 + translate.y,
    }
  }

  getGraphBounds() {
    return this.view.getGraphBounds()
  }

  getCellBounds(
    cell: Cell,
    includeEdges: boolean,
    includeDescendants: boolean,
  ) {
    const cells = [cell]

    // Includes all connected edges
    if (includeEdges) {
      cells.push(...this.model.getEdges(cell))
    }

    let result = this.view.getBounds(cells)

    if (includeDescendants) {
      cell.eachChild(child => {
        const tmp = this.getCellBounds(child, includeEdges, true)
        if (tmp != null) {
          if (result != null) {
            result.add(tmp)
          } else {
            result = tmp
          }
        }
      })
    }

    return result
  }

  getBoundingBox(cells: Cell[], includeEdges: boolean): Rectangle | null {
    let result: Rectangle | null = null
    if (cells != null && cells.length > 0) {
      cells.forEach(cell => {
        if (includeEdges || this.model.isNode(cell)) {
          // Computes the bounding box for the points in the geometry
          const geo = cell.getGeometry()
          if (geo != null) {
            let bbox = null
            if (this.model.isEdge(cell)) {
              const pts = geo.points
              let tmp = new Rectangle(pts[0].x, pts[0].y, 0, 0)

              const addPoint = (pt: Point | null) => {
                if (pt != null) {
                  const rect = new Rectangle(pt.x, pt.y, 0, 0)
                  if (tmp == null) {
                    tmp = rect
                  } else {
                    tmp.add(rect)
                  }
                }
              }

              if (this.model.getTerminal(cell, true) == null) {
                addPoint(geo.getTerminalPoint(true))
              }

              if (this.model.getTerminal(cell, false) == null) {
                addPoint(geo.getTerminalPoint(false))
              }

              if (pts != null && pts.length > 0) {
                for (let j = 1; j < pts.length; j += 1) {
                  addPoint(pts[j])
                }
              }

              bbox = tmp
            } else {
              const parent = this.model.getParent(cell)!

              if (geo.relative) {
                if (
                  this.model.isNode(parent) &&
                  parent !== this.view.currentRoot
                ) {
                  const tmp = this.getBoundingBox([parent], false)
                  if (tmp != null) {
                    bbox = new Rectangle(
                      geo.bounds.x * tmp.width,
                      geo.bounds.y * tmp.height,
                      geo.bounds.width,
                      geo.bounds.height,
                    )

                    if (cells.includes(parent)) {
                      bbox.x += tmp.x
                      bbox.y += tmp.y
                    }
                  }
                }
              } else {
                bbox = geo.bounds.clone()
                if (this.model.isNode(parent) && cells.includes(parent)) {
                  const tmp = this.getBoundingBox([parent], false)
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
                result = bbox.clone()
              } else {
                result.add(bbox)
              }
            }
          }
        }
      })
    }

    return result != null ? result : null
  }

  sizeDidChange() {
    if (this.graph.infinite) {
      this.sizeDidChangeInfinite()
    } else {
      this.sizeDidChangeNormal()
    }
  }

  private autoTranslate: boolean
  sizeDidChangeInfinite() {
    if (this.container && DomUtil.hasScrollbars(this.container)) {
      const size = this.getPageSize()
      const pages = this.getPageLayout()
      const padding = this.getPagePadding()

      const minw = Math.ceil(2 * padding[0] + pages.width * size.width)
      const minh = Math.ceil(2 * padding[1] + pages.height * size.height)

      const min = this.graph.minGraphSize
      if (min == null || min.width !== minw || min.height !== minh) {
        this.graph.minGraphSize = { width: minw, height: minh }
      }

      const dx = padding[0] - pages.x * size.width
      const dy = padding[1] - pages.y * size.height

      const s = this.view.scale
      const t = this.view.translate
      const tx = t.x
      const ty = t.y

      if (!this.autoTranslate && (tx !== dx || ty !== dy)) {
        this.autoTranslate = true

        this.view.x0 = pages.x
        this.view.y0 = pages.y

        this.view.setTranslate(dx, dy)

        this.container.scrollLeft += Math.round((dx - tx) * s)
        this.container.scrollTop += Math.round((dy - ty) * s)

        this.autoTranslate = false

        return
      }

      this.sizeDidChangeNormal()
    }
  }

  sizeDidChangeNormal() {
    const bounds = this.getGraphBounds()

    if (this.container != null) {
      const scale = this.view.scale
      const border = this.graph.getBorder()

      let width = Math.max(0, bounds.x + bounds.width + 2 * border * scale)
      let height = Math.max(0, bounds.y + bounds.height + 2 * border * scale)

      if (this.graph.minContainerSize != null) {
        width = Math.max(width, this.graph.minContainerSize.width)
        height = Math.max(height, this.graph.minContainerSize.height)
      }

      if (this.graph.isAutoResizeContainer()) {
        this.resizeContainer(width, height)
      }

      if (
        this.graph.preferPageSize ||
        (!Platform.IS_IE && this.graph.pageVisible)
      ) {
        const size = this.getPreferredPageSize(
          bounds,
          Math.max(1, width),
          Math.max(1, height),
        )

        if (size != null) {
          width = size.width * scale
          height = size.height * scale
        }
      }

      if (this.graph.minGraphSize != null) {
        width = Math.max(width, this.graph.minGraphSize.width * scale)
        height = Math.max(height, this.graph.minGraphSize.height * scale)
      }

      width = Math.ceil(width)
      height = Math.ceil(height)

      if (this.graph.dialect === 'svg') {
        const svg = (this.view.getDrawPane() as SVGGElement).ownerSVGElement
        if (svg != null) {
          svg.style.position = 'relative'
          svg.style.minWidth = `${Math.max(1, width)}px`
          svg.style.minHeight = `${Math.max(1, height)}px`
          svg.style.width = '100%'
          svg.style.height = '100%'
        }
      } else {
        const stage = this.view.getStage()!
        stage.style.position = 'relative'
        stage.style.minWidth = `${Math.max(1, width)}px`
        stage.style.minHeight = `${Math.max(1, height)}px`
      }

      this.graph.updatePageBreaks(
        this.graph.isPageBreakEnabled(),
        width,
        height,
      )
    }

    return this
  }

  resetScrollbar() {
    const container = this.container
    if (this.graph.infinite && DomUtil.hasScrollbars(container)) {
      if (this.graph.pageVisible) {
        const padding = this.getPagePadding()
        container.scrollLeft = Math.floor(
          Math.min(
            padding[0],
            (container.scrollWidth - container.clientWidth) / 2,
          ),
        )
        container.scrollTop = padding[1]
      }

      // Scrolls graph to visible area
      const bounds = this.getGraphBounds()
      if (bounds.width > 0 && bounds.height > 0) {
        if (bounds.x > container.scrollLeft + container.clientWidth * 0.9) {
          container.scrollLeft = Math.min(
            bounds.x + bounds.width - container.clientWidth,
            bounds.x - 10,
          )
        }

        if (bounds.y > container.scrollTop + container.clientHeight * 0.9) {
          container.scrollTop = Math.min(
            bounds.y + bounds.height - container.clientHeight,
            bounds.y - 10,
          )
        }
      }
    }
  }

  resizeContainer(width: number, height: number) {
    const w =
      this.graph.maxContainerSize != null
        ? Math.min(this.graph.maxContainerSize.width, width)
        : width

    const h =
      this.graph.maxContainerSize != null
        ? Math.min(this.graph.maxContainerSize.height, height)
        : height

    this.container.style.width = DomUtil.toPx(Math.ceil(w))
    this.container.style.height = DomUtil.toPx(Math.ceil(h))
  }

  private unbindSizeDetector: () => void
  init() {
    if (this.graph.infinite) {
      this.container.style.zIndex = '1'
      this.container.style.position = 'relative'
      this.container.style.overflow = 'auto'
      this.container.style.width = '100%'
      this.container.style.height = '100%'
      this.unbindSizeDetector = sizeSensor.bind(this.container, () => {
        this.sizeDidChange()
      })
    }

    if (Platform.IS_IE) {
      DomEvent.addListener(this.container, 'selectstart', (e: MouseEvent) => {
        return (
          this.graph.isEditing() ||
          (!this.graph.eventloopManager.isMouseDown && !DomEvent.isShiftDown(e))
        )
      })
    }
  }

  @BaseManager.dispose()
  dispose() {
    if (this.unbindSizeDetector != null) {
      this.unbindSizeDetector()
    }
  }
}
