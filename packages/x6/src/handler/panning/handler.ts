import { DomUtil, DomEvent } from '../../dom'
import { Graph } from '../../graph'
import { MouseHandler } from '../mouse-handler'
import { MouseEventEx } from '../mouse-event'

export class PanningHandler extends MouseHandler<PanningHandler.EventArgs> {
  /**
   * Specifies if panning should be active for the left mouse button.
   *
   * Default is `false`.
   */
  useLeftButtonForPanning: boolean = false

  usePopupTrigger: boolean = true

  /**
   * Specifies if panning should be active even if there is a cell under the
   * mousepointer.
   *
   * Default is `false`.
   */
  ignoreCell: boolean = false

  /**
   * Specifies if the panning should be previewed.
   *
   * Default is `true`.
   */
  previewEnabled: boolean = true

  /**
   * Specifies if the panning steps should be aligned to the grid size.
   *
   * Default is `false`.
   */
  useGrid: boolean = false

  /**
   * Specifies if pinch gestures should be handled as zoom.
   *
   * Default is `true`.
   */
  pinchEnabled: boolean = true

  /**
   * Specifies the maximum scale.
   *
   * Default is `8`.
   */
  maxScale: number = 8

  /**
   * Specifies the minimum scale.
   *
   * Default is `0.01`.
   */
  minScale: number = 0.01

  private readonly mouseUpListener: () => void
  private readonly forcePanningHandler: (arg: {
    eventName: string
    e: MouseEventEx
  }) => void
  private readonly gestureHandler: (arg: { e: MouseEvent }) => void

  protected dx: number | null = null
  protected dy: number | null = null
  protected startX: number = 0
  protected startY: number = 0
  protected scrollLeft: number
  protected scrollTop: number
  protected active: boolean = false
  protected initialScale: number | null = null
  protected mouseDownEvent: MouseEventEx | null

  panningTrigger: boolean

  constructor(graph: Graph) {
    super(graph)

    // Disable by default
    this.disable()

    // Handles force panning event
    this.forcePanningHandler = ({ eventName, e }) => {
      if (eventName === 'mouseDown' && this.isForcePanningEvent(e)) {
        this.start(e)
        this.active = true
        this.trigger('panStart', { e })
        e.consume()
      }
    }

    this.graph.on('mouseEvent', this.forcePanningHandler)

    // Handles pinch gestures
    this.gestureHandler = ({ e }) => {
      if (this.pinchEnabled) {
        if (!DomEvent.isConsumed(e) && e.type === 'gesturestart') {
          this.initialScale = this.graph.view.scale

          // Force start of panning when pinch gesture starts
          if (!this.active && this.mouseDownEvent != null) {
            this.start(this.mouseDownEvent)
            this.mouseDownEvent = null
          }
        } else if (e.type === 'gestureend' && this.initialScale != null) {
          this.initialScale = null
        }

        if (this.initialScale != null) {
          let scale =
            Math.round(this.initialScale * (e as any).scale * 100) / 100

          if (this.minScale != null) {
            scale = Math.max(this.minScale, scale)
          }

          if (this.maxScale != null) {
            scale = Math.min(this.maxScale, scale)
          }

          if (this.graph.view.scale !== scale) {
            this.graph.zoomTo(scale)
            DomEvent.consume(e)
          }
        }
      }
    }

    this.graph.on('gesture', this.gestureHandler)

    this.mouseUpListener = () => {
      if (this.active) {
        this.reset()
      }
    }

    DomEvent.addListener(document, 'mouseup', this.mouseUpListener)
  }

  disablePinch() {
    this.pinchEnabled = false
  }

  enablePinch() {
    this.pinchEnabled = true
  }

  togglePinch() {
    this.pinchEnabled = !this.pinchEnabled
  }

  /**
   * Return true if the given event should start panning.
   */
  protected isForcePanningEvent(e: MouseEventEx) {
    return this.ignoreCell || DomEvent.isMultiTouchEvent(e.getEvent())
  }

  /**
   * Return true if the given event is a panning trigger
   */
  protected isPanningTrigger(e: MouseEventEx) {
    const evt = e.getEvent()
    if (
      e.getState() == null &&
      this.useLeftButtonForPanning &&
      DomEvent.isLeftMouseButton(evt)
    ) {
      return true
    }

    if (this.usePopupTrigger && DomEvent.isPopupTrigger(evt)) {
      return true
    }

    if (DomEvent.isControlDown(evt) && DomEvent.isShiftDown(evt)) {
      return true
    }

    return false
  }

  isActive() {
    return this.active || this.initialScale != null
  }

  protected start(e: MouseEventEx) {
    this.dx = null
    this.dy = null
    this.startX = e.getClientX()
    this.startY = e.getClientY()
    this.scrollLeft = this.graph.container.scrollLeft
    this.scrollTop = this.graph.container.scrollTop

    this.panningTrigger = true
  }

  mouseDown(e: MouseEventEx) {
    this.mouseDownEvent = e

    if (
      this.isEnabled() &&
      !e.isConsumed() &&
      !this.active &&
      this.isPanningTrigger(e)
    ) {
      this.start(e)
      this.consume(e, 'mouseDown')
    }
  }

  mouseMove(e: MouseEventEx) {
    this.dx = e.getClientX() - this.startX
    this.dy = e.getClientY() - this.startY

    if (this.active) {
      if (this.previewEnabled) {
        if (this.useGrid) {
          this.dx = this.graph.snap(this.dx)
          this.dy = this.graph.snap(this.dy)
        }

        this.graph.pan(this.dx - this.scrollLeft, this.dy - this.scrollTop)
      }

      this.trigger('pan', { e })
    } else if (this.panningTrigger) {
      const tmp = this.active
      // Panning is activated only if the mouse is moved
      // beyond the graph tolerance
      this.active =
        Math.abs(this.dx) > this.graph.tolerance ||
        Math.abs(this.dy) > this.graph.tolerance

      if (!tmp && this.active) {
        this.trigger('panStart', { e })
      }
    }

    if (this.active || this.panningTrigger) {
      e.consume()
    }
  }

  mouseUp(e: MouseEventEx) {
    if (this.active) {
      if (this.dx != null && this.dy != null) {
        // Ignores if scrollbars have been used for panning
        if (
          !this.graph.useScrollbarsForPanning ||
          !DomUtil.hasScrollbars(this.graph.container)
        ) {
          const s = this.graph.view.scale
          const t = this.graph.view.translate
          this.graph.pan(0, 0)
          this.graph.view.setTranslate(t.x + this.dx / s, t.y + this.dy / s)
        }

        e.consume()
      }
      this.trigger('panEnd', { e })
    }

    this.reset()
  }

  protected reset() {
    this.dx = null
    this.dy = null
    this.active = false
    this.panningTrigger = false
    this.mouseDownEvent = null
  }

  @MouseHandler.dispose()
  dispose() {
    this.graph.removeHandler(this)
    this.graph.off('mouseEvent', this.forcePanningHandler)
    this.graph.off('gesture', this.gestureHandler)
    DomEvent.removeListener(document, 'mouseup', this.mouseUpListener)
  }
}

export namespace PanningHandler {
  export interface EventArgs {
    pan: { e: MouseEventEx }
    panStart: { e: MouseEventEx }
    panEnd: { e: MouseEventEx }
  }
}
