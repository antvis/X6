import { Point } from '../geometry'
import { Platform } from '../util'
import { DomUtil, DomEvent } from '../dom'
import { Graph } from '../graph/graph'
import { State } from '../core/state'
import { Shape } from '../shape'

export class MouseEventEx {
  e: MouseEvent
  state: State | null
  consumed: boolean = false

  /**
   * The x-coordinate of the event in the graph.
   */
  graphX: number

  /**
   * The y-coordinate of the event in the graph.
   */
  graphY: number

  constructor(e: MouseEvent, state?: State | null) {
    this.e = e
    this.state = state || null
  }

  getEvent() {
    return this.e
  }

  getSource() {
    return DomEvent.getSource(this.e) as HTMLElement
  }

  isSource(shape: Shape | null) {
    if (shape != null) {
      return DomUtil.isAncestor(shape.elem as HTMLElement, this.getSource())
    }

    return false
  }

  getClientX() {
    return DomEvent.getClientX(this.e)
  }

  getClientY() {
    return DomEvent.getClientY(this.e)
  }

  getClientPos() {
    return new Point(this.getClientX(), this.getClientY())
  }

  getGraphX() {
    return this.graphX
  }

  getGraphY() {
    return this.graphY
  }

  getGraphPos() {
    return new Point(this.graphX, this.graphY)
  }

  getState() {
    return this.state
  }

  getCell() {
    const state = this.getState()
    return state ? state.cell : null
  }

  isPopupTrigger() {
    return DomEvent.isPopupTrigger(this.e)
  }

  isConsumed() {
    return this.consumed
  }

  consume(preventDefault?: boolean) {
    const shouldPreventDefault =
      preventDefault != null ? preventDefault : DomEvent.isMouseEvent(this.e)

    if (shouldPreventDefault && this.e.preventDefault) {
      this.e.preventDefault()
    }

    // Workaround for images being dragged in IE
    // Does not change returnValue in Opera
    if (Platform.IS_IE) {
      this.e.returnValue = true
    }

    this.consumed = true
  }
}

export namespace MouseEventEx {
  /**
   * Redirects the mouse events from the given DOM node to the graph
   * dispatch loop using the event and given state as event arguments.
   */
  export function redirectMouseEvents(
    elem: HTMLElement | SVGElement | null,
    graph: Graph,
    state: State | ((e: MouseEvent) => State) | null,
    onMouseDown?: ((e: MouseEvent) => any) | null,
    onMouseMove?: ((e: MouseEvent) => any) | null,
    onMouseUp?: ((e: MouseEvent) => any) | null,
    onDblClick?: ((e: MouseEvent) => any) | null,
  ) {
    if (elem == null) {
      return
    }

    const getState = (e: MouseEvent) => {
      return typeof state === 'function' ? state(e) : state
    }

    DomEvent.addMouseListeners(
      elem,
      (e: MouseEvent) => {
        if (onMouseDown) {
          onMouseDown(e)
        } else if (!DomEvent.isConsumed(e)) {
          graph.dispatchMouseEvent(
            'mouseDown',
            new MouseEventEx(e, getState(e)),
          )
        }
      },
      (e: MouseEvent) => {
        if (onMouseMove) {
          onMouseMove(e)
        } else if (!DomEvent.isConsumed(e)) {
          graph.dispatchMouseEvent(
            'mouseMove',
            new MouseEventEx(e, getState(e)),
          )
        }
      },
      (e: MouseEvent) => {
        if (onMouseUp) {
          onMouseUp(e)
        } else if (!DomEvent.isConsumed(e)) {
          graph.dispatchMouseEvent('mouseUp', new MouseEventEx(e, getState(e)))
        }
      },
    )

    DomEvent.addListener(elem, 'dblclick', (e: MouseEvent) => {
      if (onDblClick) {
        onDblClick(e)
      } else if (!DomEvent.isConsumed(e)) {
        const state = getState(e)
        graph.eventloopManager.dblClick(e, state ? state.cell : null)
      }
    })
  }
}
