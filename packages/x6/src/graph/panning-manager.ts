import { NumberExt } from '../util'
import { DomUtil, DomEvent } from '../dom'
import { Graph } from '../graph'
import { IMouseHandler, MouseEventEx } from '../handler'
import { BaseManager } from './base-manager'

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

  private readonly mouseListener: IMouseHandler
  private readonly mouseUpHandler: () => void
  protected active: boolean = false
  protected timer: number | null = null
  protected pannedX: number = 0
  protected pannedY: number = 0
  protected translateX: number = 0
  protected translateY: number = 0
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
      mouseUp: (e: MouseEventEx, sender: any) => this.mouseUpHandler(),
    }

    this.mouseUpHandler = () => {
      if (this.active) {
        this.stop()
      }
    }
  }

  protected addListeners() {
    this.graph.addHandler(this.mouseListener)
    DomEvent.addListener(document, 'mouseup', this.mouseUpHandler)
  }

  protected removeListeners() {
    this.graph.removeHandler(this.mouseListener)
    DomEvent.removeListener(document, 'mouseup', this.mouseUpHandler)
  }

  protected triggerPanning() {
    this.graph.trigger('pan', {
      panX: this.graph.panX,
      panY: this.graph.panY,
    })
  }

  protected getPannedX() {
    return Math.round(this.pannedX)
  }

  protected getPannedY() {
    return Math.round(this.pannedY)
  }

  protected start() {
    const t = this.graph.view.translate
    this.translateX = t.x
    this.translateY = t.y

    this.active = true
    this.addListeners()
  }

  protected stop() {
    if (this.active) {
      this.active = false
      this.removeListeners()

      if (this.timer != null) {
        window.clearTimeout(this.timer)
        this.timer = null
      }

      this.pannedX = 0
      this.pannedY = 0

      if (this.scrollbars) {
        this.graph.panX = 0
        this.graph.panY = 0
        this.triggerPanning()
      } else {
        const px = this.graph.panX
        const py = this.graph.panY
        if (px !== 0 || py !== 0) {
          this.pan(0, 0)
          this.graph.view.setTranslate(
            this.translateX + px / this.graph.view.scale,
            this.translateY + py / this.graph.view.scale,
          )
        }
      }
    }
  }

  private createTimer() {
    const container = this.graph.container
    this.scrollbars = DomUtil.hasScrollbars(container)
    this.scrollLeft = container.scrollLeft
    this.scrollTop = container.scrollTop

    const cb = () => {
      this.pannedX -= this.dx
      this.pannedY -= this.dy

      if (this.scrollbars) {
        const container = this.graph.container
        const left = -container.scrollLeft - Math.ceil(this.dx)
        const top = -container.scrollTop - Math.ceil(this.dy)
        this.pan(left, top)
        this.graph.panX = this.scrollLeft - container.scrollLeft
        this.graph.panY = this.scrollTop - container.scrollTop
        this.triggerPanning()
      } else {
        this.pan(this.getPannedX(), this.getPannedY())
      }
      this.timer = window.setTimeout(cb, this.delay)
    }

    cb()
  }

  panRectToVisible(x: number, y: number, w: number = 0, h: number = 0) {
    if (!this.active) {
      this.start()
    }

    const container = this.graph.container

    this.scrollLeft = container.scrollLeft
    this.scrollTop = container.scrollTop
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
        this.createTimer()
      }
    } else if (this.timer != null) {
      window.clearTimeout(this.timer)
      this.timer = null
    }
  }

  protected shiftPreview1: HTMLElement | null
  protected shiftPreview2: HTMLElement | null

  pan(x: number, y: number, relative: boolean = false) {
    const px = relative ? this.graph.panX + x : x
    const py = relative ? this.graph.panY + y : y

    if (
      this.graph.useScrollbarsForPanning &&
      DomUtil.hasScrollbars(this.container)
    ) {
      const container = this.container
      const maxScrollLeft = container.scrollWidth - container.clientWidth
      const maxScrollTop = container.scrollHeight - container.clientHeight
      const scrollLeft = NumberExt.clamp(px, 0, maxScrollLeft)
      const scrollTop = NumberExt.clamp(py, 0, maxScrollTop)
      container.scrollLeft = scrollLeft
      container.scrollTop = scrollTop
    } else {
      const stage = this.view.getStage()!
      if (this.graph.dialect === 'svg') {
        // Puts everything inside the container in a DIV so that it
        // can be moved without changing the state of the container
        if (px === 0 && py === 0) {
          stage.removeAttribute('transform')

          if (this.shiftPreview1 != null && this.shiftPreview2 != null) {
            let child = this.shiftPreview1.firstChild
            while (child != null) {
              const next = child.nextSibling
              this.container.appendChild(child)
              child = next
            }

            DomUtil.remove(this.shiftPreview1)
            this.shiftPreview1 = null

            this.container.appendChild(stage.parentNode!)

            child = this.shiftPreview2.firstChild
            while (child != null) {
              const next = child.nextSibling
              this.container.appendChild(child)
              child = next
            }

            DomUtil.remove(this.shiftPreview2)
            this.shiftPreview2 = null
          }
        } else {
          stage.setAttribute('transform', `translate(${px},${py})`)

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
              if (child !== stage.parentNode) {
                current.appendChild(child)
              } else {
                current = this.shiftPreview2
              }

              child = next
            }

            // Inserts elements only if not empty
            if (this.shiftPreview1.firstChild != null) {
              this.container.insertBefore(this.shiftPreview1, stage.parentNode)
            }

            if (this.shiftPreview2.firstChild != null) {
              this.container.appendChild(this.shiftPreview2)
            }
          }

          this.shiftPreview1.style.left = `${px}px`
          this.shiftPreview1.style.top = `${py}px`
          this.shiftPreview2!.style.left = DomUtil.toPx(px)
          this.shiftPreview2!.style.top = DomUtil.toPx(py)
        }
      } else {
        stage.style.left = DomUtil.toPx(px)
        stage.style.top = DomUtil.toPx(py)
      }

      this.graph.panX = px
      this.graph.panY = py
    }

    this.triggerPanning()
  }

  @BaseManager.dispose()
  dispose() {
    this.removeListeners()
  }
}
