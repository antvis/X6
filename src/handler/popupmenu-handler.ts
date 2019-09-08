import * as util from '../util'
import { MouseHandler } from './handler-mouse'
import { Graph } from '../core'
import { MouseEventEx, DomEvent } from '../common'

export class PopupMenuHandler extends MouseHandler {
  useLeftButtonForPopup: boolean = false

  /**
   * Specifies if cells should be selected if a popupmenu is displayed for them.
   *
   * Default is `true`.
   */
  selectOnPopup: boolean = true

  /**
   * Specifies if cells should be deselected if a popupmenu is displayed for
   * the diagram background.
   *
   * Default is `true`.
   */
  clearSelectionOnBackground: boolean = true

  protected gestureHandler: () => void
  protected triggerX: number
  protected triggerY: number
  protected screenX: number
  protected screenY: number
  protected validTrigger: boolean
  protected inTolerance: boolean
  protected showing: boolean = false

  constructor(graph: Graph) {
    super(graph)
    this.graph.addMouseListener(this)

    // Does not show menu if any touch gestures take place after the trigger
    this.gestureHandler = () => {
      this.inTolerance = false
    }
    this.graph.on(Graph.events.gesture, this.gestureHandler)
  }

  isPopupTrigger(e: MouseEventEx) {
    return e.isPopupTrigger() || (
      this.useLeftButtonForPopup &&
      DomEvent.isLeftMouseButton(e.getEvent())
    )
  }

  mouseDown(e: MouseEventEx) {
    const evt = e.getEvent()
    if (this.isEnabled() && !DomEvent.isMultiTouchEvent(evt)) {
      const me = DomEvent.getMainEvent(evt) as MouseEvent
      this.triggerX = e.getGraphX()
      this.triggerY = e.getGraphY()
      this.screenX = me.screenX
      this.screenY = me.screenY
      this.validTrigger = this.isPopupTrigger(e)
      this.inTolerance = true
    }
  }

  mouseMove(e: MouseEventEx) {
    if (this.inTolerance && this.screenX != null && this.screenY != null) {
      const me = DomEvent.getMainEvent(e.getEvent()) as MouseEvent
      if (
        Math.abs(me.screenX - this.screenX) > this.graph.tolerance ||
        Math.abs(me.screenY - this.screenY) > this.graph.tolerance
      ) {
        this.inTolerance = false
      }
    }
  }

  mouseUp(e: MouseEventEx) {
    if (this.validTrigger && this.inTolerance) {
      const cell = this.getCell(e)

      // Selects the cell for which the context menu is being displayed
      if (
        this.graph.isEnabled() &&
        this.selectOnPopup &&
        cell != null &&
        !this.graph.isCellSelected(cell)
      ) {
        this.graph.setSelectedCell(cell)
      } else if (this.clearSelectionOnBackground && cell == null) {
        this.graph.clearSelection()
      }

      // Hides the tooltip if there is one
      this.graph.hideTooltip()

      const origin = util.getScrollOrigin(document.body)
      this.graph.trigger(Graph.events.showContextMenu, {
        cell,
        e: e.getEvent(),
        x: e.getClientX() + origin.x,
        y: e.getClientY() + origin.y,
      })
      this.showing = true
      e.consume()
    }

    this.validTrigger = false
    this.inTolerance = false
  }

  hideMenu() {
    this.showing = false
    this.graph.trigger(Graph.events.hideContextMenu)
  }

  isMenuShowing() {
    return this.showing
  }

  dispose() {
    if (this.disposed) {
      return
    }

    this.graph.removeMouseListener(this)
    this.graph.off(Graph.events.gesture, this.gestureHandler)

    super.dispose()
  }
}
