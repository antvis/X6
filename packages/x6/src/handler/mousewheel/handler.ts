import { Point } from '../../geometry'
import { DomUtil, DomEvent } from '../../dom'
import { Graph } from '../../graph'
import { BaseHandler } from '../base-handler'

export class MouseWheelHandler extends BaseHandler {
  private cursorPosition: Point
  private wheelZoomDelay: number = 10
  private wheelZoomTimer: number | null
  private cumulativeZoomFactor: number = 1

  private handler = (e: WheelEvent, up: boolean) => {
    if (this.isZoomWheelEvent(e)) {
      let source = DomEvent.getSource(e)
      while (source != null) {
        if (source === this.graph.container) {
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
  }

  constructor(graph: Graph) {
    super(graph)
    this.setEnadled(this.graph.options.mouseWheel.enabled)
  }

  enable() {
    this.graph.options.mouseWheel.enabled = true
    DomEvent.addWheelListener(this.handler, this.graph.container)
    super.enable()
  }

  disable() {
    this.graph.options.mouseWheel.enabled = false
    DomEvent.removeWheelListener(this.handler, this.graph.container)
    super.disable()
  }

  isZoomWheelEvent(e: MouseEvent) {
    const modifiers = this.graph.options.mouseWheel.modifiers
    if (modifiers == null) {
      return true
    }

    return (
      (modifiers.includes('alt') && DomEvent.isAltDown(e)) ||
      (modifiers.includes('meta') && DomEvent.isMetaDown(e)) ||
      (modifiers.includes('ctrl') && DomEvent.isControlDown(e))
    )
  }

  lazyZoom(zoomIn: boolean) {
    if (this.wheelZoomTimer != null) {
      window.clearTimeout(this.wheelZoomTimer)
    }

    const scale = this.view.scale
    const scaleFactor = this.graph.scaleFactor
    const container = this.graph.container

    // Switches to 1% zoom steps below 15%
    // Lower bound depdends on rounding below
    if (zoomIn) {
      if (scale * this.cumulativeZoomFactor < 0.15) {
        this.cumulativeZoomFactor = (scale + 0.01) / scale
      } else {
        // Uses to 5% zoom steps for better grid rendering in webkit
        // and to avoid rounding errors for zoom steps
        this.cumulativeZoomFactor *= scaleFactor
        this.cumulativeZoomFactor =
          Math.round(scale * this.cumulativeZoomFactor * 20) / 20 / scale
      }
    } else {
      if (scale * this.cumulativeZoomFactor <= 0.15) {
        this.cumulativeZoomFactor = (scale - 0.01) / scale
      } else {
        // Uses to 5% zoom steps for better grid rendering in webkit
        // and to avoid rounding errors for zoom steps
        this.cumulativeZoomFactor /= scaleFactor
        this.cumulativeZoomFactor =
          Math.round(scale * this.cumulativeZoomFactor * 20) / 20 / scale
      }
    }

    this.cumulativeZoomFactor = Math.max(
      0.01,
      Math.min(scale * this.cumulativeZoomFactor, 160) / scale,
    )

    this.wheelZoomTimer = window.setTimeout(() => {
      const offset = DomUtil.getOffset(container)
      let dx = 0
      let dy = 0

      if (this.cursorPosition != null) {
        dx = container.offsetWidth / 2 - this.cursorPosition.x + offset.x
        dy = container.offsetHeight / 2 - this.cursorPosition.y + offset.y
      }

      const prev = this.view.scale
      this.graph.zoom(this.cumulativeZoomFactor)
      const s = this.view.scale

      if (s !== prev) {
        // if (resize != null) {
        //   ui.chromelessResize(false, null, dx * (this.cumulativeZoomFactor - 1),
        //     dy * (this.cumulativeZoomFactor - 1))
        // }

        if (DomUtil.hasScrollbars(container) && (dx !== 0 || dy !== 0)) {
          container.scrollLeft -= dx * (this.cumulativeZoomFactor - 1)
          container.scrollTop -= dy * (this.cumulativeZoomFactor - 1)
        }
      }

      this.cumulativeZoomFactor = 1
      this.wheelZoomTimer = null
    }, this.wheelZoomDelay)
  }

  @BaseHandler.dispose()
  dispose() {
    this.disable()
  }
}
