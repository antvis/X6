import * as util from '../util'
import { Graph } from '../core'
import { MouseEventEx, DomEvent } from '../common'
import { IMouseHandler } from '../handler'
import { BaseManager } from './manager-base'

export class PanningManager extends BaseManager {
  /**
   * Damper value for the panning.
   *
   * Default is `1/6`.
   */
  protected damper: number = 1 / 6

  /**
   * Delay in milliseconds for the panning.
   *
   * Default is `10`.
   */
  protected delay: number = 10

  /**
   * Specifies if mouse events outside of the component should be handled.
   *
   * Default is `true`.
   */
  protected handleMouseOut: boolean = true

  /**
   * Border to handle automatic panning inside the component.
   *
   * Default is `0` (disabled).
   */
  protected border: number = 0

  private mouseListener: IMouseHandler
  private mouseUpListener: () => void
  protected active: boolean = false
  protected timer: number | null = null
  protected tdx: number = 0
  protected tdy: number = 0
  protected t0x: number = 0
  protected t0y: number = 0
  protected dx: number = 0
  protected dy: number = 0
  protected scrollbars: boolean = false
  protected scrollLeft: number = 0
  protected scrollTop: number = 0

  constructor(graph: Graph) {
    super(graph)

    this.mouseListener = {
      mouseDown(e: MouseEventEx, sender: any) {},
      mouseMove(e: MouseEventEx, sender: any) {},
      mouseUp: (e: MouseEventEx, sender: any) => {
        if (this.active) {
          this.stop()
        }
      },
    }

    graph.addMouseListener(this.mouseListener)

    this.mouseUpListener = () => {
      if (this.active) {
        this.stop()
      }
    }

    // Stops scrolling on every mouseup anywhere in the document
    DomEvent.addListener(document, 'mouseup', this.mouseUpListener)
  }

  isActive() {
    return this.active
  }

  getDx() {
    return Math.round(this.tdx)
  }

  getDy() {
    return Math.round(this.tdy)
  }

  private createTimer() {
    const container = this.graph.container
    this.scrollbars = util.hasScrollbars(container)
    this.scrollLeft = container.scrollLeft
    this.scrollTop = container.scrollTop

    return window.setInterval(() => {
      this.tdx -= this.dx
      this.tdy -= this.dy

      if (this.scrollbars) {
        const left = -this.graph.container.scrollLeft - Math.ceil(this.dx)
        const top = -this.graph.container.scrollTop - Math.ceil(this.dy)
        this.graph.pan(left, top)
        this.graph.panDx = this.scrollLeft - this.graph.container.scrollLeft
        this.graph.panDy = this.scrollTop - this.graph.container.scrollTop
        this.graph.trigger(Graph.events.pan)
      } else {
        this.graph.pan(this.getDx(), this.getDy())
      }
    }, this.delay)
  }

  start() {
    this.t0x = this.graph.view.translate.x
    this.t0y = this.graph.view.translate.y
    this.active = true
  }

  stop() {
    if (this.active) {
      this.active = false

      if (this.timer != null) {
        window.clearInterval(this.timer)
        this.timer = null
      }

      this.tdx = 0
      this.tdy = 0

      if (!this.scrollbars) {
        const px = this.graph.panDx
        const py = this.graph.panDy

        if (px !== 0 || py !== 0) {
          this.graph.pan(0, 0)
          this.graph.view.setTranslate(
            this.t0x + px / this.graph.view.scale,
            this.t0y + py / this.graph.view.scale
          )
        }
      } else {
        this.graph.panDx = 0
        this.graph.panDy = 0
        this.graph.trigger(Graph.events.pan)
      }
    }
  }

  panTo(x: number, y: number, w: number = 0, h: number = 0) {
    if (!this.active) {
      this.start()
    }

    this.scrollLeft = this.graph.container.scrollLeft
    this.scrollTop = this.graph.container.scrollTop

    const container = this.graph.container
    this.dx = x + w - container.scrollLeft - container.clientWidth

    if (this.dx < 0 && Math.abs(this.dx) < this.border) {
      this.dx = this.border + this.dx
    } else if (this.handleMouseOut) {
      this.dx = Math.max(this.dx, 0)
    } else {
      this.dx = 0
    }

    if (this.dx === 0) {
      this.dx = x - container.scrollLeft

      if (this.dx > 0 && this.dx < this.border) {
        this.dx = this.dx - this.border
      } else if (this.handleMouseOut) {
        this.dx = Math.min(0, this.dx)
      } else {
        this.dx = 0
      }
    }

    this.dy = y + h - container.scrollTop - container.clientHeight

    if (this.dy < 0 && Math.abs(this.dy) < this.border) {
      this.dy = this.border + this.dy
    } else if (this.handleMouseOut) {
      this.dy = Math.max(this.dy, 0)
    } else {
      this.dy = 0
    }

    if (this.dy === 0) {
      this.dy = y - container.scrollTop

      if (this.dy > 0 && this.dy < this.border) {
        this.dy = this.dy - this.border
      } else if (this.handleMouseOut) {
        this.dy = Math.min(0, this.dy)
      } else {
        this.dy = 0
      }
    }

    if (this.dx !== 0 || this.dy !== 0) {
      this.dx *= this.damper
      this.dy *= this.damper

      if (this.timer == null) {
        this.timer = this.createTimer()
      }
    } else if (this.timer != null) {
      window.clearInterval(this.timer)
      this.timer = null
    }
  }

  dispose() {
    if (this.disposed) {
      return
    }

    this.graph.removeMouseListener(this.mouseListener)
    DomEvent.removeListener(document, 'mouseup', this.mouseUpListener)

    super.dispose()
  }
}
