import * as util from '../../util'
import { MouseHandler } from '../handler-mouse'
import { Graph } from '../../core'
import { MouseEventEx, DomEvent, Disposable } from '../../common'

export class PanningHandler extends MouseHandler {
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
   * Specifies if panning should be enabled.
   *
   * Default is `true`.
   */
  panningEnabled: boolean = true

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

  private mouseUpListener: () => void
  private forcePanningHandler: (arg: {
    eventName: string
    e: MouseEventEx,
  }) => void
  private gestureHandler: (arg: { e: MouseEvent }) => void

  protected dx: number | null = null
  protected dy: number | null = null
  protected startX: number = 0
  protected startY: number = 0
  protected active: boolean = false
  protected initialScale: number | null = null
  protected mouseDownEvent: MouseEventEx | null
  protected dx0: number
  protected dy0: number
  panningTrigger: boolean

  constructor(graph: Graph) {
    super(graph)

    // Handles force panning event
    this.forcePanningHandler = ({ eventName, e }) => {
      if (eventName === DomEvent.MOUSE_DOWN && this.isForcePanningEvent(e)) {
        this.start(e)
        this.active = true
        this.trigger(PanningHandler.events.panStart, { e })
        e.consume()
      }
    }

    this.graph.on(Graph.events.fireMouseEvent, this.forcePanningHandler)

    // Handles pinch gestures
    this.gestureHandler = ({ e }) => {
      if (this.pinchEnabled) {
        if (!DomEvent.isConsumed(e) && e.type === 'gesturestart') {
          this.initialScale = this.graph.view.scale

          // Forces start of panning when pinch gesture starts
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

    this.graph.on(Graph.events.gesture, this.gestureHandler)

    this.mouseUpListener = () => {
      if (this.active) {
        this.reset()
      }
    }

    DomEvent.addListener(document, 'mouseup', this.mouseUpListener)
  }

  disablePanning() {
    this.panningEnabled = false
  }

  enablePanning() {
    this.panningEnabled = true
  }

  togglePanning() {
    this.panningEnabled = !this.panningEnabled
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
   * Returns true if the given event should start panning.
   */
  protected isForcePanningEvent(e: MouseEventEx) {
    return this.ignoreCell || DomEvent.isMultiTouchEvent(e.getEvent())
  }

  /**
   * Returns true if the given event is a panning trigger for the
   * optional given cell.
   */
  protected isPanningTrigger(e: MouseEventEx) {
    const evt = e.getEvent()

    return (
      (e.getState() == null &&
        this.useLeftButtonForPanning &&
        DomEvent.isLeftMouseButton(evt)) ||
      (DomEvent.isControlDown(evt) && DomEvent.isShiftDown(evt)) ||
      (this.usePopupTrigger && DomEvent.isPopupTrigger(evt))
    )
  }

  /**
   * Returns true if the handler is currently active.
   */
  isActive() {
    return this.active || this.initialScale != null
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
      this.consume(e, DomEvent.MOUSE_DOWN)
    }
  }

  /**
   * Starts panning at the given event.
   */
  protected start(e: MouseEventEx) {
    this.startX = e.getClientX()
    this.startY = e.getClientY()
    this.dx = null
    this.dy = null
    this.dx0 = -this.graph.container.scrollLeft
    this.dy0 = -this.graph.container.scrollTop

    this.panningTrigger = true
  }

  /**
   * Handles the event by updating the panning on the graph.
   */
  mouseMove(e: MouseEventEx) {
    this.dx = e.getClientX() - this.startX
    this.dy = e.getClientY() - this.startY

    if (this.active) {
      if (this.previewEnabled) {
        if (this.useGrid) {
          this.dx = this.graph.snap(this.dx)
          this.dy = this.graph.snap(this.dy)
        }

        this.graph.pan(this.dx + this.dx0, this.dy + this.dy0)
      }

      this.trigger(PanningHandler.events.pan, { e })
    } else if (this.panningTrigger) {
      const tmp = this.active
      // Panning is activated only if the mouse is moved
      // beyond the graph tolerance
      this.active =
        Math.abs(this.dx) > this.graph.tolerance ||
        Math.abs(this.dy) > this.graph.tolerance

      if (!tmp && this.active) {
        this.trigger(PanningHandler.events.panStart, { e })
      }
    }

    if (this.active || this.panningTrigger) {
      e.consume()
    }
  }

  /**
   * Handles the event by setting the translation on the view or
   * showing the contextmenu.
   */
  mouseUp(e: MouseEventEx) {
    if (this.active) {
      if (this.dx != null && this.dy != null) {
        // Ignores if scrollbars have been used for panning
        if (
          !this.graph.useScrollbarsForPanning ||
          !util.hasScrollbars(this.graph.container)
        ) {
          const scale = this.graph.view.scale
          const trans = this.graph.view.translate
          this.graph.pan(0, 0)
          this.panGraph(trans.x + this.dx / scale, trans.y + this.dy / scale)
        }

        e.consume()
      }
      this.trigger(PanningHandler.events.panEnd, { e })
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

  protected panGraph(dx: number, dy: number) {
    this.graph.view.setTranslate(dx, dy)
  }

  @Disposable.aop()
  dispose() {
    this.graph.removeMouseListener(this)
    this.graph.off(Graph.events.fireMouseEvent, this.forcePanningHandler)
    this.graph.off(Graph.events.gesture, this.gestureHandler)

    DomEvent.removeListener(document, 'mouseup', this.mouseUpListener)
  }
}

export namespace PanningHandler {
  export const events = {
    pan: 'pan',
    panStart: 'panStart',
    panEnd: 'panEnd',
  }
}
