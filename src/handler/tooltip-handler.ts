import * as util from '../util'
import { MouseHandler } from './handler-mouse'
import { Graph, State } from '../core'
import { DomEvent, CustomMouseEvent } from '../common'

export class TooltipHandler extends MouseHandler {
  /**
   * Delay to show the tooltip in milliseconds.
   */
  delay: number

  zIndex: number = 9999

  /**
   * Specifies if touch and pen events should be ignored.
   *
   * Default is `true`.
   */
  ignoreTouchEvents: boolean = true

  /**
   * Specifies if the tooltip should be hidden if the mouse is moved over the
   * current cell.
   *
   * Default is `false`.
   */
  hideOnHover = false

  protected elem: HTMLDivElement | null = null
  protected timer: number | null
  protected lastX: number
  protected lastY: number
  protected state: State | null
  protected sourceElem: HTMLElement
  protected isStateSource: boolean

  constructor(graph: Graph, delay: number = 500) {
    super(graph)
    this.delay = delay
    this.graph.addMouseListener(this)
  }

  mouseDown(e: CustomMouseEvent) {
    this.reset(e, false)
    this.hideTooltip()
  }

  mouseMove(e: CustomMouseEvent) {
    const clientX = e.getClientX()
    const clientY = e.getClientY()

    if (clientX !== this.lastX || clientY !== this.lastY) {
      this.reset(e, true)
      const state = this.getState(e)

      if (
        this.hideOnHover ||
        this.state !== state ||
        (
          e.getSource() !== this.sourceElem &&
          (
            !this.isStateSource ||
            (
              state &&
              this.isStateSource === (e.isSource(state.shape) || !e.isSource(state.text))
            )
          )
        )
      ) {
        // hide current tooltip
        this.hideTooltip()
      }
    }

    this.lastX = e.getClientX()
    this.lastY = e.getClientY()
  }

  mouseUp(e: CustomMouseEvent) {
    this.reset(e, true)
    this.hideTooltip()
  }

  show(tip: string | HTMLElement | null, x: number, y: number) {
    if (this.canShow(tip)) {
      if (this.elem == null) {
        this.init()
      }

      if (this.elem) {
        const origin = util.getScrollOrigin(document.body)

        this.elem.style.zIndex = `${this.zIndex}`
        this.elem.style.left = util.toPx(x + origin.x)
        this.elem.style.top = util.toPx(y + origin.y)

        if (util.isHTMLNode(tip)) {
          this.elem.innerHTML = ''
          this.elem.appendChild(tip as HTMLElement)
        } else {
          this.elem.innerHTML = (tip as string).replace(/\n/g, '<br>')
        }

        this.elem.style.visibility = ''

        util.ensureInViewport(this.elem)
      }
    }
  }

  hide() {
    this.clearTimer()
    this.hideTooltip()
  }

  protected canShow(tip: string | HTMLElement | null) {
    return !this.disposed && this.enabled && this.validateTip(tip)
  }

  protected validateTip(tip: string | HTMLElement | null) {
    return (
      (tip != null) && (
        (util.isString(tip) && (tip as string).length > 0) ||
        util.isHTMLNode(tip)
      )
    )
  }

  protected reset(
    e: CustomMouseEvent,
    restart: boolean = false,
    state: State | null = null,
  ) {
    if (!this.ignoreTouchEvents || DomEvent.isMouseEvent(e.getEvent())) {
      this.clearTimer()

      if (restart && this.isEnabled() && this.isHidden()) {

        state = state || this.getState(e) // tslint:disable-line

        if (state != null) {
          const x = e.getClientX()
          const y = e.getClientY()
          const elem = e.getSource()
          const isStateSource = e.isSource(state.shape) || e.isSource(state.text)

          this.timer = window.setTimeout(
            () => {
              if (this.willShow()) {
                const tip = this.graph.cellManager.getTooltip(state!, elem, x, y)
                this.show(tip, x, y)
                this.state = state!
                this.sourceElem = elem
                this.isStateSource = isStateSource
              }
            },
            this.delay,
          )
        }
      }
    }
  }

  protected willShow() {
    return (
      !this.disposed &&
      !this.graph.eventloop.isMouseDown &&
      !this.graph.isEditing() &&
      (
        !this.graph.popupMenuHandler ||
        !this.graph.popupMenuHandler.isMenuShowing()
      )
    )
  }

  protected clearTimer() {
    if (this.timer != null) {
      window.clearTimeout(this.timer)
      this.timer = null
    }
  }

  protected hideTooltip() {
    if (this.elem != null) {
      this.elem.style.visibility = 'hidden'
      this.elem.innerHTML = ''
    }
  }

  protected isHidden() {
    return (
      this.elem == null ||
      this.elem.style.visibility === 'hidden'
    )
  }

  protected init() {
    if (document.body != null) {
      this.elem = document.createElement('div')
      this.elem.className = 'x6-tooltip'
      this.elem.style.visibility = 'hidden'

      document.body.appendChild(this.elem)

      DomEvent.addMouseListeners(this.elem, () => {
        this.hideTooltip()
      })
    }
  }

  dispose() {
    if (this.disposed) {
      return
    }

    this.graph.removeMouseListener(this)

    if (this.elem != null) {
      DomEvent.release(this.elem)
      util.removeElement(this.elem)
      this.elem = null
    }

    super.dispose()
  }
}
