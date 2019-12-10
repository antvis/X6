import {
  util,
  Shape,
  detector,
  Rectangle,
  Point,
  DomEvent,
  Graph,
} from '@antv/x6'
import { GraphView } from './view'

export class EditorGraph extends Graph {
  view: GraphView
  autoTranslate: boolean
  cursorPosition: Point
  wheelZoomDelay: number = 10
  wheelZoomTimer: number | null
  cumulativeZoomFactor: number = 1

  initMouseWheel() {
    DomEvent.addWheelListener((e, up) => {
      if (this.isZoomWheelEvent(e)) {
        let source = DomEvent.getSource(e)
        while (source != null) {
          if (source == this.container) {
            this.cursorPosition = new Point(
              DomEvent.getClientX(e),
              DomEvent.getClientY(e),
            )
            this.lazyZoom(up)
            DomEvent.consume(e)
            return false
          }

          source = source.parentNode as Element
        }
      }
    }, this.container)
  }

  isZoomWheelEvent(e: MouseEvent) {
    return (
      DomEvent.isAltDown(e) ||
      (detector.IS_MAC && DomEvent.isMetaDown(e)) ||
      (!detector.IS_MAC && DomEvent.isControlDown(e))
    )
  }

  lazyZoom(zoomIn: boolean) {
    if (this.wheelZoomTimer != null) {
      window.clearTimeout(this.wheelZoomTimer)
    }

    // Switches to 1% zoom steps below 15%
    // Lower bound depdends on rounding below
    if (zoomIn) {
      if (this.view.scale * this.cumulativeZoomFactor < 0.15) {
        this.cumulativeZoomFactor = (this.view.scale + 0.01) / this.view.scale
      } else {
        // Uses to 5% zoom steps for better grid rendering in webkit
        // and to avoid rounding errors for zoom steps
        this.cumulativeZoomFactor *= this.scaleFactor
        this.cumulativeZoomFactor =
          Math.round(this.view.scale * this.cumulativeZoomFactor * 20) /
          20 /
          this.view.scale
      }
    } else {
      if (this.view.scale * this.cumulativeZoomFactor <= 0.15) {
        this.cumulativeZoomFactor = (this.view.scale - 0.01) / this.view.scale
      } else {
        // Uses to 5% zoom steps for better grid rendering in webkit
        // and to avoid rounding errors for zoom steps
        this.cumulativeZoomFactor /= this.scaleFactor
        this.cumulativeZoomFactor =
          Math.round(this.view.scale * this.cumulativeZoomFactor * 20) /
          20 /
          this.view.scale
      }
    }

    this.cumulativeZoomFactor = Math.max(
      0.01,
      Math.min(this.view.scale * this.cumulativeZoomFactor, 160) /
        this.view.scale,
    )

    this.wheelZoomTimer = window.setTimeout(() => {
      var offset = util.getOffset(this.container)
      var dx = 0
      var dy = 0

      if (this.cursorPosition != null) {
        dx = this.container.offsetWidth / 2 - this.cursorPosition.x + offset.x
        dy = this.container.offsetHeight / 2 - this.cursorPosition.y + offset.y
      }

      var prev = this.view.scale
      this.zoom(this.cumulativeZoomFactor)
      var s = this.view.scale

      if (s != prev) {
        // if (resize != null) {
        //   ui.chromelessResize(false, null, dx * (this.cumulativeZoomFactor - 1),
        //     dy * (this.cumulativeZoomFactor - 1))
        // }

        if (util.hasScrollbars(this.container) && (dx != 0 || dy != 0)) {
          this.container.scrollLeft -= dx * (this.cumulativeZoomFactor - 1)
          this.container.scrollTop -= dy * (this.cumulativeZoomFactor - 1)
        }
      }

      this.cumulativeZoomFactor = 1
      this.wheelZoomTimer = null
    }, this.wheelZoomDelay)
  }

  sizeDidChange() {
    if (this.container && util.hasScrollbars(this.container)) {
      const size = this.getPageSize()
      const pages = this.getPageLayout()
      const padding = this.getPagePadding()

      const minw = Math.ceil(2 * padding[0] + pages.width * size.width)
      const minh = Math.ceil(2 * padding[1] + pages.height * size.height)

      const min = this.minGraphSize
      if (min == null || min.width != minw || min.height != minh) {
        this.minGraphSize = { width: minw, height: minh }
      }

      const dx = padding[0] - pages.x * size.width
      const dy = padding[1] - pages.y * size.height

      const s = this.view.scale
      const t = this.view.translate
      const tx = t.x
      const ty = t.y

      if (!this.autoTranslate && (tx != dx || ty != dy)) {
        this.autoTranslate = true

        this.view.x0 = pages.x
        this.view.y0 = pages.y

        this.view.setTranslate(dx, dy)

        this.container.scrollLeft += Math.round((dx - tx) * s)
        this.container.scrollTop += Math.round((dy - ty) * s)

        this.autoTranslate = false

        return
      }

      super.sizeDidChange()
    }
  }

  getPageSize() {
    return {
      width: this.pageFormat.width * this.pageScale,
      height: this.pageFormat.height * this.pageScale,
    }
  }

  getPagePadding() {
    const scale = this.view.scale
    const container = this.container
    return [
      Math.max(0, Math.round((container.offsetWidth - 32) / scale)),
      Math.max(0, Math.round((container.offsetHeight - 32) / scale)),
    ]
  }

  getPreferredPageSize() {
    const size = this.getPageSize()
    const pages = this.getPageLayout()

    return {
      width: pages.width * size.width,
      height: pages.height * size.height,
    }
  }

  getPageLayout() {
    const size = this.getPageSize()
    const bounds = this.getGraphBounds()

    if (bounds.width == 0 || bounds.height == 0) {
      return new Rectangle(0, 0, 1, 1)
    } else {
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
  }

  updatePageBreaks(visible: boolean, width: number, height: number) {
    const s = this.view.scale
    const t = this.view.translate
    const fmt = this.pageFormat
    const ps = s * this.pageScale
    const bounds = this.view.getBackgroundPageBounds()

    width = bounds.width // tslint:disable-line
    height = bounds.height // tslint:disable-line

    const right = bounds.x + width
    const bottom = bounds.y + height

    const pb = new Rectangle(s * t.x, s * t.y, fmt.width * ps, fmt.height * ps)
    // tslint:disable-next-line
    visible = visible && Math.min(pb.width, pb.height) > this.pageBreakMinDist

    const hCount = visible ? Math.ceil(height / pb.height) - 1 : 0
    const vCount = visible ? Math.ceil(width / pb.width) - 1 : 0

    if (this.viewport.horizontalPageBreaks == null && hCount > 0) {
      this.viewport.horizontalPageBreaks = []
    }

    if (this.viewport.verticalPageBreaks == null && vCount > 0) {
      this.viewport.verticalPageBreaks = []
    }

    const drawPageBreaks = (breaks: Shape.Polyline[]) => {
      if (breaks != null) {
        const count =
          breaks === this.viewport.horizontalPageBreaks ? hCount : vCount

        for (let i = 0; i <= count; i += 1) {
          let points: Point[]
          if (breaks === this.viewport.horizontalPageBreaks) {
            const y = Math.round(bounds.y + (i + 1) * pb.height) - 1
            points = [
              new Point(Math.round(bounds.x), y),
              new Point(Math.round(right), y),
            ]
          } else {
            const x = Math.round(bounds.x + (i + 1) * pb.width) - 1
            points = [
              new Point(x, Math.round(bounds.y)),
              new Point(x, Math.round(bottom)),
            ]
          }

          if (breaks[i] != null) {
            breaks[i].points = points
            breaks[i].redraw()
          } else {
            const pageBreak = new Shape.Polyline(points, this.pageBreakColor)
            pageBreak.dialect = this.dialect
            pageBreak.dashed = this.pageBreakDashed
            pageBreak.pointerEvents = false
            pageBreak.init(this.view.getBackgroundPane())
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

    drawPageBreaks(this.viewport.horizontalPageBreaks)
    drawPageBreaks(this.viewport.verticalPageBreaks)
  }

  resetScrollbars() {
    const container = this.container

    if (this.pageVisible && util.hasScrollbars(container)) {
      const padding = this.getPagePadding()
      container.scrollLeft = Math.floor(
        Math.min(
          padding[0],
          (container.scrollWidth - container.clientWidth) / 2,
        ),
      )
      container.scrollTop = padding[1]

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
}
