import * as util from '../util'
import { Graph } from '../core'
import { MouseHandler } from '.'
import { MouseEventEx, DomEvent, detector, Disposable } from '../common'
import { Rectangle, Point } from '../struct'
import { getRubberbandStyle, RubberbandOptions } from '../option'

export class RubberbandHandler extends MouseHandler {
  /**
   * Specifies the default opacity to be used for the rubberband div.
   *
   * Default is `0.2`.
   */
  opacity: number = 0.2

  /**
   * Optional fade out effect.
   *
   * Default is `false`.
   */
  fadeOut: boolean = false

  /**
   * Holds the DIV element which is currently visible.
   */
  div: HTMLDivElement | null = null

  /**
   * Holds the DIV element which is used to display the rubberband.
   */
  protected sharedDiv: HTMLDivElement | null = null

  private onPan: () => void
  private onGesture: () => void
  private onMouseEvent: (
    arg: {
      eventName: string,
      e: MouseEventEx,
    },
  ) => void
  private onMouseMove: null | ((e: MouseEvent) => void)
  private onMouseUp: null | ((e: MouseEvent) => void)

  protected origin: Point | null
  protected currentX: number = 0
  protected currentY: number = 0

  protected x: number
  protected y: number
  protected width: number
  protected height: number

  constructor(graph: Graph) {
    super(graph)
    this.config()
    this.graph.addMouseListener(this)

    // Handles force rubberband event
    this.onMouseEvent = ({ eventName, e }) => {
      if (
        eventName === DomEvent.MOUSE_DOWN &&
        this.isForceRubberbandEvent(e)
      ) {
        this.prepare(e)
      }
    }

    this.graph.on(Graph.events.fireMouseEvent, this.onMouseEvent)

    this.onPan = () => { this.repaint() }
    this.graph.on(Graph.events.translate, this.onPan)

    this.onGesture = () => {
      if (this.origin != null) {
        this.reset()
      }
    }

    this.graph.on(Graph.events.gesture, this.onGesture)
  }

  config() {
    const options = this.graph.options.rubberband as RubberbandOptions

    if (options.enabled) {
      this.enable()
    } else {
      this.disable()
    }

    this.fadeOut = options.fadeOut

    if (typeof options.opacity === 'number') {
      this.opacity = options.opacity
    }
  }

  protected getNativeClassName() {
    return `${this.graph.prefixCls}-rubberband`
  }

  /**
   * Returns true if the given event should start rubberband selection.
   */
  protected isForceRubberbandEvent(e: MouseEventEx) {
    return DomEvent.isAltDown(e.getEvent())
  }

  protected getPosition(e: MouseEventEx) {
    const origin = util.getScrollOrigin(this.graph.container)
    const offset = util.getOffset(this.graph.container)

    origin.x -= offset.x
    origin.y -= offset.y

    return {
      x: e.getClientX() + origin.x,
      y: e.getClientY() + origin.y,
    }
  }

  /**
   * Handles the event by initiating a rubberband selection.
   */
  mouseDown(e: MouseEventEx) {
    if (
      this.isEnabled() &&
      this.graph.isEnabled() &&
      !e.isConsumed() &&
      e.getState() == null && // on background
      !DomEvent.isMultiTouchEvent(e.getEvent())
    ) {
      this.prepare(e)
    }
  }

  protected prepare(e: MouseEventEx) {
    const { x, y } = this.getPosition(e)
    this.start(x, y)

    // Does not prevent the default for this event so that the
    // event processing chain is still executed even if we start
    // rubberbanding.
    e.consume(false)
  }

  /**
   * Sets the start point for the rubberband selection.
   */
  protected start(x: number, y: number) {
    this.origin = new Point(x, y)

    const container = this.graph.container

    const createEvent = (e: MouseEvent) => {
      const me = new MouseEventEx(e)
      const pt = util.clientToGraph(container, me.getClientX(), me.getClientY())

      me.graphX = pt.x
      me.graphY = pt.y

      return me
    }

    this.onMouseMove = (e: MouseEvent) => {
      this.mouseMove(createEvent(e))
    }

    this.onMouseUp = (e: MouseEvent) => {
      this.mouseUp(createEvent(e))
    }

    // Workaround for rubberband stopping if the
    // mouse leaves the container in Firefox
    if (detector.IS_FIREFOX) {
      DomEvent.addMouseListeners(
        document, null, this.onMouseMove, this.onMouseUp,
      )
    }
  }

  /**
   * Handles the event by updating therubberband selection.
   */
  mouseMove(e: MouseEventEx) {
    if (!e.isConsumed() && this.origin != null) {
      const { x, y } = this.getPosition(e)
      const dx = this.origin.x - x
      const dy = this.origin.y - y
      const tol = this.graph.tolerance

      if (this.div != null || Math.abs(dx) > tol || Math.abs(dy) > tol) {
        if (this.div == null) {
          this.div = this.createShape()
        }

        // Clears selection while rubberbanding. This is required because
        // the event is not consumed in mouseDown.
        util.clearSelection()

        this.update(x, y)
        e.consume()
      }
    }
  }

  /**
   * Creates the rubberband selection shape.
   */
  protected createShape() {
    if (this.sharedDiv == null) {
      this.sharedDiv = document.createElement('div')
      this.sharedDiv.className = this.getNativeClassName()
      this.sharedDiv.style.opacity = `${this.opacity}`
    }

    this.graph.container.appendChild(this.sharedDiv)
    const result = this.sharedDiv

    // if fade out, then create a new div everytime
    if (this.fadeOut) {
      this.sharedDiv = null
    }

    return result
  }

  /**
   * Returns true if this handler is active.
   */
  protected isActive() {
    return this.div != null && this.div.style.display !== 'none'
  }

  mouseUp(e: MouseEventEx) {
    const active = this.isActive()
    this.reset()

    if (active) {
      this.execute(e.getEvent())
      e.consume()
    }
  }

  /**
   * Resets the state of this handler and selects the current region
   * for the given event.
   */
  protected execute(e: MouseEvent) {
    const rect = new Rectangle(this.x, this.y, this.width, this.height)
    console.log(rect)
    this.graph.selectCellsInRegion(rect, e)
  }

  protected reset() {
    if (this.div != null) {
      if (this.fadeOut) {
        const temp = this.div
        util.setPrefixedStyle(temp.style, 'transition', 'all 0.2s linear')
        temp.style.pointerEvents = 'none'
        temp.style.opacity = '0'

        window.setTimeout(() => { util.removeElement(temp) }, 200)
      } else {
        util.removeElement(this.div)
      }
    }

    DomEvent.removeMouseListeners(
      document, null, this.onMouseMove, this.onMouseUp,
    )

    this.onMouseMove = null
    this.onMouseUp = null

    this.currentX = 0
    this.currentY = 0
    this.origin = null
    this.div = null
  }

  protected update(x: number, y: number) {
    this.currentX = x
    this.currentY = y

    this.repaint()
  }

  /**
   * Computes the bounding box and updates the style of the <div>.
   */
  protected repaint() {
    if (this.div && this.origin) {
      const x = this.currentX - this.graph.tx
      const y = this.currentY - this.graph.ty

      this.x = Math.min(this.origin.x, x)
      this.y = Math.min(this.origin.y, y)
      this.width = Math.max(this.origin.x, x) - this.x
      this.height = Math.max(this.origin.y, y) - this.y

      const style = getRubberbandStyle({
        graph: this.graph,
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
      })

      if (style.className) {
        this.div.className = `${this.getNativeClassName()} ${style.className}`
      }

      if (style.opacity != null) {
        this.div.style.opacity = `${style.opacity}`
      }

      if (style.border != null) {
        this.div.style.border = style.border
      }

      if (style.background != null) {
        this.div.style.background = style.background
      }

      this.div.style.position = 'absolute'
      this.div.style.left = util.toPx(this.x)
      this.div.style.top = util.toPx(this.y)
      this.div.style.width = util.toPx(Math.max(1, this.width))
      this.div.style.height = util.toPx(Math.max(1, this.height))
    }
  }

  @Disposable.aop()
  dispose() {
    this.graph.removeMouseListener(this)
    this.graph.off(Graph.events.translate, this.onPan)
    this.graph.off(Graph.events.gesture, this.onGesture)
    this.graph.off(Graph.events.fireMouseEvent, this.onMouseEvent)

    this.reset()

    if (this.sharedDiv != null) {
      this.sharedDiv = null
    }
  }
}
