import * as util from '../../util'
import { MouseHandler } from '../handler-mouse'
import { Graph, State, Cell } from '../../core'
import { DomEvent, MouseEventEx, Disposable } from '../../common'
import { TooltipOptions, ShowTooltipArgs } from './option'

export class TooltipHandler extends MouseHandler {
  /**
   * Specifies if touch and pen events should be ignored.
   *
   * Default is `true`.
   */
  ignoreTouchEvents: boolean = true

  /**
   * Specifies if the tooltip should be hidden if the mouse is moved over
   * the current cell.
   *
   * Default is `false`.
   */
  hideOnHover: boolean = false

  delay: number = 500
  zIndex: number = 9999

  protected doHide: (() => void) | null
  protected doShow: ((args: ShowTooltipArgs) => void) | null

  protected timer: number | null
  protected lastX: number
  protected lastY: number
  protected state: State | null
  protected sourceElem: HTMLElement
  protected isStateSource: boolean
  protected showing: boolean = false

  constructor(graph: Graph) {
    super(graph)
    this.config()
  }

  config() {
    const options = this.graph.options.tooltip as TooltipOptions
    this.delay = options.delay
    this.zIndex = options.zIndex
    this.hideOnHover = options.hideOnHover
    this.ignoreTouchEvents = options.ignoreTouchEvents
    this.doShow = options.show || null
    this.doHide = options.hide || null
    this.setEnadled(options.enabled)
  }

  mouseDown(e: MouseEventEx) {
    this.reset(e, false)
    this.hideTooltip()
  }

  mouseMove(e: MouseEventEx) {
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
              this.isStateSource === (
                e.isSource(state.shape) ||
                !e.isSource(state.text)
              )
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

  mouseUp(e: MouseEventEx) {
    this.reset(e, true)
    this.hideTooltip()
  }

  show(
    cell: Cell,
    elem: HTMLElement,
    tip: string | HTMLElement | null,
    x: number,
    y: number,
  ) {
    if (this.canShow(tip)) {
      this.showing = true
      if (this.doShow) {
        this.doShow.call(this.graph, { cell, elem, x, y, tip: tip! })
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
        util.isHtmlElem(tip)
      )
    )
  }

  protected reset(
    e: MouseEventEx,
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
                this.show(state!.cell, elem, tip, x, y)
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
      !this.isMouseDown() &&
      !this.graph.isEditing() &&
      !this.graph.contextMenuHandler.isShowing()
    )
  }

  protected clearTimer() {
    if (this.timer != null) {
      window.clearTimeout(this.timer)
      this.timer = null
    }
  }

  protected hideTooltip() {
    this.showing = false
    this.doHide && this.doHide.call(this.graph)
  }

  protected isHidden() {
    return !this.showing
  }

  @Disposable.aop()
  dispose() {
    this.graph.removeMouseListener(this)
  }
}
