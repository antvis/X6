import { detector } from './detector'
import { isAncestorNode } from '../util'
import { Graph } from '../core'
import { Shape } from '../shape'
import { CellState } from '../core/cell-state'
import { DomEvent } from './dom-event'

export class CustomMouseEvent {
  e: MouseEvent
  state: CellState | null
  consumed: boolean = false

  /**
   * The x-coordinate of the event in the graph.
   */
  graphX: number
  /**
   * The y-coordinate of the event in the graph.
   */
  graphY: number

  constructor(e: MouseEvent, state?: CellState | null) {
    this.e = e
    this.state = state || null
  }

  getEvent() {
    return this.e
  }

  getSource() {
    return DomEvent.getSource(this.e) as HTMLElement
  }

  isSource(shape: Shape) {
    if (shape != null) {
      return isAncestorNode(shape.elem as HTMLElement, this.getSource())
    }

    return false
  }

  getX() {
    return DomEvent.getClientX(this.e)
  }

  getY() {
    return DomEvent.getClientY(this.e)
  }

  getGraphX() {
    return this.graphX
  }

  getGraphY() {
    return this.graphY
  }

  getState() {
    return this.state
  }

  getCell() {
    const state = this.getState()
    if (state != null) {
      return state.cell
    }
    return null
  }

  isPopupTrigger() {
    return DomEvent.isPopupTrigger(this.e)
  }

  isConsumed() {
    return this.consumed
  }

  consume(preventDefault?: boolean) {
    const shouldPreventDefault = preventDefault != null
      ? preventDefault
      : DomEvent.isMouseEvent(this.e)

    if (shouldPreventDefault && this.e.preventDefault) {
      this.e.preventDefault()
    }

    // Workaround for images being dragged in IE
    // Does not change returnValue in Opera
    if (detector.IS_IE) {
      this.e.returnValue = true
    }

    this.consumed = true
  }
}

export namespace CustomMouseEvent {
  export function redirectMouseEvents(
    elem: HTMLElement,
    graph: Graph,
    state: CellState | ((e: MouseEvent) => CellState),
    onMouseDown?: (e: MouseEvent) => any,
    onMouseMove?: (e: MouseEvent) => any,
    onMouseUp?: (e: MouseEvent) => any,
    onDblClick?: (e: MouseEvent) => any,
  ) {
    const getState = function (e: MouseEvent) {
      return (typeof state === 'function') ? state(e) : state
    }

    DomEvent.addGestureListeners(
      elem,
      (e: MouseEvent) => {
        if (onMouseDown != null) {
          onMouseDown(e)
        } else if (!DomEvent.isConsumed(e)) {
          graph.fireMouseEvent('mouseDown', new CustomMouseEvent(e, getState(e)))
        }
      },
      (e: MouseEvent) => {
        if (onMouseMove != null) {
          onMouseMove(e)
        } else if (!DomEvent.isConsumed(e)) {
          graph.fireMouseEvent('mouseMove', new CustomMouseEvent(e, getState(e)))
        }
      },
      (e: MouseEvent) => {
        if (onMouseUp != null) {
          onMouseUp(e)
        } else if (!DomEvent.isConsumed(e)) {
          graph.fireMouseEvent('mouseUp', new CustomMouseEvent(e, getState(e)))
        }
      },
    )

    DomEvent.addListener(elem, 'dblclick', (e: MouseEvent) => {
      if (onDblClick != null) {
        onDblClick(e)
      } else if (!DomEvent.isConsumed(e)) {
        const tmp = getState(e)
        graph.dblClick(e, (tmp != null) ? tmp.cell : null)
      }
    })
  }
}
