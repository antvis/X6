import * as util from '../../util'
import { Graph } from '../../core'
import { MouseHandler } from '../handler-mouse'
import { MouseEventEx, DomEvent, Disposable } from '../../common'
import { ContextMenuOptions, ShowContextMenuArgs } from './option'

export class ContextMenuHandler extends MouseHandler {
  /**
   * Specifies is use left mouse button as context menu trigger.
   */
  isLeftButton: boolean

  /**
   * Specifies if cells should be selected if a contextmenu is
   * displayed for them.
   */
  selectOnPopup: boolean

  /**
   * Specifies if cells should be deselected if a contextmenu is
   * displayed for the diagram background.
   */
  clearSelectionOnBackground: boolean

  triggerX: number
  triggerY: number

  protected gestureHandler: () => void
  protected startX: number
  protected startY: number
  protected validTrigger: boolean
  protected inTolerance: boolean
  protected showing: boolean = false
  protected doHide: (() => void) | null
  protected doShow:
    ((args: ShowContextMenuArgs) => void) | null

  constructor(graph: Graph) {
    super(graph)
    this.config()

    // Does not show menu if any touch gestures take place after the trigger
    this.gestureHandler = () => {
      this.inTolerance = false
    }
    this.graph.on(Graph.events.gesture, this.gestureHandler)
  }

  protected config() {
    const options = this.graph.options.contextMenu as ContextMenuOptions

    this.isLeftButton = options.isLeftButton
    this.selectOnPopup = options.selectCellsOnContextMenu
    this.clearSelectionOnBackground = options.clearSelectionOnBackground
    this.doShow = options.show || null
    this.doHide = options.hide || null

    this.setEnadled(options.enabled)
  }

  isPopupTrigger(e: MouseEventEx) {
    return e.isPopupTrigger() || (
      this.isLeftButton &&
      DomEvent.isLeftMouseButton(e.getEvent())
    )
  }

  mouseDown(e: MouseEventEx) {
    const evt = e.getEvent()
    if (this.isEnabled() && !DomEvent.isMultiTouchEvent(evt)) {
      const me = DomEvent.getMainEvent(evt) as MouseEvent
      this.triggerX = e.getGraphX()
      this.triggerY = e.getGraphY()
      this.startX = me.screenX
      this.startY = me.screenY
      this.validTrigger = this.isPopupTrigger(e)
      this.inTolerance = true
    }
  }

  mouseMove(e: MouseEventEx) {
    if (this.inTolerance && this.startX != null && this.startY != null) {
      const me = DomEvent.getMainEvent(e.getEvent()) as MouseEvent
      if (
        Math.abs(me.screenX - this.startX) > this.graph.tolerance ||
        Math.abs(me.screenY - this.startY) > this.graph.tolerance
      ) {
        this.inTolerance = false
      }
    }
  }

  mouseUp(e: MouseEventEx) {
    if (this.validTrigger && this.inTolerance) {
      const cell = this.getCell(e)
      if (this.graph.isEnabled()) {
        if (
          cell != null &&
          this.selectOnPopup &&
          !this.graph.isCellSelected(cell)
        ) {
          this.graph.setSelectedCell(cell)
        }

        if (cell == null && this.clearSelectionOnBackground) {
          this.clearSelectionOnBackground
        }
      }

      // Hides the tooltip if there is one
      this.graph.hideTooltip()

      if (this.doShow) {
        const origin = util.getScrollOrigin(document.body)
        this.doShow.call(this.graph, {
          cell,
          e: e.getEvent(),
          x: e.getClientX() + origin.x,
          y: e.getClientY() + origin.y,
        })
      }

      this.showing = true
      e.consume()
    }

    this.validTrigger = false
    this.inTolerance = false
  }

  hideMenu() {
    this.showing = false
    this.doHide && this.doHide()
  }

  isShowing() {
    return this.showing
  }

  @Disposable.aop()
  dispose() {
    this.graph.removeMouseListener(this)
    this.graph.off(Graph.events.gesture, this.gestureHandler)
  }
}
